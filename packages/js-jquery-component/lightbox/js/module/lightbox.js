define(['jquery', 'widget'], function($, widget) {
  function LightBox() {
    this.settings = {
      speed: 'fast',
      maxWidth: 1200,
      maxHeight: 800,
      maskOpacity: 0.4
    }
  }
  LightBox.prototype = $.extend({}, new widget.Widget())
  return { LightBox: LightBox }
})
