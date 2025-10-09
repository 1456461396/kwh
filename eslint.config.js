import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import prettierPlugin from 'eslint-plugin-prettier'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    // 声明使用的插件
    plugins: {
      prettier: prettierPlugin // 注册prettier插件
    }
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,

  // 添加自定义规则配置
  {
    rules: {
      // prettier专注于代码的美观度 (格式化工具)
      // 前置：
      // 1. 禁用格式化插件 prettier, format on save 关闭
      // 2. 安装Eslint插件, 并配置保存时自动修复
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // 单引号
          semi: false, // 无分号
          printWidth: 80, // 每行宽度至多80字符
          trailingComma: 'none', // 对象|数组最后一个元素  不加 逗号
          endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
        }
      ],
      // ESLint关注于规范, 如果不符合规范，报错
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
        }
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验 (props解构丢失响应式)
      // 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
      'no-undef': 'error'
    }
  }
])
