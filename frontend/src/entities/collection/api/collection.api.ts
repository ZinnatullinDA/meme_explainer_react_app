import type { CollectionItem, CreateCollectionRequest, ToggleCollectionMemeRequest } from '../types/collection.types'
import { makeRequest } from '@/shared/api/make-request'
import { ENDPOINTS } from '../config/collection.config'

export const collectionApiService = {
  fetchCollections(): Promise<CollectionItem[]> {
    return makeRequest<CollectionItem[]>({
      url: ENDPOINTS.COLLECTION,
      method: 'GET',
    })
  },

  createCollection(payload: CreateCollectionRequest): Promise<CollectionItem> {
    return makeRequest<CollectionItem>({
      url: ENDPOINTS.COLLECTION,
      method: 'POST',
      data: payload,
    })
  },

  toggleCollectionMeme(payload: ToggleCollectionMemeRequest): Promise<CollectionItem> {
    return makeRequest<CollectionItem>({
      url: `${ENDPOINTS.COLLECTION}/${payload.collectionId}/toggle-meme`,
      method: 'PATCH',
      data: { memeId: payload.memeId },
    })
  },
}
