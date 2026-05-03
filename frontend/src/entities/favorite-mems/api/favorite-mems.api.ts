import { makeRequest } from '@/shared/api/make-request'
import { ENDPOINTS } from '../config/favorite-mems.config'

export const favoriteApiService = {
  fetchFavorites(): Promise<string[]> {
    return makeRequest<string[]>({
      url: ENDPOINTS.FAVORITE_MEMS,
    })
  },

  addFavorite(memeId: string): Promise<string[]> {
    return makeRequest<string[]>({
      url: ENDPOINTS.FAVORITE_MEMS,
      method: 'POST',
      data: { memeId },
    })
  },

  removeFavorite(memeId: string): Promise<void> {
    return makeRequest<void>({
      url: `${ENDPOINTS.FAVORITE_MEMS}/${memeId}`,
      method: 'DELETE',
    })
  },
}
