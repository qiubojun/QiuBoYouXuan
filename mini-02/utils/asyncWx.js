// Promise 形式getSetting 
export const getSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });   
    })
}

// Promise 形式chooseAddress
export const chooseAddress=()=>{
    return new Promise((resolve, reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });   
    })
}

// Promise 形式openSetting
export const openSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });   
    })
}

// 将弹窗提示 封装为Promise 形式
/**
 * Promise 形式showModal
 * @param {object} param0 参数
 */
export const showModal=({content})=>{
    return new Promise((resolve, reject)=>{
        wx.showModal({
            title:'提示',
            content: content,
            success :(res) =>{
              resolve(res);
            },
            fial:(err)=>{
                reject(err);
            }
        })
    })
}

// Promise 形式showToast
export const showToast=({title})=>{
    return new Promise((resolve, reject)=>{
        wx.showToast({
            title: title,
            icon:'none',
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });   
    })
}

// Promise 形式login
export const login=()=>{
    return new Promise((resolve, reject)=>{
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });   
    })
}


// Promise 形式requestPayment 微信小程序支付
/**
 * Promise 形式showModal
 * @param {object} pay 支付必须要的参数
 */
export const requestPayment=(pay)=>{
    return new Promise((resolve, reject)=>{
        //小程序调取微信支付代码（发起微信支付）
        wx.requestPayment({
            //结构出来
            ...pay,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err);
            } 
        });
    })
}
