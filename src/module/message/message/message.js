define(function (require,exports,module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var utils = require('/util/utils');
    var common = require('/module/common/common');
    var laypage = require('/component/pager/laypage');
    var layer = require('/component/layer/layer');
    //消息列表模板
    var messageListTemp = $("#messageListTemp").html();
    var message = {
        init:function(){
            this.pageIndex = 1;
            this.unreadCount = "";
            common.checkLoginStatus();
            this.getMessage();
            this.getUnreadCount();
            this.bindEvent();
        },
        bindEvent:function(){
            var self = this;

            //单个设置成已读
            $("#messageList").on('click','li',function(){
                if($(this).hasClass('un-read')){
                    self.setHasRead($(this).data('id'));
                    $(this).removeClass('un-read');
                }
            });

            //全部设置为已读
            $("#setAllRead").on('click',function(){
                if(self.unreadCount == 0) return;
                self.setAllHasRead();
            });

            //退出登录
            $("#loginOut").on('click',function(){
                layer.confirm('确定退出登录？', function(index){                 common.logout();                 layer.close(index);             });
            });
            $('.personal-setting a').on('click', function() {
                location.href = '../setting/setting.html';
            });
        },
        /*
        * [消息数据获取]
        *
        */
        getMessage: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.personList;
            ajax.data={
                pageIndex:self.pageIndex
            };
            ajax.isNeedToken = true;
            ajax.success = function (result) {
                if( result.datas.length === 0 ) {
                    $("#messageList").html(utils.noDataTpl("暂无消息通知",true));
                }else{
                    $("#messageList").html(_.template(messageListTemp)(self.messageFilter(result.datas)));
                    self.pager(result.pageCount);
                }
            };
            ajax.request();
        },
        /*
        * [消息数据处理]
        * @param {array => object} result [需要处理的数据]
        * @return {array => object} 处理过后的数据
        * */
        messageFilter:function(result){
            var array = [];
            _.each(result, function (data) {
                if(!data.typeName){
                    data.typeName = "其他";
                }
                if(data.read == 1){
                    data.readStatus = "";
                }else if(data.read == 0){
                    data.readStatus = "un-read"
                }
                if(data.linkUrlKey === "myCfp_platform"){
                    data.linkUrl="/module/planner/planner.html?type=2";
                }else if(data.linkUrlKey === 'myCfp_product'){
                    data.linkUrl = '/module/planner/planner.html?type=1';
                }
                array.push(data);
            });
            return array;
        },
        /*
        * [获取未读消息数目]
        * */
        getUnreadCount:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.unreadCount;
            ajax.isNeedToken = true;
            ajax.success = function(result){
                self.unreadCount = result.personMsgCount;
                if(result.personMsgCount >99){
                    result.personMsgCount = "99+";
                }
                $('.message-all-count').text(result.personMsgCount);
            };
            ajax.request();
        },
        /*
        * [消息设置为已读]
        * */
        setHasRead:function(msgIds){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.readed;
            ajax.isNeedToken = true;
            ajax.data={
                msgIds:msgIds
            };
            ajax.success=function(result){
                self.getUnreadCount();
            };
            ajax.request();
        },
        /*
        * [消息全部设置为已读]
        * */
        setAllHasRead:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.allReaded;
            ajax.isNeedToken = true;
            ajax.success=function(result){
                $("#messageList li").removeClass('un-read');
                self.getUnreadCount();
            };
            ajax.request();
        },
        /*
        * [分页]
        * */
        pager:function(pageCount){
            var self = this;
            laypage({
                cont:$("#pager"),
                pages:pageCount,
                skin:'toobei',
                skip:true,
                groups:6,
                first:1,
                last:pageCount,
                prev:"<",
                next:">",
                curr:self.pageIndex,
                jump:function(obj,first){
                    if(first) return;
                    self.pageIndex = obj.curr;
                    self.getMessage();
                    $('body,html').animate({scrollTop:0},'normal');
                }
            })
        }

    };
    message.init();
})