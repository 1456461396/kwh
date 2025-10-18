// eslint.config.js
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ElMessageBox: 'readonly',
        ElMessage: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          printWidth: 80,
          trailingComma: 'none',
          endOfLine: 'auto',
        },
      ],
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'],
        },
      ],
      'vue/no-setup-props-destructure': 'off',
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  //  Vue 插件配置
  ...pluginVue.configs['flat/essential'].map((config) => {
    const newConfig = { ...config }
    if ('globals' in newConfig) delete newConfig.globals
    return newConfig
  }),

  //  JS 推荐配置
  js.configs.recommended,

  //  忽略 dist、coverage
  {
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  //  prettier 禁止格式化冲突
  skipFormatting,
])
