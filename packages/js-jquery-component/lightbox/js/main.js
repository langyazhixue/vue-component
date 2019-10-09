require.config({
  baseUrl: 'js/module',
  paths: {
    widget: 'widget',
    lightbox: 'lightbox',
    jquery: '../lib/jquery'
  }
})

require(['lightbox', 'jquery'], function(lightbox, $) {
  var lightbox = new lightbox.LightBox()
  lightbox.popupLightBox({
    speed: 'fast',
    maxWidth: 1200,
    maxHeight: 800,
    maskOpacity: 0.4
  })
})
