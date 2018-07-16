define(function (require, exports, module) {
    var utils = require('/util/utils');
    var Ajax  = require('/component/ajax/ajax');
    var form  = require('/component/form/form');
    var api   = require('/config/api');
    var common  = require('/module/common/common');

    var withdrawals = {
        init: function () {
            common.isLogin();
            this.bindEvent();
            this.getWithdrawBank();
            this.getAccountBalance();
            this.getProvince();
            this.getBank();
        },

        bindEvent: function () {
            var self = this;
            $('#selectProvince').on('change', function () {
                if(!$(this).val()) return;
                self.getCityByProvince($(this).val());
            })

            $('#selectProvince,#selectCity,#selectBank').on('focus',function(){
                $(this).addClass('color');
            })

            $('#selectProvince,#selectCity,#selectBank').on('change',function(){
                 if(!$(this).val()){
                    $(this).removeClass('color');
                 }
            })

            $("a.button").on('click',function(){
                if(!form.isPass()) return;
                var data = form.getFormData();
                if(self.bankInfo.fee * 1){
                    if((data.amount * 1 + self.bankInfo.fee * 1) > (self.accountBalance * 1)){
                        $('#amount').addClass('input-onerror')
                        $(".errorBox").html('<span class="error">加上提现手续费，提现金额不能大于账户余额</span>');
                        return false;
                    }
                }else{
                    if(data.amount*1 > self.accountBalance*1){
                        $('#amount').addClass('input-onerror')
                        $(".errorBox").html('<span class="error">提现金额不能大于账户余额</span>');
                        return false;
                    }                    
                }
                var arr = data.bankName.split(',');
                data.bankId   = arr[0];
                data.bankCode = arr[1];
                data.bankName = arr[2];
                self.checkPassword(data);
            })

            $("#logOut").click(function(){
                common.loginOut();
            })
        },

       checkPassword : function(data){
           var self = this;
           var ajax  = new Ajax();
           ajax.url  = api.verifyPayPwd;
           ajax.isNeedToken = true;
           ajax.data = {
               pwd : data.password
           }
           ajax.success = function(result){
              if(result.rlt){
                  self.withdrawal(data);               
              }else{
                  $('#password').addClass('input-onerror')
                  $(".errorBox").html('<span class="error">交易密码不正确</span>');                   
              }
           }
           ajax.request();
       },

       withdrawal : function(data){
           var self = this;
           if(this.bankInfo.needkaiHuHang){
              data.bankCard  = this.bankInfo.bankCard;
           }else{
              data.bankName  = this.bankInfo.bankName;
              data.bankCard  = this.bankInfo.bankCard;
              data.kaihuhang = this.bankInfo.kaiHuHang;
              data.city      = this.bankInfo.city;
           }
           var ajax  = new Ajax();
           ajax.url  = api.userWithdrawRequest;
           ajax.isNeedToken = true;
           ajax.data = data;
           ajax.success = function(result){
                if(data.limitTimes > 0){
                    data.feeText = '本次提现免费';
                }else{
                    data.feeText = '本次 '+data.fee+' 元';       
                }            
              self.successed(data);
           }
           ajax.request();           

       },

        successed: function (data) {
            var obj = _.extend(data,this.bankInfo);
            layer.open({
                type: 1,
                title: '提现申请已提交',
                closeBtn: true,
                shadeClose: true,
                skin: 'yourclass',
                area: ['420px','358px'],
                content: _.template(require('./withdrawals-pop.html'))(obj),
                btn    : ['查看提现记录','关闭'],
                yes  : function(ok){
                    layer.closeAll();
                    location.href = '/module/toobei/toobei.html?flag=1';
                },
                btn2 : function(){
                    location.reload();
                }
            });  

        },  

        getAccountBalance : function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.myaccount;
            ajax.isNeedToken = true;
            ajax.success = function (result) {
               self.accountBalance = result.totalAmount;
               $("#accountBalance").text(result.totalAmount); 
            };
            ajax.request();    
        },


        getWithdrawBank : function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.getWithdrawBankCard;
            ajax.isNeedToken = true;
            ajax.success = function (result) {
                self.bankInfo = result;
                if(result.limitTimes > 0){
                    self.bankInfo.feeText = '本月还可免费提现'+ result.limitTimes+'次';
                }else{
                    self.bankInfo.feeText = '本次 '+result.fee+' 元';       
                }
                if(result.needkaiHuHang){
                    $('form').find('li.hidden').removeClass('hidden');
                    $('form').find('[novalidate=true]').removeAttr('novalidate');                   
                }else{
                    $('span.bankName').text(result.bankName);
                }
                self.bankInfo.dealTheAccNo = utils.dealTheAccNo(result.bankCard);
                $("#withdrawFee").text(self.bankInfo.feeText);            
                $('#bankNumber').text( self.bankInfo.dealTheAccNo);
                $("#paymentDate").text(result.paymentDate);
            };
            ajax.request();           
        },


        getProvince: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.queryAllProvince;
            ajax.isNeedToken = true;
            ajax.success = function (result) {
                $('#selectProvince').append(_.map(result.datas,function (item) {
                    return '<option value="' + item.provinceId + '">' + item.provinceName + '</option>';
                }).join(''));
            };
            ajax.request();
        },

        getCityByProvince: function (id) {
            var ajax = new Ajax();
            ajax.url = api.queryCityByProvince;
            ajax.isNeedToken = true;
            ajax.data = {
                provinceId: id
            };
            ajax.success = function (result) {
                $('#selectCity').html('').html('<option value="">请选择城市</option>');
                $('#selectCity').append(_.map(result.datas,function (item) {
                    return '<option value="' + item.cityName + '">' + item.cityName + '</option>';
                }).join(''));
            };
            ajax.request();
        },

        getBank: function () {
            var ajax = new Ajax();
            ajax.url = api.queryAllBank;
            ajax.isNeedToken = true;
            ajax.success = function (result) {
                $('#selectBank').append(_.map(result.datas,function (item) {
                    return '<option value="' + item.bankId + ','+item.bankCode+','+item.bankName+'">' + item.bankName + '</option>';
                }).join(''));
            };
            ajax.request();
        }
    
    }

    withdrawals.init();
});