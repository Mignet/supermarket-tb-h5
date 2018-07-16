define(function(require, exports, module) {
  var utils = require('/util/utils');
  var common = require('/module/common/common');
  var api   = require('/config/api');
  var Ajax  = require('/component/ajax/ajax');
  var form  = require('/component/form/form');

  var account = {
  	init : function(){
        var self = this;
        common.checkLoginStatus(self.getMineData);
        this.initEvent();
    },

    initEvent : function(){
        var self = this;

        $(".form").on('click','a.sure',function(){
            if(!form.isPass($(this))) return;
            var formData = form.getFormData($(this));
            self.checkPayPassword(formData)
        });

        $(document).on("keyup",function(event){
            var event=window.event||event;
            if(event.which == 13||event.keyCode == 13){
                $(".sure").trigger('click');
            }
        });
    },
      /*
      * [获取个人信息]
      * */
      getMineData : function(data){
          $("#userName").text(data.userName);
      },
    /**
     * 修改前验证交易密码
     * @return {[type]} [description]
     */
    checkPayPassword : function(formData){
       var self = this;
       var ajax = new Ajax();
       ajax.url = api.verifyPayPwd;
       ajax.isNeedToken = true;
       ajax.data = {
          pwd :formData.oldPwd
       };
       ajax.success = function(result){
          if(result.rlt){
            self.changePayPassword(formData);
          }else{
            $('#oldPassword').addClass('input-onerror');
            $('.errorWrapper').html('<span class="error">请输入正确的原交易密码<span>');
          }
       }
       ajax.request();     
    },

    /**
     * 修改交易密码
     * @return {[type]} [description]
     */
    changePayPassword : function(formData){
       var ajax = new Ajax();
       ajax.url = api.modifyPayPwd;
       ajax.isNeedToken = true;
       ajax.data = formData;
       ajax.success = function(result){
           layer.msg('交易密码修改成功');
           setTimeout(function(){
              parent.layer.closeAll();           
           },800)            
       }
       ajax.request();         
    }
    
  }
  account.init();
})