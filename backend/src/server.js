const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const https = require('node:https')
const cors = require('cors')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3002
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json')
const GIGACHAT_AUTH_KEY = process.env.GIGACHAT_AUTH_KEY
const GIGACHAT_SCOPE = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS'
const GIGACHAT_MODEL = process.env.GIGACHAT_MODEL || 'GigaChat-2-Pro'
const GIGACHAT_OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
const GIGACHAT_CHAT_URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions'
const GIGACHAT_TLS_REJECT_UNAUTHORIZED = process.env.GIGACHAT_TLS_REJECT_UNAUTHORIZED !== 'false'

const gigachatHttpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: GIGACHAT_TLS_REJECT_UNAUTHORIZED,
})

let gigachatTokenCache = {
  accessToken: null,
  expiresAt: 0,
}

const defaultDb = {
  collections: [],
  explanations: [],
  favorites: [],
  history: [],
  notes: [],
  slangMemes: [],
}

app.use(cors())
app.use(express.json())

async function ensureDb() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })

  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2))
  }
}

async function readDb() {
  await ensureDb()
  const raw = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

async function writeDb(nextDb) {
  await fs.writeFile(DB_PATH, JSON.stringify(nextDb, null, 2))
}

async function updateDb(updater) {
  const currentDb = await readDb()
  const nextDb = await updater(currentDb)
  await writeDb(nextDb)
  return nextDb
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeSlug(value) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'slang'
  )
}

function badRequest(response, message) {
  return response.status(400).json({ message })
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function requestRaw(url, { body, headers = {}, method = 'GET' }) {
  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        agent: gigachatHttpsAgent,
        headers,
        method,
      },
      (response) => {
        let raw = ''

        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          raw += chunk
        })
        response.on('end', () => {
          let parsedBody = null

          if (raw) {
            try {
              parsedBody = JSON.parse(raw)
            } catch {
              parsedBody = raw
            }
          }

          resolve({
            body: parsedBody,
            headers: response.headers,
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode ?? 0,
          })
        })
      },
    )

    request.on('error', (error) => {
      reject(error)
    })

    if (body) {
      request.write(body)
    }

    request.end()
  })
}

function requestJson(url, options) {
  return requestRaw(url, options)
}

function getGigachatAuthKey() {
  if (!GIGACHAT_AUTH_KEY) {
    throw new Error('GIGACHAT_AUTH_KEY is not configured')
  }

  return GIGACHAT_AUTH_KEY
}

