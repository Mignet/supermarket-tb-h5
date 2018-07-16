define(function(require, exports, module) {
  var utils = require('/util/utils');
  var common = require('/module/common/common');
  var api   = require('/config/api');
  var Ajax  = require('/component/ajax/ajax');
  var form  = require('/component/form/form');

  var account = {
  	init : function(){
        common.checkLoginStatus();
        this.initEvent();
    },

    initEvent : function(){
        var self = this;

        $(".form").on('click','a.sure',function(){
            if(!form.isPass($(this))) return;
            var data = form.getFormData($(this));
            self.setPayPassword(data);
        });

        $(document).on("keyup",function(event){
            var event=window.event||event;
            if(event.which == 13||event.keyCode == 13){
                $('.sure').trigger('click');
            }
        });
    },
    /**
     * 设置交易密码
     * @return {[type]} [description]
     */
    setPayPassword : function(jsondata){
       var ajax = new Ajax();
       ajax.url = api.initPayPwd;
       ajax.isNeedToken = true;
       ajax.data = jsondata;
       ajax.success = function(result){
            layer.msg('交易密码设置成功');
            setTimeout(function(){
                window.parent.location.reload();
                parent.layer.closeAll();
            },800)            
       };
       ajax.error= function(msg,data){
            layer.msg(msg);
            setTimeout(function(){
                window.parent.location.reload();
                parent.layer.closeAll();
            },800)               
       };
       ajax.request();   
    }
  };
  account.init();
});