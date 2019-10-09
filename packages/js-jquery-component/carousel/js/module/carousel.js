define(['jquery'], function($) {
  var Carousel = function(poster) {
    // 保存单个旋转木马对象
    var self = this
    this.poster = poster
    this.posterItemMain = poster.find('ul.poster-list')
    this.posterItem = poster.find('ul.poster-list>li.poster-item')

    //  如果是偶数帧的话，把第一帧复制到最后一帧（非完美解决方案）
    if (this.posterItem.size() % 2 == 0) {
      this.posterItemMain.append(this.posterItem.eq(0).clone())
      this.posterItem = this.posterItemMain.children()
    }

    this.nextBtn = poster.find('.poster-next-btn')
    this.prevBtn = poster.find('.poster-prev-btn')

    this.posterFirstItem = this.posterItem.first() // 第一帧
    this.posterLastItem = this.posterItem.last() // 最后一帧

    // 保存Item 有多少个
    this.posterItmes = this.posterItem.length

    // 保存每一帧比上一帧在多出来多少

    this.setting = {
      width: 1000, // 幻灯片的宽度
      height: 270, // 幻灯片的高度
      posterWidth: 640, // 幻灯片第一帧的宽度
      posterHeight: 270, // 幻灯片第一帧的高度
      scale: 0.9,
      speed: 500,
      autoPlay: false,
      delay: 5000,
      opacity: 0.8,
      verticalAlign: 'middle'
    }
    // 保证动画完成再进行下一个动画
    this.rotateFlag = true
    // 获取参数
    var setting = this.getSetting()
    $.extend(this.setting, setting || {})

    if (this.setting.width <= this.setting.posterWidth) {
      this.setting.width = this.setting.posterWidth
    } else if (this.setting.height <= this.setting.posterHeight) {
      this.setting.height = this.setting.posterHeight
    }

    this.setSettingValue()
    this.setPosterPosition()

    this.nextBtn.click(function() {
      if (self.rotateFlag == true) {
        self.rotateFlag = false
        self.carouselRotate('left')
      }
    })
    this.prevBtn.click(function() {
      if (self.rotateFlag == true) {
        self.rotateFlag = false
        self.carouselRotate('right')
      }
    })

    // 是否开启自动播放
    if (this.setting.autoPlay == true) {
      console.log(true)
      this.autoPlay()
      this.poster.hover(
        function() {
          window.clearInterval(self.timer)
        },
        function() {
          self.autoPlay()
        }
      )
    }
  }

  Carousel.prototype = {
    // 设置剩余帧的位置关系
    setPosterPosition: function() {
      var self = this
      var sliceItems = this.posterItem.slice(1) // 踢掉了第一帧
      var sliceSize = sliceItems.length
      var sliceRight = sliceItems.slice(0, sliceSize / 2) // 截取y右边的剩余帧

      var level = Math.floor(this.posterItmes / 2) // 层级关系
      var rw = this.setting.posterWidth
      var rh = this.setting.posterHeight

      // 间隙
      var gap = (this.setting.width - this.setting.posterWidth) / 2 / level
      // 比例关系
      var firstGap = (self.setting.width - self.setting.posterWidth) / 2
      var fixOffsetLeft = firstGap + rw

      var scale = this.setting.scale

      sliceRight.each(function(z, v) {
        level--
        rw = rw * scale
        rh = rh * scale
        var j = z
        $(this).css({
          zIndex: level,
          width: rw,
          height: rh,
          left: fixOffsetLeft + (z + 1) * gap - rw,
          top: self.setVerticalValue(rh),
          opacity: 1 / ++j
        })
      })

      var sliceLeft = sliceItems.slice(sliceSize / 2) // 截取左边的剩余帧
      var lw = sliceRight.last().width()
      var lh = sliceRight.last().height()
      var oloop = Math.floor(this.posterItmes / 2)
      //  设置左边的位置关系
      sliceLeft.each(function(i, v) {
        $(this).css({
          zIndex: i,
          width: lw,
          height: lh,
          left: i * gap,
          top: self.setVerticalValue(lh), // 单独封装出一个函数来  return
          opacity: 1 / oloop
        })
        lw = lw / scale
        lh = lh / scale
        oloop--
      })
    },
    // 设置垂直top值
    setVerticalValue: function(h) {
      var verticalAlign = this.setting.verticalAlign.toLowerCase() // 对齐参数
      var topValue
      switch (verticalAlign) {
        case 'top':
          topValue = 0
          break
        case 'middle':
          topValue = (this.setting.posterHeight - h) / 2
          break
        case 'bottom':
          topValue = this.setting.posterHeight - h
          break
        default:
          topValue = (this.setting.posterHeight - h) / 2
          break
      }
      return topValue
    },
    // 设置基本参数值去配置基本高度、宽度
    setSettingValue: function() {
      var self = this
      this.poster.css({
        width: this.setting.width,
        heihgt: this.setting.height
      })
      this.posterItemMain.css({
        width: this.setting.width,
        heihgt: this.setting.height
      })
      // 设置按钮的宽度
      var w = (this.setting.width - this.setting.posterWidth) / 2
      this.nextBtn.css({
        width: w,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItmes / 2) // Math.ceil 向上取整
      })
      this.prevBtn.css({
        width: w,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItmes / 2) // Math.ceil  向上取整
      })

      this.posterFirstItem.css({
        width: this.setting.posterWidth,
        height: this.setting.posterHeight,
        left: w,
        zIndex: Math.floor(this.posterItmes / 2)
      })

      this.more = (this.setting.width - this.setting.posterWidth) / Math.floor(this.posterItmes)
    },
    getSetting: function() {
      // 判断有没有setting
      var setting = this.poster.attr('data-setting')
      if (setting && setting != null) {
        return JSON.parse(setting)
      } else return {}
    },
    // 执行旋转函数  // 坐旋转  用上一帧的值替换现在的值 因为是一个轮回
    carouselRotate: function(direction) {
      var self = this
      var zIndexAttr = []
      if (direction === 'left') {
        zIndexAttr.length = 0
        self.posterItem.each(function(i, v) {
          _self_ = $(this)
          var prev = _self_.prev().get(0) ? _self_.prev() : self.posterLastItem
          var width = prev.width()
          var heihgt = prev.height()
          var zIndex = prev.css('zIndex')
          var opacity = prev.css('opacity')
          var left = prev.css('left')
          var top = prev.css('top')

          zIndexAttr.push(zIndex)

          _self_.animate(
            {
              width: width,
              height: heihgt,
              left: left,
              top: top,
              opacity: opacity
            },
            self.setting.speed,
            function() {
              self.rotateFlag = true
            }
          ) // 每个animate 动画是同时进行的吧
          //					_self_.css({"zIndex":zIndex}).animate({  //非动画函数要先于动画函数执行
          //						width:width,
          //						height:heihgt,
          //						left:left,
          //						top:top,
          //						opacity:opacity
          //					},self.setting.speed)
        })
        self.posterItem.each(function(i, v) {
          $(this).css('zIndex', zIndexAttr[i])
        })
      } else if (direction === 'right') {
        var self = this
        zIndexAttr.length = 0
        self.posterItem.each(function(i, v) {
          _self_ = $(this)
          // console.log(_self_.prev().get(0));
          var next = _self_.next().get(0) ? _self_.next() : self.posterFirstItem
          var width = next.width()
          var heihgt = next.height()
          var zIndex = next.css('zIndex')
          var opacity = next.css('opacity')
          var left = next.css('left')
          var top = next.css('top')

          zIndexAttr.push(zIndex)
          _self_.animate(
            {
              width: width,
              height: heihgt,
              left: left,
              top: top,
              opacity: opacity
            },
            self.setting.speed,
            function() {
              self.rotateFlag = true
            }
          )
        })
        self.posterItem.each(function(i, v) {
          $(this).css('zIndex', zIndexAttr[i])
        })
      }
    },
    autoPlay: function() {
      var self = this
      self.timer = window.setInterval(function() {
        self.nextBtn.click()
        //				if(self.rotateFlag==true){
        //					self.rotateFlag=false;
        //					self.carouselRotate('left');
        //				}
      }, self.setting.delay)
    }
  }

  // 静态方法
  Carousel.init = function(posters) {
    var _this_ = this // this 指的是Carousel
    // console.log(this.name1);
    posters.each(function(i, elem) {
      new _this_($(this))
    })
  }

  return { Carousel: Carousel }
})
