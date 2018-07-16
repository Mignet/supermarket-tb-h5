define(function(require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var laypage = require('/component/pager/laypage');
    var utils = require('/util/utils');
    var common = {

        // 用户认证绑定
        infoBind: function(response) {
            $("#balance").text(response.accountBalance);
            $("#income").text(response.totalProfit);
            // 用户名的长度
            var userNameLen = response.userName.length;
            if (userNameLen) {
                if (userNameLen == 2) {
                    $("#mobile").text(response.userName.substring(0, 1) + "*");
                } else if (userNameLen > 2) {
                    $("#mobile").text(response.userName.substring(0, 1) + "*" + response.userName.substring(userNameLen - 1));
                }
            } else {
                $("#mobile").text(response.mobile.substring(0, 3) + "****" + response.mobile.substring(7));
            }

            if (response.userName == "未认证") {
                $("#mobile").text(response.mobile.substring(0, 3) + "****" + response.mobile.substring(7));
            }

            $("#telephone").text(response.mobile.substring(0, 3) + "****" + response.mobile.substring(7));

            if (response.isBindBankCard) {
                $("#bindingCard").addClass('tips_bankcard_1').text('已绑定');
                $("#usernameAuthentication").addClass('tips_renz_1').text("已认证");
            } else {
                $("#bindingCard").addClass('tips_bankcard_0').text('未绑定');
                $("#usernameAuthentication").addClass('tips_renz_0').text('未认证');
                utils.pointOutBindCard();
            }
        },

        //退出操作
        logout: function() {
            var service = new Ajax();
            service.url = api.logout;
            service.isNeedToken = true;
            service.success = function() {
                //清除token
                utils.setCookie('token', '', -1);
                //跳转到登录界面
                parent.location.href = "/module/user/login.html";
            }
            service.request();
        },


        /**
         * 百度统计
         * [statistics description]
         * @return {[type]} [description]
         */
        statistics: function() {
            var _hmt = _hmt || [];
            if (config.environment === 'produce') {
                var hm = document.createElement("script");
                hm.src = "//hm.baidu.com/hm.js?eb0f04f6e3e81bc27e93021a1df603f3";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            }

            if (config.environment === 'pre') {
                var hm = document.createElement("script");
                hm.src = "//hm.baidu.com/hm.js?449f0c153a91ea1d44e0d5a1ba9a0110";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            }
        },
        
        /**
         * 获取系统默认配置接口
         * [getDefaultConfig description]
         * @return {[type]} [description]
         */
        getDefaultConfig: function() {
            var ajax = new Ajax();
            ajax.url = api.getDefaultConfig;
            ajax.isGoToLogin = false;
            ajax.isLoadMask = false;
            ajax.cache = true;
            ajax.success = function(data) {
                $(".company-tel").text(data.serviceTelephone);
                $(".company-email").text(data.serviceMail);
                if (config.environment == 'pre') {
                    config.imgHost.pre = data.img_server_url;
                } else {
                    config.imgHost.produce = data.img_server_url;
                }
            };
            ajax.request();
        },


        /**
         * 检查登录态接口
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        checkLoginStatus: function(callback) {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.minePage;
            ajax.isNeedToken = true;
            ajax.isGoToLogin = false;
            ajax.isLoadMask  = false;
            ajax.cache       = true;
            ajax.success = function(data) {
                if (data.code && data.code == "100003") {
                    $(".login-toobei").removeClass('none');
                    $(".register-button").parent().removeClass('none');
                    $('.site-fixedbar').children().eq(0).show();
                    $('.site-fixedbar').children().eq(1).css({'display':'block','right':'30px'});
                } else {  
                    $('.site-fixedbar').children().eq(1).show();                  
                    self.setting(data);
                } 
                callback && callback(data);
            }
            ajax.request();
            self.getDefaultConfig();
            self.statistics();
        },

        setting : function(data){
            window.isLogin = true;
            $(".welcome-toobei").text(data.userName + '，您好，欢迎您来到T呗！');
            $('.nav-left').find(".personal-mobile").text(utils.dealThePhone(data.mobile));
            if(data.isBindBankCard){
                $('.nav-left').find('.identify').parent().addClass('active');
                $('.nav-left').find('.card').parent().addClass('active');
            }
            if (data.msgCount > 100) {
                data.msgCount = 99;
            }
            if (data.msgCount > 0) {
                $('.messagecount').show();
                $('.messagecount').text(data.msgCount);
            }            
        }
    }
    module.exports = common;
})
