import pluginNext from '@next/eslint-plugin-next'

export default [
  {
    ignores: ['.next/**'],
  },
  {
    plugins: { '@next/next': pluginNext },
    rules: {
      ...pluginNext.configs.recommended.rules,
      '@next/next/no-img-element': 'off',
    },
  },
]
