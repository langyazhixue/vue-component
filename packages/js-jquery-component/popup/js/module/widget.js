define(['jquery', 'jqueryUI'], function() {
  function Widget() {
    this.boundingBox = null // 属性，最外层容器
  }
  Widget.prototype = {
    on: function(type, handler) {
      if (this.handlers[type] == undefined) {
        this.handlers[type] = []
      }
      this.handlers[type].push(handler)
      return this
    },
    fire: function(type, data) {
      if (this.handlers[type] instanceof Array) {
        // instanceof   运算符
        var handlers = this.handlers[type]
        for (i = 0; i < handlers.length; i++) {
          handlers[i](data)
        }
      }
      return this
    },
    // 方法  渲染组件
    render: function(container) {
      this.handlers = {}
      this.renderUI()
      this.bindUI()
      this.syncUI()
      $(container || document.body).appendTo(this.boungdingBox)
    },
    destory: function() {
      // 接口：销毁前处理的函数
      this.destructor() // 方法：销毁组件
      this.boundingBox.off() // off() 方法通常用于移除通过 on() 方法添加的事件处理程序。
      this.boundingBox.remove() // 销毁元素   所有东西都销毁掉。
    },
    // 接口，添加Dom节点
    renderUI: function() {
      // 生成弹窗
      var footerContent = ''
      console.log(this.cfg.winType)
      switch (this.cfg.winType) {
        case 'alert':
          footerContent =
            '<input type="button"  class="window_alertBtn" value="' + this.cfg.textAlertBtn + '">'
          break
        case 'confirm':
          footerContent =
            '<input type="button"  class="window_confirmBtn" value="' +
            this.cfg.textConfirmBtn +
            '">' +
            '<input type="button"  class="window_canceltBtn" value="' +
            this.cfg.textCancelBtn +
            '">'
          break
        case 'prompt':
          footerContent =
            '<input type="button"  class="window_promptBtn"  value="' +
            this.cfg.textPromptBtn +
            '">' +
            '<input type="button"  class="window_canceltBtn" value="' +
            this.cfg.textCancelBtn +
            '">'
          this.cfg.content +=
            '<p class="window_promptInputWrapper">' +
            '<input type="' +
            (this.cfg.isPromptInputPassword ? 'password' : 'text') +
            '" value="' +
            this.cfg.defaultValuePromptInput +
            '"  maxlength="' +
            this.cfg.maxlengthPromptInput +
            '"  class="window_pormptInput"/>' +
            '</p>'
          break
        default:
          footerContent =
            '<input type="button"  class="window_alertBtn" value="' + this.cfg.textAlertBtn + '">'
      }

      this.boundingBox = $(
        '<div class="window_boundingBox"><div class="window_body">' +
          this.cfg.content +
          '</div></div>'
      )

      if (this.cfg.winType != 'common') {
        this.boundingBox.prepend('<div class="window_header">' + this.cfg.title + '</div>')
        this.boundingBox.append('<div class="window_foot">' + footerContent + '</div>')
      }

      this._promptInput = this.boundingBox.find('.window_pormptInput')
      // 判断有没有模态框
      if (this.cfg.hasMask == true) {
        this._mask = $('<div class="window_mask"></div>')
        this._mask.appendTo('body')
      }
      // 判断有没有关闭按钮
      if (this.cfg.hasCloseBtn) {
        this.boundingBox.append('<span class="window_closeBtn">X</span>')
      }
      this.boundingBox.appendTo('body')
    },
    // 添加监听事件
    bindUI: function() {
      var that = this
      if (this.cfg.handlerCloseBtn) {
        that.on('close', this.cfg.handlerCloseBtn)
      }
      if (this.cfg.handlerAlertBtn) {
        that.on('alert', this.cfg.handlerAlertBtn)
      }
      if (this.cfg.handlerConfirmBtn) {
        that.on('confirm', this.cfg.handlerConfirmBtn)
      }
      if (this.cfg.handlerCancelBtn) {
        that.on('cancel', this.cfg.handlerCancelBtn)
      }
      if (this.cfg.handlerPromptBtn) {
        that.on('prompt', this.cfg.handlerPromptBtn)
      }
      this.boundingBox
        .delegate('.window_alertBtn', 'click', function() {
          that.fire('alert')
          that.destory()
        })
        .delegate('.window_closeBtn', 'click', function() {
          that.fire('close')
          that.destory()
        })
        .delegate('.window_confirmBtn', 'click', function() {
          that.fire('confirm')
          that.destory()
        })
        .delegate('.window_canceltBtn', 'click', function() {
          that.fire('cancel')
          that.destory()
        })
        .delegate('.window_promptBtn', 'click', function() {
          that.fire('prompt', that._promptInput.val())
          that.destory()
        })
    },
    // 接口，初始化组件属性 (跟css有关)
    syncUI: function() {
      // 样式
      var width = window.innerWidth
      this.boundingBox.css({
        width: this.cfg.width + 'px',
        height: this.cfg.height + 'px',
        left: (this.cfg.x || (window.innerWidth - this.cfg.width) / 2) + 'px',
        top: (this.cfg.y || (window.innerHeight - this.cfg.height) / 2) + 'px'
      })
      // 皮肤
      if (this.cfg.skinClassName) {
        this.boundingBox.addClass(this.cfg.skinClassName)
      }
      if (this.cfg.isDraggable) {
        if (this.cfg.dragHandler) {
          // console.log(this.cfg.dragHandler);
          this.boundingBox.draggable({ handle: this.cfg.dragHandler })
        } else {
          this.boundingBox.draggable()
        }
      }
    },
    // 接口，销毁前的处理函数
    destructor: function() {
      this._mask && this._mask.remove()
    },
    // 窗口函数
    alert: function(cfg) {
      $.extend(this.cfg, cfg)
      this.render()
      return this
    },
    prompt: function(cfg) {
      $.extend(this.cfg, cfg, { winType: 'prompt' })
      this.render()
      this._promptInput.focus()
      return this
    },
    confirm: function(cfg) {
      $.extend(this.cfg, cfg, { winType: 'confirm' })
      this.render()
      return this
    },
    common: function(cfg) {
      $.extend(this.cfg, cfg, { winType: 'common' })
      this.render()
      return this
    }
  }
  return {
    Widget: Widget
  }
})
