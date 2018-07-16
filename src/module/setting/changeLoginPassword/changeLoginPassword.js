define(function(require, exports, module) {
  var common = require('/module/common/common');
  var Ajax   = require('/component/ajax/ajax');
  var form   = require('/component/form/form');
  var api    = require('/config/api');
  var changeLoginPassword = {
  	init : function(){
        common.checkLoginStatus(this.getMineData);
        this.initEvent();
    },

    initEvent : function(){
        var self = this;
        $(".form").on('click','#changeLoginPasswordEvent',function(){
            if(!form.isPass($(this))) return;
            var data = form.getFormData($(this));
            self.changeLoginPassword(data)
        })
        $(document).on("keyup",function(event){
            var event=window.event||event;
            if(event.which == 13||event.keyCode == 13){
                $('#changeLoginPasswordEvent').trigger('click');
            }
        });
    },
    getMineData : function(data){
        $("#userName").text(data.userName);
    },
    /**
     * 修改登录密码
     * @return {[type]} [description]
     */
    changeLoginPassword : function(data){
       var ajax = new Ajax();
       ajax.url = api.modifyLoginPwd;
       ajax.isNeedToken = true;
       ajax.data = data;
       ajax.success = function(result){
           layer.msg('登录密码修改成功');
           setTimeout(function(){
               window.parent.location.href = "/module/user/login.html";
               common.logout();
           },800)  
       }
       ajax.request();
    }
  }
  changeLoginPassword.init();
})