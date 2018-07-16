define(function(require,exports,module){
    var utils   = require('/util/utils');
    var laypage = require('/component/pager/laypage');
    var layer = require('/component/layer/layer');
    var Ajax    = require('/component/ajax/ajax');
    var api     = require('/config/api');
    var common  = require('/module/common/common');
    var personal  = require('/module/common/personal');
    var organizationListTpl = $("#organizationListTpl").html();
    var organization={
        init:function(){
            this.pageIndex = 1;
            this.pageSize = 9;
            common.checkLoginStatus();
            this.platformAccount();
            this.isAuthenticate();
            this.bindEvent();
        },
        bindEvent:function(){
            var self = this;

            //点击开通
            $("#organizationList").on('click','.open-button', function (event) {
                var event = window.event || event;
                if(self.isBindCard){
                    self.isThirdPlatfromOldAccount($(this).data('number'),$(this).data('name'));
                }else{
                    self.bindCardReminder();
                }
                event.stopPropagation();
            });

            //退出登录
            $("#loginOut").on('click', function () {
                layer.confirm('确定退出登录？', function(index){
                    common.logout();
                    layer.close(index);
                });
            });
            $('.personal-setting a').on('click', function() {
                location.href = '../setting/setting.html';
            });

            $("#organizationList").on('click','.enter-org',function(){
                if($(this).attr('isBind')==1){
                    var orgNumber = $(this).data('number');
                    var orgName   = $(this).data('name');
                    var src = $(this).attr('src');
                    personal.init(orgNumber,orgName,src);
                }else if($(this).attr('isBind')==0){
                    return false;
                }
            })
        },
        /*
        * [平台管理列表]
        * */
        platformAccount:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.platfromManager;
            ajax.isNeedToken = true;
            ajax.data = {
                pageIndex:self.pageIndex,
                pageSize :self.pageSize,
                type: 3
            };
            ajax.success=function(result){
                $("#organizationList").html(_.template(organizationListTpl)(self._filter(result.datas)));
                self.pager(result.pageCount)
            };
            ajax.request();
        },
        /*
        * [数据处理]
        * @param {array} [description]
        * @return {array}[description]
        * */
        _filter:function(result){
            var array = [];
            _.each(result,function(data){
                var arr = data.deadLineValueText.split(',');//产品期限
                if(arr.length == 2){
                    data.deadLineText = $.trim(arr[0])+"<span>"+$.trim(arr[1])+"</span>";
                }else if(arr.length == 4){
                    data.deadLineText = $.trim(arr[0])+"<span>"+$.trim(arr[1])+"</span>~"+$.trim(arr[2])+"<span>"+$.trim(arr[3])+"</span>";
                }
                if(data.isBind == 1){
                    data.hasOpen = "block";
                    data.noOpen = "none";
                }else if(data.isBind == 0){
                    data.hasOpen = "none";
                    data.noOpen = "block";
                }
                array.push(data);
            });
            return array;
        },
        /*
        * [验证是否绑卡]
        * */
        isAuthenticate:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.personAuthenticate;
            ajax.back = true;
            ajax.isNeedToken = true;
            ajax.success = function(result){
                self.isBindCard = result.bundBankcard;
            };
            ajax.request();
        },
        /*
        * [绑定第三方平台]
        * @param {string} orgNumber 机构number
        * */
        bindThirdPlatform : function(orgNumber){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.bindOrgAcct;
            ajax.isNeedToken=true;
            ajax.data = {
                platFromNumber : orgNumber
            };
            ajax.success = function(data){
                layer.msg("开通成功");
                setTimeout(function(){
                    window.location.reload();
                },800)
            };
            ajax.request();
        },
        /*
         * [检查是否是第三方的老用户]
         * @param {string} orgNumber [机构number]
         * @param {string} name [机构name]
         */
        isThirdPlatfromOldAccount:function(orgNumber,name){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.isExistInPlatform;
            ajax.isNeedToken = true;
            ajax.async = false;
            ajax.data = {
                'platFromNumber': orgNumber
            };
            ajax.success = function(result) {
                if(result.isExist){
                    self.existAccountReminder(name);
                }else{
                    self.bindThirdPlatform(orgNumber)
                }
            };
            ajax.request();
        },
        /*
         * [绑卡提示]
         * @return [跳转到绑卡页面]
         * */
        bindCardReminder:function(){
            layer.open({
                type: 1,
                title: '银行卡绑定提示',
                shadeClose: true,
                skin: 'yourclass',
                area: ['600px', '345px'],
                content: '<div style=" position:relative;top:50%;height:50%;margin-top:-6%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;">是否绑定银行卡？</h2><span style="font-size:15px;color:#646464;">绑定银行卡后，跨平台购买产品、提现T呗奖励更加方便。</span></div>',
                btn: ['立即绑定'],
                yes :function(layer,index){
                    location.href = "/module/setting/setting.html";
                },
                success:function(layer,index){
                    $(layer).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
                }
            });
        },
        /**
         * 已经注册第三方的老用户提示
         * [existAccountReminder description]
         * @param {string} name [平台名称]
         * @return {null} [关闭弹窗]
         */
        existAccountReminder:function(name){
            var self = this;
            layer.open({
                type: 1,
                title: '温馨提示',
                shadeClose: true,
                skin: 'yourclass',
                area: ['600px', '345px'],
                content: '<div style="position: relative;top:50%;height:50%;margin-top:-8%;padding:0 30px;line-height:1.5em;color:#969696;text-align:center;"><h2 style="font-size:18px;color:#323232;margin-bottom:15px;font-weight:bold;">您已有'+name+'账号？</h2><span style="font-size:15px;color:#646464;">T呗奖励需要通过T呗开通的账户才能使用，建议您开通其他还未注册过的平台。</span></div>',
                btn: ['去开通其他平台'],
                yes :function(el,index){
                    layer.closeAll();
                },
                success:function(el,index){
                    $(el).find('.layui-layer-btn0').removeClass('layui-layer-btn0').addClass('layui-layer-btn1');
                }
            });
        },
        /*
         * 分页
         */
        pager:function(pageCount){
            var self = this;
            laypage({
                cont   : $("#pager"), //容器。值支持id名、原生dom对象，jquery对象,
                pages  : pageCount, //总页数
                skin   : 'toobei', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
                skip   : true, //是否开启跳页
                groups : 6, //连续显示分页数
                first  : 1,
                last   : pageCount,
                prev: '<', //若不显示，设置false即可
                next: '>', //若不显示，设置false即可
                curr   : self.pageIndex,
                jump   : function(obj, first){
                    if(first) return;
                    self.pageIndex = obj.curr;
                    self.platformAccount();
                    $("body,html").animate({scrollTop:0}, "normal");
                }
            });
        }
    };
    organization.init();
});
