// const fs = require('fs');

// const defaultConfig = JSON.parse(fs.readFileSync('./public/config/data.json', 'utf8'));
// const NODE_ENV = defaultConfig['NODE_ENV'];

// const apiServer = defaultConfig['API_SERVER'];

// if (NODE_ENV === 'development') {
//   console.log('\nUI SERVER:          ', apiServer);
// }

export const proxy = {
  // '/path': {
  //   'target': apiServer,
  //   'changeOrigin': true,
  //   'secure': false,
  //   onProxyRes(proxyRes, req, res) {
  //     // console.log(uisServer, proxyRes, req, res);
  //   }
  // }
};
