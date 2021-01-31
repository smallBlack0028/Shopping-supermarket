/**
 * 1.获取用户的收货地址
 *  1.绑定点击事件
 *  2.调用小程序内置api 获取用户的收货地址 wx.chooseAddress
 *  3.获取用户对小程序所授予获取地址的权限状态（wx.getSetting）scope
 *    1.用户点击获取收货地址的提示框 【确定】 authSetting scope.address
 *      scope值为true 直接调用获取收货地址
 *    2.用户从未调用收货地址的api
 *      scope为undefined 直接调用获取收货地址
 *    3.用户点击获取收货地址提示框 【取消】
 *      scope值为false
 *      1.诱导用户打开授权设置页面（wx.openSetting）当用户重新给与获取地址权限的时候
 *      2.获取收货地址
 *    4.将获取到的收货地址存入到本地存储中
 * 2.页面加载完毕
 *  1.获取本地存储中的数据
 *  2.把数据设置给data中的一个变量
 * 3.onShow
 *  1.回到商品详情页面 第一次添加商品时 手动添加属性
 *    1.num=1；
 *    2.checked=true
 *  2.获取缓存中的购物车的数组
 *  3.将购物车数据填充到data中
 * 4.全选的实现 数据的展示
 *  1.onShow 获取缓存中的购物车数组
 *  2.根据购物车中的商品数据 所有商品被选中 checked=true 全选则被选中
 * 5.总价格和总数量
 *  1.商品被选中后，进行计算
 *  2.获取购物车数组
 *  3.遍历购物车数组
 *  4.判断商品是否被选中
 *  5.总价格 += 商品单价*商品数量
 *  6.总数量 += 商品数量
 * 6.商品的选中
 *  1.绑定change事件
 *  2.获取到被修改的商品对象
 *  3.商品对象的选中状态 取反
 *  4.重新填充到data中和缓存中
 *  5.重新计算全选。总价格、总数量
 * 7.全选和反选
 *  1.全选复选框绑定事件change
 *  2.获取data中的全选变量 allChecked
 *  3.取反 allChecked = ！allChecked
 *  4.遍历购物车数组 让里面商品选中状态跟随allChecked的改变而改变
 *  5.将购物车数组和allChecked重新设置回data 把购物车重新设置回缓存中
 * 8.商品数量编辑
 *  1."+""-"按钮绑定同一个点击事件 区分的关键 自定义属性
 *    1."+" => "+1"
 *    2."-" => "-1"
 *  2.传递被点击的商品id => goods_id
 *  3.获取data中的购物车数组 来获取需要被修改的商品对象
 *  4.直接修改商品对象的数量 num
 *      当购物车数量=1 且用户点击"-"
 *      弹窗提示(showModal) 询问用户是否要删除  
 *      1.确定 => 直接执行删除
 *      2.取消 => 什么都不做
 *  5.把cart数组 重新设置回缓存中和data中
 * 9.点击结算
 *  1.判断有没有收货地址
 *  2.判断用户有没有选购商品
 *  3.跳转到支付页面
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },
  // 点击收货地址
  async handleChooseAddress() {
    try {
      // 获取权限状态
      const result = await getSetting();
      // 通过[]来拿到authSetting下面的scope.address，不能直接进行authSetting.scope.address
      const scopeAddress = result.authSetting["scope.address"];
      // 判断权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 调用获取收货地址的api
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.index;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 计算总价格、总数量以及全选
  setCart(cart) {
    /**
     * 计算全选
     * every方法：遍历数组，会接收一个回调函数，那么每一个回调函数都返回true，则every方法返回值为true
     * 只要有一个回调函数返回了false，那么不再循环执行，直接返回false
     * 空数组调用every，返回值也为true
     */
    // 如果cart长度不为0，则调用cart.every，否则直接返回false
    // const allChecked = cart.length?cart.every(v=>v.checked):false;
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length !== 0 ? allChecked : false;
    
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  },
  // 商品全选功能
  handleItemAllChecked() {
    // 获取data中的数据
    let { cart, allChecked } = this.data;
    // 修改值（取反）
    allChecked = !allChecked
    // 遍历cart数组，修改商品的选中状态
    cart.forEach(v => {
      v.checked=allChecked
    })
    // 将修改后的值，填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 修改数量
    if(cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if(res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart)
      }
    }else {
      cart[index].num += operation;
      // 设置回缓存中和data中
      this.setCart(cart);
    }
  },
  async handlePay() {
    // 判断收货地址
    const { address, totalNum } = this.data
    if(!address.userName) {
      await showToast({title: "您还没有选择收货地址"});
      return;
    }
    // 判断用户有没有选购商品
    if(totalNum === 0) {
      await showToast({title: "您还没有选购商品"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  }
})