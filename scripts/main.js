;(function (window) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  const FRAME_RATE = 60
  const PARTICLE_NUM = 3000
  const RADIUS = Math.PI * 2
  const CANVASWIDTH = 700
  const CANVASHEIGHT = 150
  const CANVASID = 'canvas'
  const TimeLag = 2.5

  let texts = ['小 兔 子', '乖乖', '把门儿', '开开', 'lol',
              '我一直都很想说', 'I am lucky', 'to have met you', 'at the right time', 'and the right place',
              '和你在一起的日子', '让我忘记了', '孤独的滋味', '虽然你有时', '让我心累', '但是看着你笑', '我又不再疲惫',
              '我时时犯蠢', '惹你生气', '但你生气之后', '不离不弃', '疫情压迫', '让你着急', '有我陪着', '只想让你安心...',
              '5 2 0', '节日快乐宝贝儿！']

  let canvas,
    ctx,
    particles = [],
    quiver = true,
    text = texts[0],
    textIndex = 0,
    textSize = 70

  function draw () {
    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.textBaseline = 'middle'
    ctx.fontWeight = 'bold'
    ctx.font = textSize + 'px \'SimHei\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\''
    ctx.fillText(text, (CANVASWIDTH - ctx.measureText(text).width) * 0.5, CANVASHEIGHT * 0.5)

    let imgData = ctx.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)

    for (let i = 0, l = particles.length; i < l; i++) {
      let p = particles[i]
      p.inText = false
    }
    particleText(imgData)

    window.requestAnimationFrame(draw)
  }

  function particleText (imgData) {
    // 点坐标获取
    var pxls = []
    for (var w = CANVASWIDTH; w > 0; w -= 3) {
      for (var h = 0; h < CANVASHEIGHT; h += 3) {
        var index = (w + h * (CANVASWIDTH)) * 4
        if (imgData.data[index] > 1) {
          pxls.push([w, h])
        }
      }
    }

    var count = pxls.length
    var j = parseInt((particles.length - pxls.length) / 2, 10)
    j = j < 0 ? 0 : j

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
          X,
          Y

        if (quiver) {
          X = (pxls[i - 1][0]) - (p.px + Math.random() * 10)
          Y = (pxls[i - 1][1]) - (p.py + Math.random() * 10)
        } else {
          X = (pxls[i - 1][0]) - p.px
          Y = (pxls[i - 1][1]) - p.py
        }
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)
        p.x = p.px + C * T * p.delta
        p.y = p.py + S * T * p.delta
        p.px = p.x
        p.py = p.y
        p.inText = true
        p.fadeIn()
        p.draw(ctx)
      } catch (e) {}
    }
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i]
      if (!p.inText) {
        p.fadeOut()

        var X = p.mx - p.px
        var Y = p.my - p.py
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)

        p.x = p.px + C * T * p.delta / 2
        p.y = p.py + S * T * p.delta / 2
        p.px = p.x
        p.py = p.y

        p.draw(ctx)
      }
    }
  }

  function setDimensions () {
    canvas.width = CANVASWIDTH
    canvas.height = CANVASHEIGHT
    canvas.style.position = 'absolute'
    canvas.style.left = '0%'
    canvas.style.top = '0%'
    canvas.style.bottom = '0%'
    canvas.style.right = '0%'
    canvas.style.marginTop = window.innerHeight * .15 + 'px'
  }

  function event () {
    document.addEventListener('click', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      console.log(textIndex)
    }, false)

    document.addEventListener('touchstart', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      console.log(textIndex)
    }, false)
  }

  function textRun (textIndex) {
    setTimeout(function() {
      text = texts[textIndex]
      for (var i = 0; i < PARTICLE_NUM; i++) {
        particles[i] = new Particle(canvas)
      }
      draw()
    }, TimeLag * 1000 * textIndex)
  }

  function textRunAll() { 
    for (var i = 0; i < texts.length; i++) {
      textRun(i)
    }
  }

  function init () {
    canvas = document.getElementById(CANVASID)
    if (canvas === null || !canvas.getContext) {
      return
    }
    ctx = canvas.getContext('2d')
    setDimensions()
    textRunAll()
  }

  class Particle {
    constructor (canvas) {
      let spread = canvas.height
      let size = Math.random() * 1.2
      // 速度
      this.delta = 0.06
      // 现在的位置
      this.x = 0
      this.y = 0
      // 上次的位置
      this.px = Math.random() * canvas.width
      this.py = (canvas.height * 0.5) + ((Math.random() - 0.5) * spread)
      // 记录点最初的位置
      this.mx = this.px
      this.my = this.py
      // 点的大小
      this.size = size
      // this.origSize = size
      // 是否用来显示字
      this.inText = false
      // 透明度相关
      this.opacity = 0
      this.fadeInRate = 0.01
      this.fadeOutRate = 0.03
      this.opacityTresh = 0.98
      this.fadingOut = true
      this.fadingIn = true
    }
    fadeIn () {
      this.fadingIn = this.opacity > this.opacityTresh ? false : true
      if (this.fadingIn) {
        this.opacity += this.fadeInRate
      }else {
        this.opacity = 1
      }
    }
    fadeOut () {
      this.fadingOut = this.opacity < 0 ? false : true
      if (this.fadingOut) {
        this.opacity -= this.fadeOutRate
        if (this.opacity < 0) {
          this.opacity = 0
        }
      }else {
        this.opacity = 0
      }
    }
    draw (ctx) {
      ctx.fillStyle = 'rgba(226,225,142, ' + this.opacity + ')'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true)
      ctx.closePath()
      ctx.fill()
    }
  }
  
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(!isChrome){
      $('#iframeAudio').remove()
  }

  init()
})(window)
