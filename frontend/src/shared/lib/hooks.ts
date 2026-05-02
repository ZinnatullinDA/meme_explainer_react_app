import type { AppDispatch, RootState } from '@/app/store'
import { useDispatch, useSelector } from 'react-redux'

export function useAppDispatch() {
  return useDispatch<AppDispatch>()
}

export function useAppSelector<TSelected>(selector: (state: RootState) => TSelected) {
  return useSelector(selector)
}
