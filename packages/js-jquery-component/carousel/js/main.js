require.config({
  baseUrl: 'js/module',
  paths: {
    carousel: 'carousel',
    jquery: '../lib/jquery'
  }
})

require(['carousel', 'jquery'], function(carousel, $) {
  carousel.Carousel.init($('.J-Poster'))
})
