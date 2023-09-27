export default function (api) {
  api.cache(true);

  const presets = [
    [ '@babel/preset-env', { 'useBuiltIns': 'entry', 'corejs': '3.32.1' } ],
    [ '@babel/preset-react', { 'runtime': 'automatic' } ],
    '@babel/preset-typescript'
  ];
  const plugins = [];

  if (process.env['NODE_ENV'] === 'production') {
    // plugins.push(...);
  }

  return {
    presets,
    plugins
  };
}