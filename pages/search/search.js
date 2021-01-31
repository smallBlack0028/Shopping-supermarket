/**
 * 1.输入框绑定 值改变事件 input事件
 *  1.获取到输入框的值
 *  2.合法性判断
 *  3.检验通过 把输入框的值发送到后台
 *  4.将数据渲染到页面中
 * 2.防抖技术--防止发送多个请求，采用定时器
 *   1.防抖 一般在输入框中 防止重复输入 重复发送请求
 *   2.拓展知识：节流 一般是在页面下拉和上拉
 *   3.定义一个全局的定时器id
 */
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goods: [],
    timeId: -1,
    isFocus: false,
    inputVal: ""
  },
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail;
    // 检验合法性
    if(!value.trim()) {
      this.setData({
        isFocus: false,
        goods: []
      })
      // 值不合法
      return;
    }
    this.setData({
      isFocus: true
    })
    /**
     * 首先清除定时器
     * 比如在搜索you时：当输入y时会创建一个定时器，1s之后会发送请求（如果之后不再输入ou）
     *                  当输入o时会将y这个定时器删除，创建o这个定时器，1s之后会发送请求（如果之后不再输入u）
     *                  当输入u时会将o这个定时器删除，创建u这个定时器，并发送请求
     */                 
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      // 发送请求获取数据
      this.searchGood(value);
    }, 1000)
  },
  async searchGood(query) {
    const goods = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      goods
    })
  },
  // 点击取消按钮
  handleCancel() {
    this.setData({
      goods: [],
      isFocus: fals,
      inputVal: ""
    })
  }
})