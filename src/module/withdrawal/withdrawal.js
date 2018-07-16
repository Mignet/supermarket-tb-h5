define(function(require, exports, module) {
    var utils = require('/util/utils');
    var Ajax = require('/component/ajax/ajax');
    var form = require('/component/form/form');
    var api = require('/config/api');
    var common = require('/module/common/common');
    var layer = require('/component/layer/layer');

    var withdrawals = {
        init: function() {
            common.checkLoginStatus();
            this.bindEvent();
            this.getWithdrawBank();
            this.getAccountBalance();
            this.getProvince();
            this.getBank();
        },

        bindEvent: function() {
            var self = this;
            $('#selectProvince').on('change', function() {
                if (!$(this).val()) return;
                self.getCityByProvince($(this).val());
            })

            $("a.button").on('click', function() {
                if (!form.isPass($(this))) return;
                var data = form.getFormData($(this));
                var withdrawalAmt = data.amount * 1;
                var fee = self.bankInfo.fee * 1;
                var tip = '提现金额不能大于账户余额';
                if (fee > 0) {
                    withdrawalAmt = withdrawalAmt + fee;
                    tip = '加上提现手续费，提现金额不能大于账户余额';
                }
                if (withdrawalAmt > self.accountBalance) {
                    $('#amount').closest('.inputWrapper').addClass('onerror')
                    $(".errorWrapper").html('<i class="errorImg"></i><span class="error">' + tip + '</span>');
                    return false;
                }
                var arr = data.bankName.split(',');
                data.bankId = arr[0];
                data.bankCode = arr[1];
                data.bankName = arr[2];
                self.checkPassword(data);
            })

            //退出登录
            $("#loginOut").on('click', function() {
                layer.confirm('确定退出登录？', function(index) { common.logout();
                    layer.close(index); });
            });
            $('.personal-setting a').on('click', function() {
                location.href = '../setting/setting.html';
            });
        },

        /**
         * 检查提现密码
         * [checkPassword description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        checkPassword: function(data) {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.verifyPayPwd;
            ajax.isNeedToken = true;
            ajax.data = {
                pwd: data.password
            }
            ajax.success = function(result) {
                if (result.rlt) {
                    self.withdrawal(data);
                } else {
                    $('#password').closest('.inputWrapper').addClass('onerror')
                    $(".errorWrapper").html('<i class="errorImg"></i><span class="error">交易密码不正确</span>');
                    return false;
                }
            }
            ajax.request();
        },

        /**
         * 提现
         * [withdrawal description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        withdrawal: function(data) {
            var self = this;
            if (this.bankInfo.needkaiHuHang) {
                data.bankCard = this.bankInfo.bankCard;
            } else {
                data.bankName = this.bankInfo.bankName;
                data.bankCard = this.bankInfo.bankCard;
                data.kaihuhang = this.bankInfo.kaiHuHang;
                data.city = this.bankInfo.city;
            }
            var ajax = new Ajax();
            ajax.url = api.userWithdrawRequest;
            ajax.data = data;
            ajax.success = function(result) {
                if (self.bankInfo.limitTimes > 0) {
                    self.bankInfo.feeTextPop = '本月还可免费提现' + (self.bankInfo.limitTimes-1) + '次';
                } else {
                    self.bankInfo.feeTextPop = '本次 ' + self.bankInfo.fee + ' 元';
                }
                self.successed(data);
            }
            ajax.request();
        },

        /**
         * 提现成功提示
         * [successed description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        successed: function(data) {
            var obj = _.extend(data, this.bankInfo);
            var tpl = $("#withdrawal-pop").html();
            layer.open({
                type: 1,
                title: '提现申请已提交',
                shadeClose: true,
                skin: 'yourclass',
                area: ['600px', '365px'],
                content: _.template(tpl)(obj),
                btn: ['查看提现记录', '关闭'],
                yes: function(ok) {
                    layer.closeAll();
                    location.href = '/module/account/account.html?from=withdrawal';
                },
                btn2: function() {
                    location.reload();
                }
            });
        },

        /**
         * 获取账户余额
         * [getAccountBalance description]
         * @return {[type]} [description]
         */
        getAccountBalance: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.myaccount;
            ajax.isNeedToken = true;
            ajax.success = function(result) {
                self.accountBalance = result.totalAmount * 1;
                $("#accountBalance").text(result.totalAmount);
            };
            ajax.request();
        },

        /**
         * 初始化提现信息
         * [getWithdrawBank description]
         * @return {[type]} [description]
         */
        getWithdrawBank: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.getWithdrawBankCard;
            ajax.success = function(result) {
                self.bankInfo = result;
                console.log(self.bankInfo)
                if (result.limitTimes > 0) {
                    self.bankInfo.feeText = '本月还可免费提现' + result.limitTimes + '次';
                } else {
                    self.bankInfo.feeText = '本次 ' + result.fee + ' 元';
                }
                if (result.needkaiHuHang) {
                    $('form').find('li.none').removeClass('none');
                    $('form').find('[novalidate]').removeAttr('novalidate');
                } else {
                    $('span.bankName').text(result.bankName);
                }
                self.bankInfo.dealTheAccNo = utils.dealTheAccNo(result.bankCard);
                $("#withdrawFee").text(self.bankInfo.feeText);
                $('#bankNumber').text(self.bankInfo.dealTheAccNo);
                $("#paymentDate").text(result.paymentDate);
            };
            ajax.request();
        },


        /**
         * 获取省份
         * [getProvince description]
         * @return {[type]} [description]
         */
        getProvince: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.queryAllProvince;
            ajax.success = function(result) {
                $('#selectProvince').append(_.map(result.datas, function(item) {
                    return '<option value="' + item.provinceId + '">' + item.provinceName + '</option>';
                }).join(''));
            };
            ajax.request();
        },

        /**
         * 根据省份获取城市
         * [getCityByProvince description]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        getCityByProvince: function(id) {
            var ajax = new Ajax();
            ajax.url = api.queryCityByProvince;
            ajax.data = {
                provinceId: id
            };
            ajax.success = function(result) {
                $('#selectCity').html('').html('<option value="">请选择城市</option>');
                $('#selectCity').append(_.map(result.datas, function(item) {
                    return '<option value="' + item.cityName + '">' + item.cityName + '</option>';
                }).join(''));
            };
            ajax.request();
        },

        /**
         * 获取银行提现银行
         * [getBank description]
         * @return {[type]} [description]
         */
        getBank: function() {
            var ajax = new Ajax();
            ajax.url = api.queryAllBank;
            ajax.isNeedToken = true;
            ajax.success = function(result) {
                $('#selectBank').append(_.map(result.datas, function(item) {
                    return '<option value="' + item.bankId + ',' + item.bankCode + ',' + item.bankName + '">' + item.bankName + '</option>';
                }).join(''));
            };
            ajax.request();
        }

    }

    withdrawals.init();
});
