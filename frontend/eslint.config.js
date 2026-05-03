import antfu from '@antfu/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default antfu(
  {
    ignores: ['.pnpm-store'],
    isInEditor: true,

    formatters: {
      html: true,
      css: true,
      markdown: true,
    },

    stylistic: {
      indent: 2,
      semi: false,
      quotes: 'single',
    },

    markdown: true,

    javascript: {
      overrides: {
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: false,
            vars: 'all',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },

    typescript: {
      // Если захочешь жесткий type-aware lint:
      // tsconfigPath: 'tsconfig.json',
      overrides: {
        'ts/no-non-null-assertion': 'error',
        // 'ts/explicit-function-return-type': 'error',
      },
    },
  },

  // React
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // react
      ...reactPlugin.configs.recommended.rules,

      // react-hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // Для React 17+ / new JSX transform
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Полезные практические правила
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-pascal-case': [
        'error',
        {
          allowAllCaps: false,
          ignore: ['apexchart'],
        },
      ],
      'react/jsx-max-props-per-line': [
        'error',
        {
          maximum: {
            single: 1,
            multi: 1,
          },
        },
      ],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: false,
          shorthandFirst: false,
          shorthandLast: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: false,
        },
      ],
      'react/jsx-one-expression-per-line': [
        'error',
        {
          allow: 'none',
        },
      ],
      'react/no-array-index-key': 'warn',
      'react/prop-types': 'off', // если проект на TS
    },
  },

  eslintConfigPrettier,
  {
    rules: {
      'format/prettier': 'off',
    },
  },
)
