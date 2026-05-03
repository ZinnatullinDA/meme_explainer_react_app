import type { ImgflipMemeDto, Meme, MemeApiDto } from '../types/meme.types'

export function mapImgflipMeme(meme: ImgflipMemeDto): Meme {
  return {
    id: meme.id,
    title: meme.name,
    url: meme.url,
    width: meme.width,
    height: meme.height,
    source: 'imgflip',
    explanationSeed: `Мем "${meme.name}" обычно используется как шаблон, чтобы показать узнаваемую социальную ситуацию или реакцию.`,
  }
}

export function mapMemeApiMeme(meme: MemeApiDto): Meme {
  return {
    id: meme.postLink,
    title: meme.title,
    url: meme.url,
    source: `r/${meme.subreddit}`,
    explanationSeed: `Этот мем пришёл из сообщества r/${meme.subreddit} и обычно завязан на локальный интернет-контекст или свежую шутку.`,
  }
}
