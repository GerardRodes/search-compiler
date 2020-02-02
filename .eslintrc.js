module.exports = {
  extends: "standard-with-typescript",
  parserOptions: {
    project: "./tsconfig.eslint.json"
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off'
  }
}