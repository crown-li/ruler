let app = getApp();
const ctx = wx.createCanvasContext('canvas');




Page({

  data: {
    canvasHeight: 50,
    currentVal: 0,
    ratio: 10,
  },

  onLoad: function (options) {
    let _this = this;
    _this.getSystemInfo();

    _this.drawRuler();

  },

  //获取系统信息
  getSystemInfo: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let screenWidth = res.windowWidth;
        let screenHeight = res.windowHeight;
        let pixelRatio = res.pixelRatio;
        _this.setData({
          screenWidth,
          screenHeight,
          pixelRatio
        })
      }
    })
  },

  drawRuler: function (currentVal) {
    let _this = this;

    let pixelRatio = this.data.pixelRatio
    let canvasHeight = this.data.canvasHeight;//canvas高度
    let ratio = this.data.ratio;//偏移量
    let ruleOrigin = 0 //rule起点
    let color = '0,0,0';
    let opacityRange = [
      { range: 0, color: 'rgba(' + color + ',0)' },
      { range: 0.4, color: 'rgba(' + color + ',1)' },
      { range: 0.6, color: 'rgba(' + color + ',1)' },
      { range: 1, color: 'rgba(' + color + ',0)' },
    ]

    let minScale = 10;//最小刻度高度
    let maxScale = 20;//最大刻度高度
    let centerHei = 50;

    let FontSize = 12;//刻度字体大小

    let canvasWidth = _this.data.screenWidth;
    _this.setData({
      canvasWidth
    })

    //createLinearGradient,createCircularGradient
    const grd = ctx.createLinearGradient(ruleOrigin, canvasHeight, canvasWidth, canvasHeight);
    grd.addColorStop(opacityRange[0].range, opacityRange[0].color);
    grd.addColorStop(opacityRange[1].range, opacityRange[1].color);
    grd.addColorStop(opacityRange[2].range, opacityRange[2].color);
    grd.addColorStop(opacityRange[3].range, opacityRange[3].color);
    ctx.setStrokeStyle(grd)

    currentVal = currentVal ? currentVal : 0;

    let centerPoint = Math.ceil(canvasWidth / 2 + pixelRatio);//中心点
    let preScale = Math.ceil(centerPoint / ratio);//中心点左边平均刻度份数
    let maxVal = Math.ceil(currentVal - centerPoint) + canvasWidth //最大刻度
    let minVal = Math.ceil(currentVal - preScale);//最小刻度


    ctx.setLineWidth(1)


    //尺
    ctx.beginPath();
    ctx.moveTo(ruleOrigin, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.stroke();
    ctx.closePath();

    //中间线
    ctx.beginPath();
    ctx.moveTo(centerPoint, canvasHeight);
    ctx.lineTo(centerPoint, canvasHeight - centerHei);
    ctx.stroke();
    ctx.closePath();

    //刻度值
    ctx.beginPath();
    ctx.setFontSize(FontSize);
    ctx.setTextAlign('center')
    let n = 0;
    let drawX = '';
    console.log('minVal', minVal)
    for (let i = minVal; i <= maxVal; i++) {
      drawX = n * ratio + ruleOrigin
      i % ratio == 0 ? ctx.fillText(i > 0 ? i : '', i >= 0 ? drawX : '', canvasHeight - maxScale - 5) : '';
      ctx.moveTo(i > 0 ? drawX : '', canvasHeight);
      ctx.lineTo(i > 0 ? drawX : '', i % ratio == 0 ? canvasHeight - maxScale : canvasHeight - minScale);
      n++
    }
    ctx.stroke();
    ctx.closePath();

    ctx.draw();

  },

  _pageX: 0,
  start: function (e) {
    this._pageX = e.touches[0].x;
  },

  _pageCount: 0,
  move: function (e) {
    let min = e.touches[0].x - this._pageX
    let currentVal = Math.ceil(this.data.currentVal + min)

    if (currentVal > 0) {
      return
    }

    let scale = -Math.ceil(currentVal / 100);

    this.setData({
      currentVal,
      scale
    })

    this.drawRuler(scale)
  }


});