import type {
  CreateExplanationRequest,
  ExplanationItem,
  GenerateExplanationRequest,
  UpdateExplanationRequest,
} from '../types/explanation.types'
import { makeRequest } from '@/shared/api/make-request'
import { ENDPOINTS } from '../config/explanation.config'

export const explanationApiService = {
  fetchExplanations(): Promise<ExplanationItem[]> {
    return makeRequest<ExplanationItem[]>({
      url: ENDPOINTS.EXPLANATION,
      method: 'GET',
    })
  },

  createExplanation(payload: CreateExplanationRequest): Promise<ExplanationItem> {
    return makeRequest<ExplanationItem>({
      url: ENDPOINTS.EXPLANATION,
      method: 'POST',
      data: payload,
    })
  },

  generateExplanation(payload: GenerateExplanationRequest): Promise<ExplanationItem> {
    return makeRequest<ExplanationItem>({
      url: `${ENDPOINTS.EXPLANATION}/generate`,
      method: 'POST',
      data: payload,
    })
  },

  updateExplanation(payload: UpdateExplanationRequest): Promise<ExplanationItem> {
    return makeRequest<ExplanationItem>({
      url: `${ENDPOINTS.EXPLANATION}/${payload.id}`,
      method: 'PATCH',
      data: payload,
    })
  },

  deleteExplanation(id: string): Promise<string> {
    return makeRequest<string>({
      url: `${ENDPOINTS.EXPLANATION}/${id}`,
      method: 'DELETE',
    })
  },
}
