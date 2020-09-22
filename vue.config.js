module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'router': '@/router',
        'plugins': '@plugins'
      }
    }
  }
}