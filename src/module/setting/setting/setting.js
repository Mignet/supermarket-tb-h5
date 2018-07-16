define(function(require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var utils = require('/util/utils');
    var common = require('/module/common/common');
    var laypage = require('/component/pager/laypage');
    var layer = require('/component/layer/layer');
    var setting = {
        init: function() {
            var self = this;
            common.checkLoginStatus(self.getMinedata);
            this.getUserIsbindCard();
            this.getUserPayPwdDetail();
            this.initEvent();
        },

        initEvent: function() {
            var self = this;
            //退出登录
            $("#loginOut").on('click', function() {
                layer.confirm('确定退出登录？', function(index) { common.logout();
                    layer.close(index); });
            });
            $('.personal-setting a').on('click', function() {
                location.href = '../setting/setting.html';
            });

            //修改登录密码
            $('#changeLoginPassword').on('click', function() {
                self.changeLoginPasswordReminder();
            });

            //绑定银行卡和实名认证
            $(".site-content").on('click', "#userGoAuthentication,#userGoBindCard", function() {
                self.bindCardReminder();
            });

            //设置支付密码 必须先绑卡
            $(".site-content").on('click', '#setPayPassword', function() {
                if (self.isBindCard) {
                    self.setPayPasswordReminder();
                } else {
                    layer.msg('用户未绑卡,请先绑卡')
                }
            });

            //重置支付密码
            $(".site-content").on('click', '#resetPayPassword', function() {
                self.resetPayPasswordReminder();
            });

            //修改支付密码
            $(".site-content").on('click', "#changePayPassword", function() {
                self.changePayPasswordReminder();
            });

        },
        /*
         * [获取个人信息]
         * */
        getMinedata: function(data) {
            var self = this;
            window.userName = data.userName;
            $("#userMobile").text(utils.dealThePhone(data.mobile))
        },
        /*
         * [修改登录密码弹窗]
         * */
        changeLoginPasswordReminder: function() {
            this.pop('./changeLoginPassword.html', '550px', '308px');
        },
        /*
         * [判断用户是否绑卡]
         * */
        getUserIsbindCard: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.personAuthenticate;
            ajax.isNeedToken = true;
            ajax.success = function(result) {
                self.isBindCard = result.bundBankcard;
                if (result.bundBankcard) {
                    self.getUserBindCardMsg();
                    $(".user-no-authentication").hide();
                    $(".user-has-authentication").show().siblings('.list-ico').addClass('list-ico-yes');
                } else {
                    $(".user-no-authentication").show();
                    $(".user-has-authentication").hide();
                }
            };
            ajax.request();
        },
        /*
         * [获取用户绑卡信息]
         * */
        getUserBindCardMsg: function() {
            var ajax = new Ajax();
            ajax.url = api.getUserBindCard;
            ajax.isNeedToken = true;
            ajax.success = function(result) {
                $("#userHasAuthentication").html("*" + result.userName.substr(1) + "&nbsp;&nbsp;" + utils.dealTheAccNo(result.idCard));
                $("#userHasBindCard").html(result.bankName + "&nbsp;&nbsp;" + utils.dealTheAccNo(result.bankCard))

            };
            ajax.request();
        },
        /*
         * [查询用户是否有设置交易密码]
         * */
        getUserPayPwdDetail: function() {
            var ajax = new Ajax();
            ajax.url = api.verifyPayPwdState;
            ajax.isNeedToken = true;
            ajax.success = function(result) {
                if (result.rlt) {
                    $(".user-no-pay-password").hide();
                    $(".user-has-pay-password").show().siblings('.list-ico').addClass('list-ico-yes');
                } else {
                    $(".user-no-pay-password").show();
                    $(".user-has-pay-password").hide();
                }
            };
            ajax.request();
        },
        /*
         * [绑卡弹窗]
         * */
        bindCardReminder: function() {
            this.pop('./bindBankCard.html', '550px', '340px');
        },
        /*
         * [设置交易密码弹窗]
         * */
        setPayPasswordReminder: function() {
            this.pop('./setPayPassword.html', '550px', '230px');
        },
        /*
         * [重置/找回登录密码弹窗]
         * */
        resetPayPasswordReminder: function() {
            this.pop('./resetPayPassword.html', '550px', '308px');
        },
        /*
         * [修改交易密码弹窗]
         * */
        changePayPasswordReminder: function() {
            this.pop('./changePayPassword.html', '550px', '308px');
        },
        /*
         * [弹窗]
         * @param {string} url [弹窗页面]
         * @param {string} areaX [弹窗宽]
         * @param {string} areaY [弹窗高]
         * @param {function} callBack [回调函数]
         * */
        pop: function(url, areaX, areaY, callBack) {
            layer.open({
                title: "",
                type: 2,
                area: [areaX, areaY],
                fix: true,
                scrollbar: false,
                shade: .5,
                content: [url, 'no'],
                success: function(layer, index) {
                    if (callBack) {
                        callBack();
                    }
                }
            });
        }
    };
    setting.init();
});
