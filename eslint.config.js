import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from './prettier.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends([
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ]),
  {
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      prettier: prettierPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImports,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'], // ✅ qo‘shish foydali
      },
    },
    rules: {
      'prettier/prettier': ['error', prettierConfig],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-wrap-multilines': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      '@typescript-eslint/no-explicit-any': 'warn',

      'import/newline-after-import': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/entities',
              from: ['./src/features', './src/widgets', './src/app'],
              message: '❌ entities ichiga yuqoridan import qilish taqiqlangan',
            },
            {
              target: './src/features',
              from: ['./src/widgets', './src/app'],
              message: '❌ features faqat pastki qatlamlardan import qilishi mumkin',
            },
            {
              target: './src/widgets',
              from: ['./src/app'],
              message: '❌ widgets ichiga app’dan import qilish mumkin emas',
            },
          ],
        },
      ],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'unused-imports/no-unused-imports': 'error',

      'newline-before-return': 'error',
    },
  },
]
