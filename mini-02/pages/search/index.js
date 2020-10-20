// 0 引入 来发送请求的方法 一定要把路径补全
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    // 输入框的值 
    inpValue:""
  },
  TimeId:-1,

  // 输入框的值改变就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail;
    // 2 检测合法性
    if(!value.trim()){
    
      this.setData({
        goods:[],
        isFocus:false
      })

      // 值不合法
      return;
    }
    // 3 准备发送请求获取数据
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    }, 1000);

    // 输入完成显示 取消按钮
    this.setData({
      isFocus:true
    })
    
  },

  // 发送请求获取搜索建议数据
  async qsearch(query){
    const res=await request({url: "/goods/qsearch", data:{query}});
    console.log(res);
    this.setData({
      goods:res
    })
  },

  // 点击取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }


})