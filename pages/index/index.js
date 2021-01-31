// 导入封装好的promise
import { request } from "../../request/index.js"
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 分类导航数组
    cateList: [],
    // 楼层数组
    floorList: []
  },
  // 页面开始加载时，就会触发
  onLoad: function (options) {
    // 发送get请求，获取轮播图数据（没有使用promise简化）
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   // 请求成功时调用
    //   success: (result) => {
    //     // 将请求到的数据添加到swiperList
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   },
    // });
    // 调用
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  getSwiperList() {
    // 使用promise来简化异步请求
    request({ url: '/home/swiperdata' })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  getCateList() {
    // 使用promise来简化异步请求
    request({url: '/home/catitems'})
    .then(result => {
      this.setData({
        cateList: result
      })
    })
  },
  getFloorList() {
    // 使用promise来简化异步请求
    request({url: '/home/floordata'})
    .then(result => {
      this.setData({
        floorList: result
      })
    })
  }
});
