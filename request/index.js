// 封装promise，用于简化异步请求
// 同时发送异步请求代码的次数
let ajaxTimes = 0;
export const request = (params) => {
  // 判断url中是否带有'/my/'，请求的是私有的路径 带上header -> token
  let header = { ...params.header }; // 避免覆盖传递过来的header
  if(params.url.includes("/my/")) {
    // 拼接header 带上token
    header["Authorization"] = wx.getStorageSync("token");
  }
  // 每发送一次请求，次数加1
  ajaxTimes++;
  // 发送请求时显示加载中效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success:(result) => {
        resolve(result.data.message);
      },
      fail:(error) => {
        reject(error);
      },
      complete:() => {
        // 发送请求每完成1次，将发送请求的次数减1
        ajaxTimes--;
        // 发送请求全部完成，则关闭'加载中'的效果
        if(ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    })
  })
}