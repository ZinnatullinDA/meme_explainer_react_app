import type { PropsWithChildren } from 'react'
import { ConfigProvider, theme } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { ThemeModeProvider, useThemeMode } from '@/shared/lib/theme-mode'

function AntThemeProvider({ children }: PropsWithChildren) {
  const { mode } = useThemeMode()
  const isDark = mode === 'dark'

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorBgBase: isDark ? '#111827' : '#f3efe5',
          colorBorder: isDark ? '#374151' : '#d9dee8',
          colorPrimary: '#1677ff',
          colorText: isDark ? '#f9fafb' : '#1f2937',
          colorTextSecondary: isDark ? '#a7b0c0' : '#667085',
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

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeModeProvider>
      <AntThemeProvider>
        {children}
      </AntThemeProvider>
    </ThemeModeProvider>
  )
}
