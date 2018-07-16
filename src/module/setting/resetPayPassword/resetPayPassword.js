define(function(require, exports, module) {
  var utils = require('/util/utils');
  var common = require('/module/common/common');
  var api   = require('/config/api');
  var Ajax  = require('/component/ajax/ajax');
  var form  = require('/component/form/form');

  var account = {
  	init : function(){
        var self = this;
        common.checkLoginStatus(self.getMinedata);
        this.initEvent();
        this.getUserBindCardMsg();
    },

    initEvent : function(){
        var self = this;
        $("#submit").on('click',function(){
            if(!form.isPass($(this))) return;
            var formData = form.getFormData($(this));
            self.checkVcode(formData);
        });

        $(document).on("keyup",function(event){
            var event=window.event||event;
            if(event.which == 13||event.keyCode == 13){
                $("#submit").trigger('click');
            }
        });
    },
    /*
    * [获取个人信息]
    * */
    getMinedata:function(data){
        var self = this;
        $("#userMobile").text(utils.dealThePhone(data.mobile));
        $("#mobile").val(data.mobile);
    },

    checkVcode : function(formData){
        var self = this;
        var ajax = new Ajax();
        ajax.url = api.inputVcode;
        ajax.isNeedToken = true;
        ajax.data = {vcode : formData.vcode};
        ajax.success = function(result){
           self.resetPayPwd(result.resetPayPwdToken,formData);
        };
        ajax.request();
    },
    
    resetPayPwd : function(str,data){
        var ajax = new Ajax();
        ajax.url = api.resetPayPwd;
        ajax.isNeedToken = true;
        ajax.data = {
          pwd : data.pwd,
          resetPayPwdToken:str
        };
        ajax.success = function(result){
          layer.msg('找回交易密码成功');
          setTimeout(function(){
              window.parent.location.reload();
          },800)
        }
        ajax.request();       
    },
      /*
       * [获取用户绑卡信息]
       * */
      getUserBindCardMsg:function(){
          var ajax = new Ajax();
          ajax.url=api.getUserBindCard;
          ajax.isNeedToken = true;
          ajax.success = function(result){
              $("#name").val(result.userName);
              $("#idCardNo").val(result.idCard);
          };
          ajax.request();
      },
  }
  account.init();
})