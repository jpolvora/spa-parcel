module.exports = {
  plugins: {
    'posthtml-head-elements': {
      headElements: {
        meta: [
          {
            name: 'API_URL',
            content: process.env.API_URL
          },
          {
            name: 'env',
            content: process.env.NODE_ENV
          }
        ]
      }
    }
  }
}
