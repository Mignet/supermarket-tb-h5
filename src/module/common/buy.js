define(function(require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    module.exports = {
    	init : function(number,name,productId,src,isJoint){
            if(window.isLogin){
                this.number    = number;
                this.name      = name;
                this.productId = productId;
                this.src       = src;
                this.isJoint = isJoint;
                //判断是否对接
                if(this.isJoint){
                    this.isIdentityAuthentication();                  
                }else{
                    this.isJointLabel();
                }
            }else{
                layer.open({
                    type: 1,
                    title: '您还未登录T呗',
                    shadeClose: true,
                    skin: 'yourclass',
                    area: ['600px', '445px'],
                    content: '<div><img src="/image/login_icon.png"></div>',
                    btn: ['登录', '注册绑定平台'],
                    yes : function(el,index){
                        window.open("/module/user/login.html");
                    },
                    btn2: function(el,index) {
                        window.open("/module/user/register.html");
                    }
                });                             
            }
    	},

        /**
        * 未对接平台用户不能购买
        */
        isJointLabel:function(){
            var self = this;
            layer.open({
                type: 1,
                title: '温馨提示',
                shadeClose: true,
                skin: 'yourclass',
                area: ['600px', '400px'],
                content: '<div style="position:relative;top:25%;height:50%;margin-top:-6%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;font-weight:bold;">'+self.name+'产品不能购买？</h2><p style="color:#646464;font-size:15px;">PC端暂未开放购买。如需购买，请您前往T呗微信公众号进行购买。</p><img style="display:block;margin:20px auto 5px;" src="/image/footer_qrcode_icon.png"><p style="font-size:15px;">T呗微信公众号</p></div>',
                btn: ['查看其他产品'],
                yes :function(){
                    location.href = "/module/product/list.html";
                },
                success:function(el,index){
                    $(el).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
                }                
            }); 
        },

        /**
         * 是否实名认证
         * [isIdentityAuthentication description]
         * @return {Boolean} [description]
         */
        isIdentityAuthentication : function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.personAuthenticate;
            ajax.back = true;
            ajax.async = false;
            ajax.success = function(result) {
                if (result.bundBankcard) {
                    self.isBindThirdPlatfrom();
                } else {
                    layer.open({
                        type: 1,
                        title: '银行卡绑定提示',
                        shadeClose: true,
                        skin: 'yourclass',
                        area: ['600px', '345px'],
                        content: '<div style=" position:relative;top:50%;height:50%;margin-top:-6%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;font-weight:bold;">是否绑定银行卡？</h2><span style="font-size:15px;color:#646464;">绑定银行卡后，跨平台购买产品、提现T呗奖励更加方便。</span></div>',
                        btn: ['立即绑定'],
                        yes :function(el,index){
                            location.href = "/module/setting/setting.html";
                        },
                        success:function(el,index){
                            $(el).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
                        }
                    });                  
                }
            };            
            ajax.request();
        },

        /**
         * 是否注册第三方账户
         * [isBindAccount description]
         * @return {Boolean} [description]
         */
        isBindThirdPlatfrom: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.isBindOtherOrg;
            ajax.async = false;
            ajax.data = {
                'platFromNumber': self.number
            };
            ajax.success = function(result) {
                if (result.isBind) {
                    self.skipThirdPlatform();
                } else {
                    if(self.number == "OPEN_XIAONIUZAIXIAN_WEB"){
                        self.kindlyReminder(); 
                    }else{
                        self.isThirdPlatfromOldAccount(); 
                    }
                }
            };
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
         * [registerThirdAccount description]
         * @return {[type]} [description]
         */
        registerThirdAccount: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.bindOrgAcct;
            ajax.async = false;
            ajax.data = {
                'platFromNumber': self.number
            };
            ajax.success = function(data) {
                layer.closeAll();
                self.skipThirdPlatform();
            };
            ajax.error = function(msg, data) {
                layer.closeAll();
                if(data.errors[0].code == "old_user_error"){
                    //主要针对小牛在线，其他平台已经检查过                  
                    self.existAccountReminder();
                }else{
                    layer.msg(msg);
                }
            };
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
                content: '<div style=" position: relative;top:50%;height:50%;margin-top:-10%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><img src='+self.src+' style="width:91px;height:40px;margin-bottom:15px"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;font-weight:bold;">一键开通'+self.name+'账户？</h2><span style="font-size:15px;color:#646464;">提示：开通后，可能会收到平台的回访哦~</span></div>',
                btn: ['一键开通'],
                yes :function(el,index){
                    layer.closeAll();
                    self.registerThirdAccount();
                },
                success:function(el,index){
                    $(el).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
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
                content: '<div style="position: relative;top:50%;height:50%;margin-top:-8%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;font-weight:bold;">您已有'+self.name+'账号？</h2><span style="font-size:15px;color:#646464;">T呗奖励仅限新开通账户投资使用，建议您购买其他平台产品。</span></div>',
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
         * 跳转第三方平台购买
         * [skipThirdPlatform description]
         * @return {[type]} [description]
         */
        skipThirdPlatform: function() {
            var tab = window.open('about:blank', '_blank');
            tab.location = "/module/product/thirdPlatform.html?orgNo=" + this.number + "&orgName=" + this.name + "&productId="+ this.productId;
        }
    }
});
