const config = {
  development: {
    apiUrl: 'http://localhost:3000'
  },
  production: {
    apiUrl: 'https://www.ilytat.com/'
  }
};

const environment = import.meta.env.MODE || 'development';

if (!config[environment]) {
  console.warn(`Unknown environment "${environment}", falling back to development`);
}

export default config[environment] || config.development;
