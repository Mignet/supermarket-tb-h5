define(function (require, exports, module) {
    var utils   = require('/util/utils');
    var laypage = require('/component/pager/laypage');
    var Ajax    = require('/component/ajax/ajax');
    var api     = require('/config/api');
    var common  = require('/module/common/common');
    var personal  = require('/module/common/personal');
    var listTpl  = require('../template/platformManageList.html');
    var listTpl2 =  require('../template/ubBindList.html');

    var platformManage = {
        init: function () {
            common.checkLoginStatus();
            this.pageSize = 6;
            this.bindEvent();
            this.platformAccount();
            this.getPlatormStatistics();
            this.isAuthenticate();
        },

        bindEvent: function () {
            var self = this;
            $('.pm-content-title-item').on('click', function(){
                if($(this).hasClass('select-item')) return;
                $(".pm-content-title-item").removeClass('select-item');
                $(this).addClass('select-item');
                self.type = $(this).attr('type');
                window.pager = null;
                if(self.type == "1"){
                    self.platformAccount();
                }else{
                    self.noBindPlatformAccount();
                }
            });

            $(document).on('click','a.bind-button',function(){
                if($(this).hasClass('static-gray')) return;
                if(self.isAuthenticate){
                    self.bindThirdPlatrom($(this).attr('data-value'));
                }else{
                    layer.open({
                        type: 1,
                        title: '银行卡绑定提示',
                        shadeClose: true,
                        skin: 'yourclass',
                        area: ['600px', '345px'],
                        content: '<div style=" position:relative;top:50%;height:50%;margin-top:-6%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;">是否绑定银行卡？</h2><span style="font-size:15px;color:#646464;">绑定银行卡后，跨平台购买产品、提现T呗奖励更加方便。</span></div>',
                        btn: ['立即绑定'],
                        yes :function(layer,index){
                            location.href = "/module/account/bindBankCard.html";
                        },
                        success:function(layer,index){
                            $(layer).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
                        }
                    });                      
                }
            })

            $(document).on('click','button.enter-platform',function(){
                var orgNumber = $(this).attr('orgnumber');
                var orgName   = $(this).attr('orgname');
                var src = $(this).attr('src');
                personal.init(orgNumber,orgName,src);
            })            
        },

        platformAccount:function(pageNum){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.platfromManager;
            ajax.isNeedToken = true;
            ajax.data = {
                pageIndex: pageNum || 1,
                pageSize : self.pageSize,
                type: 1
            };
            ajax.success=function(response){
                $('.pm-content-list').html(_.template(listTpl)(response));
                common.pager(response.pageCount , $("#pager"), _.bind(self.platformAccount,self),3)      
            };
            ajax.request();
        },

        noBindPlatformAccount:function(pageNum){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.platfromManager;
            ajax.isNeedToken = true;
            ajax.data = {
                pageIndex: pageNum || 1,
                pageSize : self.pageSize,
                type: 2
            };
            ajax.success=function(response){
                $('.pm-content-list').html(_.template(listTpl2)(response));
                common.pager(response.pageCount,$("#pager"), _.bind(self.noBindPlatformAccount,self),3);
            };
            ajax.request();
        },

        getPlatormStatistics:function(){
            var _this = this;
            var ajax = new Ajax();
            ajax.url = api.platormStatistics;
            ajax.isNeedToken  =true;
            ajax.success=function(response){
                $('.pm-content-title-item').eq(0).text('已绑定（' + response.bindOrgAccountCount +'）');
                $('.pm-content-title-item').eq(1).text('未绑定（' + response.unBindOrgAccountCount +'）');
            }; 
            ajax.request();
        },

        isAuthenticate:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.personAuthenticate;
            ajax.back = true;
            ajax.isNeedToken = true;
            ajax.success = function(result){
                self.isAuthenticate = result.bundBankcard;
            }
            ajax.request();
        },

        bindThirdPlatrom : function(orgNumber){
             var self = this;
             var ajax = new Ajax();
             ajax.url = api.bindOrgAcct;
             ajax.isNeedToken=true;
             ajax.data = {
                  platFromNumber : orgNumber
             }
             ajax.success = function(data){
                  self.getPlatormStatistics();
                  self.noBindPlatformAccount();
             }
             ajax.request();          
        }
        
    }

    platformManage.init();
});