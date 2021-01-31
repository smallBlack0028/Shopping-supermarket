/**
 * 1.点击轮播图，放大预览
 *  1.给轮播图绑定点击事件
 *  2.调用小程序的api previewImage
 * 2.点击 加入购物车
 *  1.先绑定点击事件
 *  2.获取缓存中的购物车数据 数组格式
 *  3.先判断 当前商品是否已经存在购物车中 
 *    1.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充回缓存中
 *    2.不存在 直接给购物车数组添加一个新元素 新元素带上购买数量属性（num） 重新把购物车数组填充回缓存中
 *  4.弹出提示
 * 3.商品收藏
 *  1.页面onShow的时候，加载缓存中的商品收藏的数据
 *  2.判断当前商品是不是被收藏
 *    1.是  改变收藏的图标
 *    2.不是
 *  3.点击商品收藏按钮
 *    1.判断该商品是否已经存在于缓存数组中
 *    2.已经存在 把该商品删除
 *    3.不存在 把商品添加到收藏数组中 存入到缓存中
 * 
 */
import {request} from "../../request/index.js"
// 在每一个需要使用async语法的页面js文件中，都引入（不能全局引入），只需要引入，不需要调用。
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    isCollect: false
  },
  // 商品对象
  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPages = pages[pages.length - 1];
    let options = currentPages.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },
  async getGoodsDetail(goods_id) {
    const goodsDetail = await request({ url: "/goods/detail", data: {goods_id}});
    this.goodsInfo = goodsDetail;
    // 获取缓存中的商品数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.goodsInfo.goods_id);
    this.setData({
      goodsDetail: {
        goods_name: goodsDetail.goods_name,
        goods_price: goodsDetail.goods_price,
        pics: goodsDetail.pics,
        // iphone部分手机不识别webp图片格式
        // 前端临时修改 确保后台存在webp和jpg格式图片 .webp => .jpg
        goods_introduce: goodsDetail.goods_introduce.replace(/\.webp/g,'.jpg'),
      },
      isCollect
    })
  },
  // 预览图片
  handlePreviewImage(e) {
    // 获取到当前图片的url
    const current = e.currentTarget.dataset.url;
    // 获取到所有图片的url
    const urls = this.goodsInfo.pics.map(v =>v.pics_mid)
    wx.previewImage({
      current,
      urls
    });
  },
  // 点击加入购物车
  handleCartAdd() {
    // 1.获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id === this.goodsInfo.goods_id);
    if(index === -1) {
      // 3.不存在，则将商品添加到购物车数组中，且数量为1
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo);
    }else {
      // 4.已经存在购物车数据，执行num++
      cart[index].num++;
    }
    // 5.将购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    })
  },
  // 点击商品收藏按钮
  handleCollect() {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
    // 当index !== -1表示已经收藏过
    if(index !== -1) {
      // 能找到 已经收藏过 在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
    }else {
      // 没有收藏过
      collect.push(this.goodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 将数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 修改data的属性 isCollect
    this.setData({
      isCollect
    })
  }

})