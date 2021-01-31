/**
 * 1.页面被打开的时候 onShow
 *  1.onShow不同于onLoad，无法在形参上接收options参数
 *  2.获取url上的参数type
 *  3.根据type去发送请求获取订单数据
 *  4.渲染页面
 * 2.点击不同的标题 重新发送请求来获取和渲染页面
 */
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部订单",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      }
    ],
    orders: []
  },
  onShow() {
    const token = wx.getStorageSync("token");
    // 如果token不存在，则必须先获取
    // if(!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/auth'
    //   });
    //   return;
    // }
    // 获取当前小程序的页面栈--内存数组 长度最大为10个页面
    let pages =  getCurrentPages();
    // 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 获取url上的type参数
    const { type } = currentPage.options;
    this.changeTitle(type-1); //type为1时index为0
    this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: {type} });
    this.setData({
      // {...v}：将v展开；{...v,a}：在v中添加属性a
      orders: res.orders.map(v => ({...v,create_time_cn:(new Date(v.create_time * 1000).toLocaleString())}))
    })
  },
  // 根据标题索引来激活选中标题按钮
  changeTitle(index) {
    let { tabs } = this.data;
    tabs.forEach((v,i) => {
      i === index ? v.isActive=true : v.isActive=false
    })
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitle(index);
    // 重新发送请求
    this.getOrders(index+1); //index为0时type为1
  }
})