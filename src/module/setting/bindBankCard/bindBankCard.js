define(function(require, exports, module) {
  var utils = require('/util/utils');
  var common = require('/module/common/common');
  var api   = require('/config/api');
  var Ajax  = require('/component/ajax/ajax');
  var form  = require('/component/form/form');

  var account = {
  	init : function(){
         common.checkLoginStatus();
         this.renderQueryAllBank();
         //this.getUserPayPwdDetail();
         this.initEvent();
    },

    initEvent : function(){
      var _this = this;
      $(".button").on('click',function(){
          if(!form.isPass($(this))) return;
          var formData = form.getFormData($(this));
          formData.bankId   = formData.bankName.split(",")[0];
          formData.bankCode = formData.bankName.split(",")[1];
          formData.bankName = formData.bankName.split(",")[2];
          _this.addNewbankCard(formData);
      })

      $('#selectBank').on('focus',function(){
          $(this).addClass('color');
      })

      $('#selectBank').on('change',function(){
          if(!$(this).val()){
              $(this).removeClass('color');
          }
      });
      $(document).on("keyup",function(event){
          var event=window.event||event;
          if(event.which == 13||event.keyCode == 13){
              $(".button").trigger('click');
          }
      });
  	},
      /*
      * [渲染所有银行]
      * */
    renderQueryAllBank:function(){
      var _this = this;
      var ajax = new Ajax();
      ajax.isNeedToken = true;
      ajax.isLoadMask  = false;  
      ajax.url = api.queryAllBank;
      ajax.success=function(response){
        for (var i = 0; i < response.datas.length; i++) {
            var data = response.datas[i];
            $('#selectBank').append('<option value="'+data.bankId+','+data.bankCode+','+data.bankName+'">'+data.bankName+'</option>');
        }
      };
      ajax.request();
    },

    // 添加新银行卡
    addNewbankCard:function(data){
      var ajax = new Ajax();
      ajax.isNeedToken = true;
      ajax.url  = api.addBankCard;
      ajax.data = data;
      ajax.success=function(result){
          window.parent.location.reload();
      };
      ajax.request(); 
    },

    // 查询用户是否有设置交易密码
    getUserPayPwdDetail : function(){
        var ajax= new Ajax();
        ajax.url = api.verifyPayPwdState;
        ajax.isNeedToken = true;
        ajax.success=function(result){
          if(!result.rlt){
            $(".setPayPwdButton").css('display','block');
          }
        };
        ajax.request();
    }
  };
  account.init();
});