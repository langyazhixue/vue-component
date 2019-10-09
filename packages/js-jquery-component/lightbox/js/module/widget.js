define(['jquery'], function($) {
  var Widget = function() {
    var self = this
  }

  Widget.prototype = {
    render: function() {
      this.initRender()
    },
    initRender: function() {
      this.popupMask = $(
        '<div id="G-lightbox-mask" style="opacity:' + this.settings.maskOpacity + '">'
      )
      this.popupWin = $('<div id="G-lightbox-pupup">')
      this.bodyNode = $('body')

      // 初始化弹窗
      this.renderDOM()

      this.picViewArea = this.popupWin.find('div.lightbox-pic-view') // 获取图片预览区域

      this.popupPic = this.popupWin.find('img.lightbox-image') // 图片

      this.picCaptionArea = this.popupWin.find('div.lightbox-pic-caption') // 描述和  索引

      this.prevBtn = this.popupWin.find('span.lightbox-prev-btn') //  向上切换的按钮

      this.nextBtn = this.popupWin.find('span.lightbox-next-btn') // 向下切换的按钮

      this.captionText = this.popupWin.find('p.lightbox-pic-desc') // 描述

      this.currentIndex = this.popupWin.find('span.lightbox-of-index') // 当前图片的索引

      this.closeBtn = this.popupWin.find('span.lightbox-close-btn') // 关闭按钮
    },
    bindUI: function() {
      var self = this // 准备事件委托，获取数据
      this.groupName = null
      this.groupData = [] // 放置同一组数据
      this.flag = true // 判断动画是否完成  限制多点，然后打乱this.index
      $('body').delegate('.js-lightbox,*[data-role="lightBox"]', 'click', function(e) {
        // 事件委托
        e.stopPropagation() // 阻止事件冒泡
        // self.popupMask.show();
        // self.popupWin.show();
        var currentGroupName = $(this).attr('data-group')
        if (currentGroupName != self.groupName) {
          self.groupName = currentGroupName
          // 根据当前组名，获取同一组数据
          self.getGroup()
        }
        self.initPopup($(this)) // 传递参数  当前点击的对象;
      })

      // 点击X 关闭弹窗
      this.closeBtn.click(function() {
        self.winClose()
      })
      // 点击遮罩层关闭弹窗
      this.popupMask.click(function() {
        self.winClose()
      })

      this.nextBtn
        .hover(
          function(e) {
            // hover事件
            e.stopPropagation()
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
              $(this).addClass('lightbox-next-btn-show')
            }
          },
          function(e) {
            e.stopPropagation()
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
              $(this).removeClass('lightbox-next-btn-show')
            }
          }
        )
        .click(function(e) {
          if (!$(this).hasClass('disabled') && self.groupData.length > 1 && self.flag == true) {
            self.flad = false
            e.stopPropagation()
            self.goto('next')
          }
        })

      this.prevBtn
        .hover(
          function(e) {
            e.stopPropagation()
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
              $(this).addClass('lightbox-prev-btn-show')
            }
          },
          function(e) {
            e.stopPropagation()
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
              $(this).removeClass('lightbox-prev-btn-show')
            }
          }
        )
        .click(function(e) {
          if (!$(this).hasClass('disabled') && self.groupData.length > 1 && self.flag == true) {
            e.stopPropagation()
            self.goto('prev')
          }
        })

      // 绑定窗口调整事件
      var timer = null
      this.clear = false // 确保弹出来之后  动画完成了，窗口调整才能调解弹出窗口
      $(window)
        .resize(function() {
          if (self.clear == true) {
            window.clearTimeout(timer) // 500毫秒后去执行这个  如果500毫秒后还一直在resize窗口这个函数，就执行清空timer
            timer = window.setTimeout(function() {
              console.log(self.groupData)
              if (self.groupData.length != 0) {
                self.popupPic.css({ width: 'auto', height: 'auto' })
                var src = self.groupData[self.index - 1].src
                self.loadPicSize(src)
              }
            }, 500)
            console.log(timer)
          }
        })
        .keyup(function(e) {
          e.stopPropagation()
          if (e.keyCode == 37 || e.keyCode == 38) {
            console.log(e)
            if (
              !self.prevBtn.hasClass('disabled') &&
              self.groupData.length > 1 &&
              self.flag == true
            ) {
              e.stopPropagation()
              self.goto('prev')
            }
          }
        })
        .keydown(function(e) {
          e.stopPropagation()
          if (e.keyCode == 39 || e.keyCode == 40) {
            if (
              !self.nextBtn.hasClass('disabled') &&
              self.groupData.length > 1 &&
              self.flag == true
            ) {
              self.flad = false
              e.stopPropagation()
              self.goto('next')
            }
          }
        })
    },
    getGroup: function() {
      var self = this
      // 根据当前组别名称，获取页面中所有相同组别的对象
      var grouplist = this.bodyNode.find('*[data-group="' + this.groupName + '"]')
      // 情况数组数据
      self.groupData.length = 0 // 每次清除 groupData
      grouplist.each(function(i, v) {
        self.groupData.push({
          src: $(this).attr('data-source'),
          id: $(this).attr('data-id'),
          caption: $(this).attr('data-caption')
        })
      })
    },
    renderDOM: function() {
      var strDOM =
        '<div class="lightbox-pic-view">' +
        '<span class="lightbox-btn lightbox-prev-btn "></span>' +
        '<img  class="lightbox-image"  alt="" />' +
        '<span class="lightbox-btn lightbox-next-btn "></span>' +
        '</div>' +
        '<div class="lightbox-pic-caption">' +
        '<div class="lightbox-pic-caption-area">' +
        '<p class="lightbox-pic-desc "></p>' +
        '<span class="lightbox-of-index "></span>' +
        '</div>' +
        '<span  class="lightbox-close-btn"></span>' +
        '</div>'
      // 插入到this.popupWin
      this.popupWin.append(strDOM)
      // 把遮罩层和弹窗插入到this.bodyNode
      this.bodyNode.append(this.popupMask).append(this.popupWin)
    },
    preLoadImg: function(sourceSrc, callback) {
      var img = new Image()
      if (window.ActiveXObject) {
        // 处理在IE情况下的问题
        img.onreadystatechange = function() {
          if (this.readyState == 'complete') {
            callback()
          }
        }
      } else {
        img.onload = function() {
          // 图片也有onload 事件
          callback()
        }
      }
      img.src = sourceSrc
    },
    loadPicSize: function(sourceSrc) {
      var self = this
      // 图片预加载方法
      this.preLoadImg(sourceSrc, function() {
        self.popupPic.attr('src', sourceSrc)
        var picWidth = self.popupPic.width()
        var picHeight = self.popupPic.height()
        self.changePic(picWidth, picHeight) // 根据图片尺寸调整弹出框的大小
      })
    },
    // 要计算比例，让图片始终保存在窗口之内
    changePic: function(width, height) {
      // 根据图片尺寸调整弹出框的大小
      var self = this
      var winWidth = Math.min($(window).width(), self.settings.maxWidth)
      var winHeight = Math.min($(window).height(), self.settings.maxHeight)
      // 判断窗口的宽高比  和图片的宽高比  图片按比例重新调整尺寸
      var scale = Math.min(winWidth / (width + 10), winHeight / (height + 10), 1)
      var width = scale * width
      var height = scale * height

      this.popupWin.animate(
        {
          width: width,
          height: height,
          'margin-left': -width / 2,
          top: ($(window).height() - height) / 2
        },
        self.settings.speed
      )
      this.picViewArea.animate(
        {
          width: width - 10,
          height: height - 10
        },
        self.settings.speed,
        function() {
          self.popupPic
            .css({
              width: width - 10,
              height: height - 10
            })
            .fadeIn(function() {
              self.flag = true
              self.clear = true
            })
          self.picCaptionArea.fadeIn()
        }
      )

      // 设置描述文字和当前索引
      self.captionText.html(self.groupData[self.index - 1].caption)
      self.currentIndex.html('当前图片位置：' + self.index + '/' + this.groupData.length)
    },
    getIndexOf: function(currentId) {
      var index = 0
      $.each(this.groupData, function(i, v) {
        index++
        if (v.id == currentId) {
          return false // each 没有break and continue
        }
      })
      return index
    },
    showMarskAndPopup: function(sourceSrc, currentId) {
      var self = this
      this.popupPic.hide() //   图片区域隐藏
      this.picCaptionArea.hide() // 描述和索引区域隐藏

      var winWidth = Math.min($(window).width(), self.settings.maxWidth)
      var winHeight = Math.min($(window).height(), self.settings.maxHeight)
      this.popupWin.css({
        width: (winWidth + 10) / 2,
        height: (winHeight + 10) / 2,
        'margin-left': -(winWidth + 10) / 4,
        top: -(winHeight + 10) / 2
      })
      this.picViewArea.css({
        width: winWidth / 2,
        height: winHeight / 2,
        'min-height': winHeight / 2
      })

      this.popupMask.fadeIn() // 遮罩层淡淡出来
      this.popupWin.show().animate({ top: (winHeight + 10) / 4 }, self.settings.speed, function() {
        self.loadPicSize(sourceSrc)
      })

      // 获取索引
      this.index = this.getIndexOf(currentId) // 每个功能写一个小函数
      var groupDataLength = this.groupData.length

      //  判断切换按钮
      this.showPrevAndNext()
    },
    initPopup: function(currentObj) {
      var self = this
      sourceSrc = currentObj.attr('data-source')
      currentId = currentObj.attr('data-id')
      this.showMarskAndPopup(sourceSrc, currentId)
    },
    // 上下切换图片预处理
    gotoPreRender: function() {
      this.popupPic.hide() //   在上下按钮切换的时候  图片区域隐藏
      this.picCaptionArea.hide()
      this.popupPic.css({ width: 'auto', height: 'auto' })
      $('.lightbox-prev-btn-show').removeClass('lightbox-prev-btn-show')
      $('.lightbox-next-btn-show').removeClass('lightbox-next-btn-show')
    },
    showPrevAndNext: function() {
      var groupDataLength = this.groupData.length
      if (groupDataLength > 1) {
        if (this.index === 1) {
          this.prevBtn.addClass('disabled') // 在添加一个class 来控制上下切换按钮
          this.nextBtn.removeClass('disabled')
        } else if (this.index === groupDataLength) {
          this.prevBtn.removeClass('disabled')
          this.nextBtn.addClass('disabled')
        } else {
          this.prevBtn.removeClass('disabled')
          this.nextBtn.removeClass('disabled')
        }
      }
    },
    goto: function(direction) {
      this.gotoPreRender()
      if (direction === 'next') {
        this.index++
        if (this.index == this.groupData.length) {
          this.nextBtn.addClass('disabled').removeClass('lightbox-next-btn-show')
        } else if (this.index != 0) {
          this.nextBtn.removeClass('disabled')
        }
        src = this.groupData[this.index - 1].src
        this.loadPicSize(src)
        this.showPrevAndNext()
      } else if (direction === 'prev') {
        this.index--
        if (this.index <= 1) {
          this.prevBtn.addClass('disabled').removeClass('lightbox-prev-btn-show')
        }
        src = this.groupData[this.index - 1].src
        this.loadPicSize(src)
        this.showPrevAndNext()
      }
    },
    winClose: function() {
      var self = this
      self.popupPic.css({ width: 'auto', height: 'auto' }) // 保证每一次点击load图片的尺寸是新的
      self.popupWin.fadeOut()
      self.popupMask.fadeOut()
      self.clear = false
    },
    // 最后需要用到的函数
    popupLightBox: function(settings) {
      $.extend(this.settings, settings || {})
      this.render()
      this.bindUI()
    }
  }
  return { Widget: Widget }
})
