// 0 引入 来发送请求的方法 一定要把路径补全
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value:"综合",
        isActive: true
      },
      {
        id: 1,
        value:"销量",
        isActive: false
      },
      {
        id: 2,
        value:"价格",
        isActive: false
      },
    ],
    goodsList:[]
  },

  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid || "";
    this.QueryParams.query=options.query || "";
    this.getGoodsList()
  },

  // 发送异步请求
  // 获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});

    // 获取总条数
    const total=res.total;

    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);

    // console.log(res);
    this.setData({
      // 拼接了数组
      goodsList:[...this.data.goodsList,...res.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();

  },

  // 标题点击事件从子组件传递过来
  handleTabsItemChange(e){
    console.log(e);
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom(){
    // console.log("页面触底");
    if(this.QueryParams.pagenum>=this.totalPages){
      // 没有下一页数据
      //console.log("没有下一页数据");
      wx.showToast({ title: '゜W゜到底哦',});
        

    }else{
      // 还有下一页数据
      //console.log("还有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },

  // 下拉刷新事件
  onPullDownRefresh(){
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    // 2 重置页码
    this.QueryParams.pagenum=1;
    // 3 发送请求
    this.getGoodsList();
  }


})