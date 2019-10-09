require.config({
  baseUrl: 'js/module',
  paths: {
    wind: 'window',
    jquery: '../lib/jquery',
    jqueryUI: '../lib/jquery-ui-1.9.2.custom',
    widget: 'widget'
  }
})

require(['wind', 'jquery'], function(wind, $) {
  $('#a').click(function() {
    var win = new wind.window()
    win.alert({
      title: '提示',
      content: '这是一个提示哦',
      hascloseBtn: true,
      width: 400,
      height: 200,
      y: 50,
      dragHandler: '.window_header',
      winType: 'alert',
      skinClassName: 'window_skin_a',
      handlerAlertBtn: function() {
        alert('this is alert window')
      }
    })
  })
  $('#b').click(function() {
    var win = new wind.window()
    win.confirm({
      title: '你确定要删除吗',
      content: '',
      hascloseBtn: false,
      width: 400,
      height: 200,
      y: 50,
      dragHandler: '.window_header',
      skinClassName: 'window_skin_a',
      handlerCanertBtn: function() {
        alert('cancel this window')
      },
      handlerConfirmBtn: function() {
        alert('confirm this window')
      },
      handlerCloseBtn: function() {
        alert('close this window')
      }
    })
  })

  $('#c').click(function() {
    var win = new wind.window()
    win.prompt({
      title: 'please enter  your name',
      content: '我们会为您保密信息的',
      hascloseBtn: false,
      width: 400,
      height: 200,
      y: 50,
      dragHandler: '.window_header',
      skinClassName: 'window_skin_a',
      defaultValuePromptInput: '张三',
      winType: 'prompt',
      handlerCanertBtn: function() {
        alert('cancel this window')
      },
      handlerPromptBtn: function(value) {
        alert('name' + value)
      }
    })
  })
  $('#d').click(function() {
    var win = new wind.window()
    win.common({
      content: '我们会为您保密信息的',
      width: 400,
      height: 200,
      y: 50,
      hasCloseBtn: true,
      skinClassName: 'window_skin_a'
    })
  })
})
