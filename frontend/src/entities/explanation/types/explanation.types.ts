export interface ExplanationItem {
  id: string
  memeId: string
  content: string
  updatedAt: string
}

export interface CreateExplanationRequest {
  content: string
  memeId: string
}

export interface GenerateExplanationRequest {
  force?: boolean
  memeId: string
  title: string
}

export interface UpdateExplanationRequest {
  content: string
  id: string
}
