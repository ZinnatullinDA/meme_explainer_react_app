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
          colorBgBase: isDark ? '#111827' : '#f7f8fb',
          colorBgContainer: isDark ? '#1f2937' : '#ffffff',
          colorBgElevated: isDark ? '#1f2937' : '#ffffff',
          colorBorder: isDark ? '#374151' : '#cfd6e4',
          colorBorderSecondary: isDark ? '#2f3b4e' : '#dfe4ee',
          colorPrimary: '#1677ff',
          colorText: isDark ? '#f9fafb' : '#172033',
          colorTextDescription: isDark ? '#a7b0c0' : '#58657a',
          colorTextPlaceholder: isDark ? '#7c8798' : '#8a94a6',
          colorTextSecondary: isDark ? '#a7b0c0' : '#4b5870',
          fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
        },
        components: {
          Button: {
            defaultBg: isDark ? '#1f2937' : '#ffffff',
            defaultBorderColor: isDark ? '#374151' : '#d7deea',
            defaultColor: isDark ? '#f9fafb' : '#172033',
            textTextColor: isDark ? '#f9fafb' : '#172033',
          },
          Card: {
            colorBgContainer: isDark ? '#1f2937' : '#ffffff',
            colorBorderSecondary: isDark ? '#374151' : '#dfe4ee',
          },
          Input: {
            colorBgContainer: isDark ? '#111827' : '#ffffff',
            colorBorder: isDark ? '#374151' : '#d3dbea',
            hoverBorderColor: '#1677ff',
          },
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
