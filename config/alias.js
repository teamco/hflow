const { NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';

const alias = {
  worker: '/public/worker',
  assets: '/public/assets',
  components: '/src/components/',
  layouts: '/src/layouts/',
  locales: '/src/locales/',
  models: '/src/models/',
  pages: '/src/pages/',
  theme: '/src/theme/',
  services: '/src/services/',
  utils: '/src/utils/'
};

if (isDevelopment) {
  console.log('\n\n==== ALIAS =====\n');
  console.log(alias);
  console.log('\n==== /ALIAS =====\n\n');
}

module.exports = { alias };
