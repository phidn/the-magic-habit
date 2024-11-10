module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {'@': './src'},
      },
    ],
    'react-native-reanimated/plugin',
    'module:react-native-dotenv',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
}
