import {getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment} from "../../utils/asyncWx.js";
// 在小程序代码里使用es7的async和await语法(引入解决报错的包)
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request }from "../../request/index.js";
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    let cart=wx.getStorageSync("cart")||[];
    // 过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({address});

    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  // 点击支付
  async handleOrderPay(){
    try {
        // 1 判断缓存中有没有token
        const token=wx.getStorageSync("token");
        // 2 判断
        if(!token){
          wx.navigateTo({
            url: '/pages/auth/index'
          });
          return;
        }
        // 3 创建订单
        // 3.1 准备请求头参数
        const header = { Authorization: token };
        // 3.2 准备请求体参数
        const order_price = this.data.totalprice;
        const consignee_addr = this.data.address.all;
        const cart=this.data.cart;
        let goods=[];
        cart.forEach(v=>goods.push({
          goods_id:v.goods_id,
          goods_number:v.num,
          goods_price:v.goods_price
        }))
        const orderParams={order_price,consignee_addr,goods};
        // 4 准备发送请求创建订单获取订单编号
        const {order_number}=await request({url:"/my/orders/create", method:"POST", data:orderParams, header});
        // 5 发起预支付接口
        const {pay}=await request({url:"/my/orders/req_unifiedorder", method:"POST", header, data:{order_number} });
        // 6 发起微信支付
        await requestPayment(pay);
        // 7 查询后台 订单状态
        const res=await request({url:"/my/orders/chkOrder", method:"POST", header, data:{order_number} });
        // 支付弹窗提示
        await showToast({title:"支付成功"});
        // 7.1 手动删除缓存中已经支付了的商品
        let newCart=wx.getStorageSync("cart");
        newCart=newCart.filter(v=>!v.checked);
        wx.setstorageSync("cart", newCart);
        // 8 支付成功了跳转到订单页面
        wx.navigateTo({
          url:'/pages/order/index'
        });
    } catch (error) {
        await showToast({title:"支付成功"})
        console.log(error);
    }
  }

})