async function getGigachatAccessToken() {
  const now = Date.now()

  if (gigachatTokenCache.accessToken && gigachatTokenCache.expiresAt - 60_000 > now) {
    return gigachatTokenCache.accessToken
  }

  const authKey = getGigachatAuthKey()
  const response = await requestJson(GIGACHAT_OAUTH_URL, {
    body: new URLSearchParams({ scope: GIGACHAT_SCOPE }).toString(),
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${authKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      RqUID: crypto.randomUUID(),
    },
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(
      `Failed to authorize in GigaChat: ${response.status} ${JSON.stringify(response.body)}`,
    )
  }

  const payload = response.body
  const accessToken = payload?.access_token
  const expiresAt = Number(payload?.expires_at)

  if (!accessToken || !expiresAt) {
    throw new Error('GigaChat authorization response is missing access_token or expires_at')
  }

  gigachatTokenCache = {
    accessToken,
    expiresAt,
  }

  return accessToken
}

async function generateExplanationText(title) {
  const accessToken = await getGigachatAccessToken()
  const response = await requestJson(GIGACHAT_CHAT_URL, {
    body: JSON.stringify({
      max_tokens: 220,
      messages: [
        {
          content:
            'Ты объясняешь интернет-мемы простым русским языком. Отвечай коротко, по делу, без списков и без дисклеймеров.',
          role: 'system',
        },
        {
          content: `Объясни мем с названием "${title}". Напиши 2-4 предложения на русском: что это за мем, в чем обычно шутка и в каких ситуациях его используют. Если мем неоднозначный, честно скажи это и дай наиболее вероятное объяснение.`,
          role: 'user',
        },
      ],
      model: GIGACHAT_MODEL,
      repetition_penalty: 1,
      stream: false,
    }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(
      `Failed to generate explanation in GigaChat: ${response.status} ${JSON.stringify(response.body)}`,
    )
  }

  const payload = response.body
  const content = payload?.choices?.[0]?.message?.content?.trim()

  if (!content) {
    throw new Error('GigaChat returned an empty explanation')
  }

  return content
}

function extractJsonObject(value) {
  const start = value.indexOf('{')
  const end = value.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('GigaChat did not return a JSON object')
  }

  return JSON.parse(value.slice(start, end + 1))
}

function assertHttpImageUrl(url) {
  if (typeof url !== 'string') {
    return false
  }

  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

async function canLoadImage(url) {
  try {
    const response = await requestRaw(url, {
      headers: {
        Accept: 'image/*',
        'User-Agent': 'MemeExplainer/1.0',
      },
      method: 'GET',
    })

    const contentType = String(response.headers['content-type'] ?? '')
    return response.ok && contentType.startsWith('image/')
  } catch {
    return false
  }
}

function createSlangPlaceholderImage(term) {
  const escapedTerm = term
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
  <rect width="960" height="720" fill="#fff8ec"/>
  <rect x="70" y="80" width="820" height="560" rx="36" fill="#251b14"/>
  <text x="110" y="185" fill="#fff8ec" font-family="Arial, sans-serif" font-size="58" font-weight="700">Сленг</text>
  <text x="110" y="330" fill="#f6c35f" font-family="Arial, sans-serif" font-size="72" font-weight="700">${escapedTerm}</text>
  <text x="110" y="440" fill="#fff8ec" font-family="Arial, sans-serif" font-size="38">Объяснение от GigaChat</text>
</svg>`.trim()

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

async function generateSlangMeme(term) {
  const accessToken = await getGigachatAccessToken()
  const response = await requestJson(GIGACHAT_CHAT_URL, {
    body: JSON.stringify({
      max_tokens: 420,
      messages: [
        {
          content:
            'Ты объясняешь интернет-сленг и мемные фразы простым русским языком. Отвечай только валидным JSON без markdown. Поля: title, explanation, imageUrl. imageUrl должен быть прямой http/https-ссылкой на релевантную картинку или мем, которую можно открыть в img src.',
          role: 'system',
        },
        {
          content: `Объясни сленговую или мемную фразу "${term}". Верни JSON: title — короткое название карточки; explanation — 2-4 предложения на русском, что это значит и где используется; imageUrl — ссылка на соответствующую картинку или мем.`,
          role: 'user',
        },
      ],
      model: GIGACHAT_MODEL,
      repetition_penalty: 1,
      stream: false,
    }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(
      `Failed to generate slang explanation in GigaChat: ${response.status} ${JSON.stringify(response.body)}`,
    )
  }

  const content = response.body?.choices?.[0]?.message?.content?.trim()

  if (!content) {
    throw new Error('GigaChat returned an empty slang response')
  }

  const parsed = extractJsonObject(content)
  const title = String(parsed.title || term).trim()
  const explanation = String(parsed.explanation || '').trim()
  const imageUrl = String(parsed.imageUrl || '').trim()

  if (!title || !explanation) {
    throw new Error('GigaChat returned incomplete slang data')
  }

  return {
    explanation,
    imageUrl:
      assertHttpImageUrl(imageUrl) && (await canLoadImage(imageUrl))
        ? imageUrl
        : createSlangPlaceholderImage(term),
    title,
  }
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/favorites', async (_request, response) => {
  const db = await readDb()
  response.json(db.favorites)
})

app.post('/api/favorites', async (request, response) => {
  const { memeId } = request.body

  if (!memeId) {
    return badRequest(response, 'memeId is required')
  }

  const db = await updateDb((currentDb) => {
    if (!currentDb.favorites.includes(memeId)) {
      currentDb.favorites.unshift(memeId)
    }

    return currentDb
  })

  return response.status(201).json(db.favorites)
})

app.delete('/api/favorites/:memeId', async (request, response) => {
  const { memeId } = request.params

  await updateDb((currentDb) => {
    currentDb.favorites = currentDb.favorites.filter((item) => item !== memeId)
    return currentDb
  })

  response.status(204).send()
})

app.get('/api/explanations', async (_request, response) => {
  const db = await readDb()
  response.json(db.explanations)
})

app.get('/api/slang/memes', async (_request, response) => {
  const db = await readDb()
  response.json(db.slangMemes ?? [])
})

app.post('/api/slang/explain', async (request, response) => {
  const { term } = request.body

  if (!term || !String(term).trim()) {
    return badRequest(response, 'term is required')
  }

  const normalizedTerm = String(term).trim()
  const currentDb = await readDb()
  const existingMeme = (currentDb.slangMemes ?? []).find(
    (item) => item.term.toLowerCase() === normalizedTerm.toLowerCase(),
  )

  if (existingMeme) {
    const imageIsAvailable = assertHttpImageUrl(existingMeme.url)
      ? await canLoadImage(existingMeme.url)
      : String(existingMeme.url).startsWith('data:image/')

    if (!imageIsAvailable) {
      existingMeme.url = createSlangPlaceholderImage(existingMeme.term)

      await updateDb((nextDb) => {
        nextDb.slangMemes = (nextDb.slangMemes ?? []).map((item) =>
          item.id === existingMeme.id ? existingMeme : item,
        )
        return nextDb
      })
    }

    let existingExplanation = currentDb.explanations.find((item) => item.memeId === existingMeme.id)

    if (!existingExplanation) {
      existingExplanation = {
        content: existingMeme.explanationSeed,
        id: createId('explanation'),
        memeId: existingMeme.id,
        updatedAt: new Date().toISOString(),
      }

      await updateDb((nextDb) => {
        nextDb.explanations = [existingExplanation, ...nextDb.explanations]
        return nextDb
      })
    }

    return response.json({
      explanation: existingExplanation,
      meme: existingMeme,
    })
  }

  try {
    const generated = await generateSlangMeme(normalizedTerm)
    const meme = {
      explanationSeed: generated.explanation,
      id: `slang-${normalizeSlug(normalizedTerm)}-${Date.now()}`,
      source: 'GigaChat slang',
      term: normalizedTerm,
      title: generated.title,
      url: generated.imageUrl,
    }
    const explanation = {
      content: generated.explanation,
      id: createId('explanation'),
      memeId: meme.id,
      updatedAt: new Date().toISOString(),
    }

    const db = await updateDb((nextDb) => {
      nextDb.slangMemes = [meme, ...(nextDb.slangMemes ?? [])]
      nextDb.explanations = [
        explanation,
        ...nextDb.explanations.filter((item) => item.memeId !== meme.id),
      ]
      return nextDb
    })

    return response.status(201).json({
      explanation: db.explanations.find((item) => item.id === explanation.id),
      meme: db.slangMemes.find((item) => item.id === meme.id),
    })
  } catch (error) {
    console.error('Failed to generate slang explanation', error)
    return response.status(502).json({ message: getErrorMessage(error) })
  }
})

app.post('/api/explanations', async (request, response) => {
  const { content, memeId } = request.body

  if (!memeId || !content) {
    return badRequest(response, 'memeId and content are required')
  }

  const explanation = {
    id: createId('explanation'),
    memeId,
    content,
    updatedAt: new Date().toISOString(),
  }

  const db = await updateDb((currentDb) => {
    currentDb.explanations = [
      explanation,
      ...currentDb.explanations.filter((item) => item.memeId !== memeId),
    ]
    return currentDb
  })

  return response.status(201).json(db.explanations.find((item) => item.id === explanation.id))
})

app.post('/api/explanations/generate', async (request, response) => {
  const { force = false, memeId, title } = request.body

  if (!memeId || !title) {
    return badRequest(response, 'memeId and title are required')
  }

  const currentDb = await readDb()
  const existingExplanation = currentDb.explanations.find((item) => item.memeId === memeId)

  if (existingExplanation && !force) {
    return response.json(existingExplanation)
  }

  try {
    const content = await generateExplanationText(title)
    const explanation = {
      content,
      id: existingExplanation?.id ?? createId('explanation'),
      memeId,
      updatedAt: new Date().toISOString(),
    }

    const db = await updateDb((nextDb) => {
      nextDb.explanations = [
        explanation,
        ...nextDb.explanations.filter((item) => item.memeId !== memeId),
      ]
      return nextDb
    })

    return response.status(201).json(db.explanations.find((item) => item.id === explanation.id))
  } catch (error) {
    console.error('Failed to generate explanation', error)
    return response.status(502).json({ message: getErrorMessage(error) })
  }
})

app.patch('/api/explanations/:id', async (request, response) => {
  const { id } = request.params
  const { content } = request.body

  if (!content) {
    return badRequest(response, 'content is required')
  }

  let updatedExplanation = null

  await updateDb((currentDb) => {
    currentDb.explanations = currentDb.explanations.map((item) => {
      if (item.id !== id) {
        return item
      }

      updatedExplanation = {
        ...item,
        content,
        updatedAt: new Date().toISOString(),
      }

      return updatedExplanation
    })

    return currentDb
  })

  if (!updatedExplanation) {
    return response.status(404).json({ message: 'Explanation not found' })
  }

  return response.json(updatedExplanation)
})

app.delete('/api/explanations/:id', async (request, response) => {
  const { id } = request.params

  await updateDb((currentDb) => {
    currentDb.explanations = currentDb.explanations.filter((item) => item.id !== id)
    return currentDb
  })

  response.status(204).send()
})

app.get('/api/notes', async (_request, response) => {
  const db = await readDb()
  response.json(db.notes)
})

app.post('/api/notes', async (request, response) => {
  const { content, memeId } = request.body

  if (!memeId || !content) {
    return badRequest(response, 'memeId and content are required')
  }

  const note = {
    id: createId('note'),
    memeId,
    content,
    updatedAt: new Date().toISOString(),
  }

  const db = await updateDb((currentDb) => {
    currentDb.notes = [note, ...currentDb.notes.filter((item) => item.memeId !== memeId)]
    return currentDb
  })

  return response.status(201).json(db.notes.find((item) => item.id === note.id))
})

app.patch('/api/notes/:id', async (request, response) => {
  const { id } = request.params
  const { content } = request.body

  if (!content) {
    return badRequest(response, 'content is required')
  }

  let updatedNote = null

  await updateDb((currentDb) => {
    currentDb.notes = currentDb.notes.map((item) => {
      if (item.id !== id) {
        return item
      }

      updatedNote = {
        ...item,
        content,
        updatedAt: new Date().toISOString(),
      }

      return updatedNote
    })

    return currentDb
  })

  if (!updatedNote) {
    return response.status(404).json({ message: 'Note not found' })
  }

  return response.json(updatedNote)
})

app.delete('/api/notes/:id', async (request, response) => {
  const { id } = request.params

  await updateDb((currentDb) => {
    currentDb.notes = currentDb.notes.filter((item) => item.id !== id)
    return currentDb
  })

  response.status(204).send()
})

app.get('/api/collections', async (_request, response) => {
  const db = await readDb()
  response.json(db.collections)
})

app.post('/api/collections', async (request, response) => {
  const { description = '', name } = request.body

  if (!name) {
    return badRequest(response, 'name is required')
  }

  const collection = {
    id: createId('collection'),
    name,
    description,
    memeIds: [],
    updatedAt: new Date().toISOString(),
  }

  const db = await updateDb((currentDb) => {
    currentDb.collections = [collection, ...currentDb.collections]
    return currentDb
  })

  return response.status(201).json(db.collections.find((item) => item.id === collection.id))
})

app.patch('/api/collections/:id/toggle-meme', async (request, response) => {
  const { id } = request.params
  const { memeId } = request.body

  if (!memeId) {
    return badRequest(response, 'memeId is required')
  }

  let updatedCollection = null

  await updateDb((currentDb) => {
    currentDb.collections = currentDb.collections.map((item) => {
      if (item.id !== id) {
        return item
      }

      const memeIds = item.memeIds.includes(memeId)
        ? item.memeIds.filter((currentId) => currentId !== memeId)
        : [...item.memeIds, memeId]

      updatedCollection = {
        ...item,
        memeIds,
        updatedAt: new Date().toISOString(),
      }

      return updatedCollection
    })

    return currentDb
  })

  if (!updatedCollection) {
    return response.status(404).json({ message: 'Collection not found' })
  }

  return response.json(updatedCollection)
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: 'Internal server error' })
})

ensureDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Meme Explainer backend is running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to initialize backend', error)
    process.exit(1)
  })
