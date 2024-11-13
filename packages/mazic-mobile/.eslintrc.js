module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages `react` related packages come first.
          ['^react', '^@?\\w'],
          ['^@mazic/shared(/.*|$)'],
          // Internal packages.
          ['^(@|components)(/.*|$)'],
          ['^(@|~)(/.*|$)'],
          ['^\\u0000'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ['^.+\\.?(css)$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'off',
    semi: 'off',
    curly: 'off',
    'react-native/no-inline-styles': 'off',
    'react/no-unstable-nested-components': 'off',
  },
}
