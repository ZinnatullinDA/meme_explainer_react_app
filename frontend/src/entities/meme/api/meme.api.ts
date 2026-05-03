import type { ImgflipResponse, Meme, MemeApiDto, MemeApiListResponse } from '../types/meme.types'
import type { ExplanationItem } from '@/entities/explanation/types/explanation.types'
import { makeRequest } from '@/shared/api/make-request'
import { ENDPOINTS } from '../config/meme.config'
import { mapImgflipMeme, mapMemeApiMeme } from '../lib/map-meme'

export const memeApiService = {
  async fetchMemes(): Promise<Meme[]> {
    const response = await makeRequest<ImgflipResponse>({ url: ENDPOINTS.IMGFLIP })

    if (!response.success) {
      throw new Error('Imgflip returned unsuccessful response')
    }

    let slangMemes: Meme[] = []

    try {
      slangMemes = await memeApiService.fetchSlangMemes()
    } catch {
      slangMemes = []
    }

    return [...slangMemes, ...response.data.memes.map(mapImgflipMeme)]
  },

  async fetchRandomMemes(): Promise<Meme[]> {
    const response = await makeRequest<MemeApiDto>({ url: ENDPOINTS.RANDOM })
    return [mapMemeApiMeme(response)]
  },

  async fetchMemesBySubreddit(subreddit?: string): Promise<Meme[]> {
    const response = await makeRequest<MemeApiListResponse>({
      url: ENDPOINTS.SUBREDDIT(subreddit),
    })
    return response.memes.map(mapMemeApiMeme)
  },

  fetchSlangMemes(): Promise<Meme[]> {
    return makeRequest<Meme[]>({
      url: ENDPOINTS.SLANG_MEMES,
      method: 'GET',
    })
  },

  generateSlangMeme(payload: { term: string }): Promise<{ explanation: ExplanationItem; meme: Meme }> {
    return makeRequest<{ explanation: ExplanationItem; meme: Meme }>({
      url: ENDPOINTS.SLANG_EXPLAIN,
      method: 'POST',
      data: payload,
      timeout: 30000,
    })
  },
}
