/**
 * 1.页面加载的时候
 *  从缓存中获取购物车数据（商品的checked=true），渲染到页面中
 * 2.微信支付
 *  1.哪些人 哪些账号 可以实现微信支付
 *    1.企业账号
 *    2.企业账号的小程序后台中必须给开发者加入白名单
 *      1.一个appid可以同时绑定多个开发者
 *      2.这些开发者就可以公用这个appid和它的开发权限
 * 3.支付按钮
 *  1.先判断缓存中有没有token
 *  2.没有则跳转到授权页面 进行获取token
 *  3.有token则进行支付
 *  4.创建订单 获取订单编号
 *  5.已经完成微信支付
 *    1.手动删除缓存中已经被选中的商品
 *    2.删除后的购物车数据填充回缓存中
 *    3.再跳转到订单页面
 */
import { showToast,Payment } from "../../utils/asyncWx.js"
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num
    })
    
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },
  // 点击支付
  async handleOrderPay() {
    try {
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    // 创建订单
    // const header = { Authorization: token }; // 请求头参数
    // 请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams = { order_price, consignee_addr, goods };
    // 发送请求，创建订单 获取订单编号
    const { order_number } = await request({ url: "/my/orders/create", method: "post", data: orderParams});
    // 发起预支付接口
    const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number }}); 
    // 发起微信支付
    await Payment(pay);
    // 查询后台订单
    await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number }}); 
    await showToast({ title: "支付成功" });
    // 手动删除缓存中已经支付的商品
    let newCart = wx.getStorageSync("cart");
    // 保留没有被选中的商品(checked  = false)
    newCart = newCart.filter(v => !v.checked);
    wx.setStorageSync("cart", newCart);
    // 支付成功后跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/order'
    });
   } catch (error) {
    await showToast({ title: "支付失败" });
    console.log(error);
   }
  }
})