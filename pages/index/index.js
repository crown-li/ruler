let app = getApp();
const ctx = wx.createCanvasContext('canvas');
Page({

  data: {
    canvasHeight: 152,
    currentVal: 30,//当前值
    minCurrentVal:30,//最小值
    maxCurrentVal:120,//最大值
    ratio: 10
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
        let canvasWidth = res.windowWidth;
        let screenHeight = res.windowHeight;
        let pixelRatio = res.pixelRatio;
        _this.setData({
          canvasWidth,
          screenHeight,
          pixelRatio
        })
      }
    })
  },

  drawRuler: function () {
    let _this = this;

    let pixelRatio = this.data.pixelRatio
    let canvasHeight = this.data.canvasHeight - 59;//canvas高度
    let ratio = this.data.ratio;//偏移量
    let ruleOrigin = 0 //rule起点
    let color = '177,177,177';//渐变颜色
    let opacityRange = [
      { range: 0, color: 'rgba(' + color + ',0)' },
      { range: 0.4, color: 'rgba(' + color + ',1)' },
      { range: 0.6, color: 'rgba(' + color + ',1)' },
      { range: 1, color: 'rgba(' + color + ',0)' },
    ]

    let canvasWidth = _this.data.canvasWidth;

    const grd = ctx.createLinearGradient(ruleOrigin, canvasHeight, canvasWidth, canvasHeight);
    grd.addColorStop(opacityRange[0].range, opacityRange[0].color);
    grd.addColorStop(opacityRange[1].range, opacityRange[1].color);
    grd.addColorStop(opacityRange[2].range, opacityRange[2].color);
    grd.addColorStop(opacityRange[3].range, opacityRange[3].color);
    ctx.setStrokeStyle(grd)

    let currentVal = _this.data.currentVal * 10;

    //误差修正
    if (2 < pixelRatio < 3) {
      pixelRatio = 4
    } 

    let centerPoint = Math.ceil(canvasWidth / 2 + pixelRatio);//中心点
    let preScale = Math.ceil(centerPoint / ratio);//中心点左边平均刻度份数
    let maxVal = Math.ceil(currentVal - centerPoint) + canvasWidth //最大刻度
    let minVal = Math.ceil(currentVal - preScale);//最小刻度

    ctx.setLineWidth(1)
    ctx.setTextAlign('center')

    //中间线
    ctx.beginPath();
    ctx.setFontSize(36)
    ctx.setFillStyle('#50D0C6')
    let metrics = ctx.measureText(this.data.currentVal);
    ctx.fillText(this.data.currentVal, centerPoint, 30);
    ctx.setFontSize(14)
    ctx.fillText('kg', centerPoint + 15 + metrics.width / 2, 30);
    ctx.setStrokeStyle('#FC6496')
    ctx.moveTo(centerPoint, 59);
    ctx.lineTo(centerPoint, 152);
    ctx.stroke();
    ctx.closePath();

    //刻度值
    ctx.beginPath();
    ctx.setFontSize(12);
    ctx.setStrokeStyle(grd)
    ctx.setFillStyle('rgb(177,177,177)')
    let n = 0;
    let drawX = '';
    for (let i = minVal; i <= maxVal; i++) {
      drawX = n.toFixed(1) * ratio + ruleOrigin
      if (i % ratio == 0) {
        ctx.fillText(i > 30 ? i / ratio : '', i >= 30 ? drawX : '', 80)
        ctx.moveTo(i > 30 ? drawX : '', 86);
        ctx.lineTo(i > 30 ? drawX : '', 132);
      } else {
        if (i % 2 == 0) {
          ctx.moveTo(i > 30 ? drawX : '', 97);
          ctx.lineTo(i > 30 ? drawX : '', 122);
        }
      }
      n++
    }
    ctx.stroke();
    ctx.closePath();

    ctx.draw();

    },

    touchStart: 0,
      start: function (e) {
        this.touchStart = e.touches[0].x;
        this.data.touchEnd = this.data.currentVal;//记录鼠标按下时当前的值
      },

    move: function (e) {
      let min = e.touches[0].x - this.touchStart
      let currentVal = (Number(this.data.touchEnd * 10) + Number(-min)).toFixed(1);

      let minCurrentVal = this.data.minCurrentVal * 10;
      let maxCurrentVal = this.data.maxCurrentVal * 10;

      if (currentVal < minCurrentVal) {
        currentVal = minCurrentVal
      }
      if (currentVal > maxCurrentVal) {
        currentVal = maxCurrentVal
      }

      currentVal = (currentVal / 10).toFixed(1);
      this.setData({
        currentVal
      })
      this.drawRuler()
    },

});
