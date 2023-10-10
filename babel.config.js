module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:react-native-dotenv'],
    plugins: ['react-native-reanimated/plugin', '@babel/plugin-transform-private-methods', '@babel/plugin-transform-class-properties', '@babel/plugin-transform-private-property-in-object'],
  };
};
