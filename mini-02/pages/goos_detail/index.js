// 0 引入 来发送请求的方法 一定要把路径补全
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否被收藏
    isCollect:false 
  }, 

  // 商品对象
  GoodsInfo:{},

  onShow: function () {

    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;

    const {goods_id}=options;
    // console.log(goods_id);
    // 调用
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url: "/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;

    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];

    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

    // console.log(res);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机不识别 webp图片格式
        // 最好找到后台让他进行修改
        // 临时自己改确保后台存在1.webp =>1.jpg (正则)
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },

  // 点击轮播图放大预览
  handlePrevewImage(e){
    // 1 先构造要预览的图片数组
    const urls= this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2 接收传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  // 点击加入购物车
  handleCartAdd(){
    // 1 获取缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    // 2 判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      // 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title:'加入成功',
      icon:'success',
      // true防止用户 手抖 疯狂点击按钮
      mask: true
    });
  },

  // 点击 商品收藏图标
  handleCollect(){
    let isCollect=false;
    // 1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    // 2 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3 当index!=-1表示已经收藏过
    if(index!==-1){
      // 能找到已经收藏过了在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        // true防止用户 手抖 疯狂点击按钮
        mask: true,
      });
        
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync( "collect", collect);
    // 5 修改data中的属性iscollect
    this.setData({isCollect})
  }


})