const tsconfig = require('./tsconfig.json');
let rawAlias   = tsconfig.compilerOptions.paths;
let alias      = {};

for (let x in rawAlias) {
    alias[x.replace('/*', '')] = rawAlias[x].map(
        p => p.replace('/*', ''));
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:react-native-dotenv'],
    plugins: ['react-native-reanimated/plugin', 
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
