define(function(require, exports, module){
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    module.exports = {
        init : function(number,name,src){
            this.number = number;
            this.name   = name;
            this.src    = src;  
            this.isRegisterThirdPlatfrom();        
        },

        /**
         * 是否注册第三方账户
         * [isBindAccount description]
         * @return {Boolean} [description]
         */
        isRegisterThirdPlatfrom : function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.isBindOtherOrg;
            ajax.data = {
                'platFromNumber': self.number
            }
            ajax.success = function(result){
                if (result.isBind) {
                    self.skipThirdPlatform();
                } else {
                    if(self.number == "OPEN_XIAONIUZAIXIAN_WEB"){
                        self.kindlyReminder(); 
                    }else{
                        self.isThirdPlatfromOldAccount(); 
                    }
                }
            }
            ajax.request();
        },

        /**
         * 检查是否是第三方的老用户
         * [isThirdPlatfromOldAccount description]
         * @return {Boolean} [description]
         */
        isThirdPlatfromOldAccount:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.isExistInPlatform;
            ajax.isNeedToken = true;
            ajax.async = false;
            ajax.data = {
                'platFromNumber': self.number
            };
            ajax.success = function(result) {
                if(result.isExist){
                    self.existAccountReminder();                 
                }else{
                    self.kindlyReminder(); 
                }
            };
            ajax.request();           
        },

        /**
        * 注册第三方账户
        * @return {[type]} [description]
        */
        registerThirdAccount : function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.bindOrgAcct;    
            ajax.data = {
                'platFromNumber': self.number
            }
            ajax.success = function(data){
                layer.closeAll();
                self.skipThirdPlatform();
            }
            ajax.error = function(msg,data){
                layer.closeAll();
                if(data.errors[0].code == "old_user_error"){                  
                    self.existAccountReminder();
                }else{
                    layer.msg(msg);
                }
            }
            ajax.request(); 
        },        


        /**
         * 温馨提示
         * [kindlyReminder description]
         * @return {[type]} [description]
         */
        kindlyReminder:function(){
            var self = this;
            layer.open({
                type: 1,
                title: '温馨提示',
                shadeClose: true,
                skin: 'yourclass',
                area: ['600px', '345px'],
                content: '<div style=" position: relative;top:50%;height:50%;margin-top:-10%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><img src='+self.src+' style="width:91px;height:40px;margin-bottom:15px"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;">一键开通'+self.name+'账户？</h2><span style="font-size:15px;color:#646464;">提示：开通后，可能会收到平台的回访哦~</span></div>',
                btn: ['一键开通'],
                yes :function(layer,index){
                    self.registerThirdAccount();
                },
                success:function(layer,index){
                    $(layer).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
                }   
            });                  
        }, 

        /**
         * 已经注册第三方的老用户提示
         * [existAccountReminder description]
         * @return {[type]} [description]
         */
        existAccountReminder:function(){
            var self = this;
            layer.open({
                type: 1,
                title: '温馨提示',
                shadeClose: true,
                skin: 'yourclass',
                area: ['600px', '345px'],
                content: '<div style="position: relative;top:50%;height:50%;margin-top:-8%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;">您已有'+self.name+'账号？</h2><span style="font-size:15px;color:#646464;">T呗奖励仅限新开通账户投资使用，建议您购买其他平台产品。</span></div>',
                btn: ['查看其他平台'],
                yes :function(el,index){
                    location.href = "/module/platform/platform.html";
                },
                success:function(el,index){
                    $(el).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
                }                        
            });               
        },        

        /**
        * 获取参数跳转第三方
        * @return {[type]} [description]
        */
        skipThirdPlatform : function(){
            var tab = window.open('about:blank', '_blank');
            tab.location = "/module/platformManage/thirdPlatform.html?orgNo=" + this.number + "&orgName=" + this.name;           
        }  
    }
})

