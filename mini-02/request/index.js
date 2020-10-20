// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request=(params)=>{

  // 判断url中是否带有/my/请求的是私有的路径带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接header带上token
    header["Authorization"]=wx.getStorageSync("token");
  }

  ajaxTimes++;
  // 显示加载中效果
  wx.showLoading({
    title:"加载中zzz",
    mask: true
  });

  return new Promise((resolve, reject)=>{
    // 定义公共的url
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
    wx.request({
      ...params,
      header:header,
      // url的拼接
      url:baseUrl+params.url,
      
      success:(result)=>{
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err);
      },

      // 不管加载成功或者失败都执行
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
          // 关闭正在等待的图标
          wx.hideLoading();
        }
      }

    });
  })
}
// 以上是封装过的 发送请求方法
