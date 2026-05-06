import type { PropsWithChildren } from 'react'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { Provider } from 'react-redux'
import { store } from '@/app/store'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          borderRadius: 8,
          colorBgBase: '#f6f7fb',
          colorBorder: '#d9dee8',
          colorPrimary: '#1677ff',
          colorText: '#1f2937',
          colorTextSecondary: '#667085',
          fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
        },
      }}
    >
      <Provider store={store}>
        {children}
      </Provider>
    </ConfigProvider>
  )
}
