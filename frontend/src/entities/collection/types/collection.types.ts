export interface CollectionItem {
  id: string
  name: string
  description: string
  memeIds: string[]
  updatedAt: string
}

export interface CreateCollectionRequest {
  description: string
  name: string
}

export interface ToggleCollectionMemeRequest {
  collectionId: string
  memeId: string
}
