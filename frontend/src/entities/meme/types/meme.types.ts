export interface Meme {
  id: string
  title: string
  url: string
  width?: number
  height?: number
  source: string
  explanationSeed: string
}

export interface ImgflipMemeDto {
  height: number
  id: string
  name: string
  url: string
  width: number
}

export interface MemeApiDto {
  author: string
  postLink: string
  subreddit: string
  title: string
  url: string
}

export interface ImgflipResponse {
  data: {
    memes: ImgflipMemeDto[]
  }
  success: boolean
}

export interface MemeApiListResponse {
  count: number
  memes: MemeApiDto[]
}
