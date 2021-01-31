/**
 * 1.用户上滑页面 滑动条触底 开始加载下一页数据
 *  1.判断是否还有下一页数据
 *  2.如果没有下一页数据 弹出提示(wx-showToast)
 *    1.获取总页数 
 *      总页数 = Math.ceil(总条数 / 页容量)
 *      总页数 = Math.ceil(23 / 10) // 3
 *    2.获取到当前页码
 *    3.判断一下当前页码是否大于等于总页数
 *      如果是，则没有下一页数据
 *  3.如果还有下一页数据，则进行加载下一页数据
 *    1.当前页面++
 *    2.重新发送请求
 *    3.数据请求回来 要对data中的数组进行拼接而不是全部替换！[...a,...b]
 * 2.下拉刷新页面
 *  1.触发下拉刷新事件 需要在页面的json文件中开启'下拉菜单刷新'的配置项
 *  2.重置数据数组
 *  3.重置页码为1
 *  4.重新发送请求
 */
import {request} from "../../request/index.js"
// 在每一个需要使用async语法的页面js文件中，都引入（不能全局引入），只需要引入，不需要调用。
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    // 商品列表数据
    goodsList: []
  },

  // 接口需要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({url: "/goods/search", data: this.QueryParams});
    // 获取总条数
    const {total} = res
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // 赋值给商品列表
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    });
    // 关闭下拉菜单窗口
    wx.stopPullDownRefresh();
  },

  // 标题点击事件，从子组件中传递过来
  handleTabsItemChange(e) {
    // 1.获取被点击的标题的索引
    const {index} = e.detail;
    // 2.修改源数组
    const {tabs} = this.data;
    tabs.forEach((v,i) => {
      i===index?v.isActive=true:v.isActive=false
    });
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },
  // 页面上滑 滚动条触底事件
  onReachBottom() {
    // 1.判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '全部加载完毕',
      });
    }else {
      /**
       *还有下一页数据
          页码++
          重新发送请求
       */
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1;
    // 3.重新发送请求
    this.getGoodsList();
  }
})