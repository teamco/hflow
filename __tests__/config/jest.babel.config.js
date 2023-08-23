module.exports = {
  presets: [
    ['@babel/preset-typescript'],
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { targets: { node: 'current' } }] // add this
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-private-methods',
    ['@babel/plugin-transform-runtime', { regenerator: true }]
  ]
};
