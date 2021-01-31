/**
 * 1.点击“+”触发tap点击事件
 *  1.调用小程序内置的选择图片的api
 *  2.获取到图片的路径（数组类型） 存入到data的数组中
 *  3.页面根据图片数组进行循环显示 自定义事件
 * 2.点击自定义图片组件
 *  1.获取被点击的元素的索引
 *  2.获取data中的图片数组
 *  3.根据索引 删除数组中对应的元素
 *  4.把数组重新设置回data中
 * 3.点击“提交”
 *  1.获取文本域的内容
 *    1.data中定义变量 表示输入框的内容
 *    2.文本域绑定输入事件 事件触发的时候 把输入框的值存入到变量中 
 *  2.对文本域内容进行合法性验证
 *  3.验证通过 用户选择的图片上传到专门的图片的服务器 返回图片外网的链接
 *    1.遍历图片数组
 *    2.挨个上传
 *    3.自己再维护图片数组存放图片上传后的外网的链接
 *  4.文本域和外网的图片的路径 一起提交到服务器（前端模拟，不会发送请求到后台）
 *  5.清空当前页面
 *  6.返回上一页
 */
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 图片路径的数组
    chooseImgs: [],
    // 文本域的值
    textVal: ""
  },
  // 外网的图片路径的数组
  uploadFile: [],
  handleTabsItemChange(e) {
    const { index } = e.detail;
    const { tabs } = this.data;
    tabs.forEach((v,i) => {
      i === index ? v.isActive = true :v.isActive = false; 
    })
    this.setData({
      tabs
    })
  },
  // 点击“+”选择图片
  handleChooseImgs() {
    // 调用小程序内置的选择图片的api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式--原图、压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源--相册、照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组进行拼接，防止再次添加照片时，将之前的照片覆盖掉
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
      
  },
  // 点击自定义图片的组件
  handleRemove(e) {
    // 获取被点击组件的索引
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    const { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交事件
  handleFormSubmit() {
    // 获取文本域的内容
    const { textVal,chooseImgs } = this.data;
    // 合法性验证
    if(!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        mask: true
      });
      return;
    }
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    // 判断有没有需要上传的图片数组
    if(chooseImgs.length !== 0) {
      // 准备上传图片到专门的图片服务器
      // 上传文件的api不支持多个文件同时上传，遍历数组，挨个上传
      chooseImgs.forEach((v,i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/api/upload',// 需要将此域名添加到小程序后台或者在本地设置中取消校验合法域名
          // 被上传的文件的路径
          filePath: v,
          // 上传文件的名称 后来根据此名称来获取文件
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (result)=>{
            let { url } = JSON.parse(result.data).data;
            this.uploadFile.push(url);
            // 所有图片都上传完毕才触发
            if(i === chooseImgs.length - 1) {
              // 关闭弹窗提示
              wx.hideLoading();
              // 提交全部成功
              // 重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    }else {
      // 只提交文本域
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
  }
})