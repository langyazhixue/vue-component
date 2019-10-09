define(['widget', 'jquery', 'jqueryUI'], function(widget, $, $UI) {
  function window() {
    this.cfg = {
      title: '系统消息',
      textAlertBtn: '确定',
      textConfirmBtn: '确定',
      textCancelBtn: '取消',
      textPromptBtn: '确定',
      content: '',
      handlerAlertBtn: null,
      handlerCloseBtn: null,
      handlerConfirmBtn: null,
      handlerCancelBtn: null,
      handlerPromptBtn: null,
      width: 500,
      heihgt: 300,
      hasCloseBtn: false,
      skinClassName: null,
      hasMask: true,
      isDraggable: true,
      dragHandler: null,
      isPromptInputPassword: false,
      defaultValuePromptInput: '',
      maxlengthPromptInput: 10,
      winType: 'alert' // 确定弹窗类型  alert或者confirm
    }
  }
  window.prototype = $.extend({}, new widget.Widget()) // 继承
  return { window: window }
})
