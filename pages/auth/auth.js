import { login } from "../../utils/asyncWx.js"
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  async handleGetUserInfo() {
    try {
      //   const { encryptedData, iv, rawData, signature } = e.detail;
      // // 获取小程序登陆成功后的code
      // const { code } = await login();
      // const loginParams = { encryptedData, iv, rawData, signature, code }
      // // 发送请求 获取用户的token
      // const { token } = await request({url: "/users/wxlogin", data: loginParams, method: "post"});
      // 将token存入缓存中 同时跳转到上一个页面
      wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      wx.navigateBack({
        // delta为几，表示跳转到上几个页面
        delta: 1
      });
    } catch(error) {
      console.log(error);
    }
  } 
})