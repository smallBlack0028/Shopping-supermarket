import {request} from "../../request/index.js"
// 在每一个需要使用async语法的页面js文件中，都引入（不能全局引入），只需要引入，不需要调用。
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightGoodsList: [],
    // 左侧菜单激活索引值
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 用于接收后台返回的数据
  cates: [],

  onLoad: function(options) {
    /**
     * 1.先判断一下本地存储有没有旧数据
     *    {time:Date.now(),data:[...]}
     * 2.没有旧的数据，直接发送请求
     * 3.有旧的数据，同时旧的数据没有过期，直接使用旧的数据即可
     */

    // 1.获取本地存储中的数据
    const cates = wx.getStorageSync("cates");
    // 2.判断本地存储中是否有数据
    if(!cates) {
      // 不存在，则发送请求获取数据
      this.getCates();
    }else {
      // 存在，判断本地存储中的数据有没有过期
      // 定义过期时间为10s
      // 过期，则发送请求
      if(Date.now() - cates.time > 1000*10) {
        this.getCates();
      }else {
        // 没有过期，则使用本地存储中的数据
        this.cates = cates.data;
        const leftMenuList = this.cates.map(v => v.cat_name);
        const rightGoodsList = this.cates[0].children;
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({url: '/categories'})
    // .then(result => {
    //   this.cates = result.data.message;

    //   // 将接口中的数据存储到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(), data:this.cates});

    //   // 使用map函数构造左侧菜单数据
    //   const leftMenuList = this.cates.map(v => v.cat_name);
    //   // 构造右侧商品（大家电的）数据
    //   const rightGoodsList = this.cates[0].children;
    //   // 给左侧菜单和右侧商品赋值
    //   this.setData({
    //     leftMenuList,
    //     rightGoodsList
    //   })
    // })

    // 使用es7的async和await来发送请求
    const res = await request({url: "/categories"});
    this.cates = res;
    // 将接口中的数据存储到本地存储中
    wx.setStorageSync("cates", {time:Date.now(), data:this.cates});

    // 使用map函数构造左侧菜单数据
    const leftMenuList = this.cates.map(v => v.cat_name);
    // 构造右侧商品（大家电的）数据
    const rightGoodsList = this.cates[0].children;
    // 给左侧菜单和右侧商品赋值
    this.setData({
      leftMenuList,
      rightGoodsList
    })
  },
  // 左侧菜单的点击事件
  /**
   * 1.获取被点击的标题身上的索引
   * 2.给data中的currentIndex赋值
   * 3.根据不同的索引来渲染右侧商品内容
   */
  handleLeftMenu(e) {
    const {index} = e.currentTarget.dataset;
    // 改变右侧商品索引
    const rightGoodsList = this.cates[index].children;
    this.setData({
      // 给左侧菜单索引赋值
      currentIndex: index,
      // 同时给右侧商品索引赋值
      rightGoodsList,
      // 重新设置，右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
  }
});
  