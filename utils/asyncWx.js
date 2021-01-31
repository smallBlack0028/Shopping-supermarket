export const getSetting = () => {
  return new Promise((resolve,reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export const chooseAddress = () => {
  return new Promise((resolve,reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export const openSetting = () => {
  return new Promise((resolve,reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export const showModal = ({content}) => {
  return new Promise((resolve,reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      success: (result) => {
        resolve(result)
      },
      fail: (error)=>{
        reject(error)
      },
    });
  })
}

export const showToast = ({title}) => {
  return new Promise((resolve,reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (result) => {
        resolve(result)
      },
      fail: (error) => {
        reject(error)
      }
    });
  })
}

export const login = () => {
  return new Promise((resolve,reject) => {
    wx.login({
      timeout:10000,
      success: (result) => {
        resolve(result);
      },
      fail: (error) => {
        reject(error);
      }
    });
      
  })
}

export const Payment = ({Payment}) => {
  return new Promise((resolve,reject) => {
    wx.Payment({
      ...Payment,
      success: (result) => {
        resolve(result)
      },
      fail: (error) => {
        reject(error)
      }
    });
  })
}