define(function(require, exports, module) {
    var Ajax  = require('/component/ajax/ajax');
    var api   = require('/config/api');
    var utils = require('/util/utils');
    var laypage  = require('/component/pager/laypage');
    var Countdown = require('/component/countdown/countdown');
    var common   = require('/module/common/common');
    var buy     = require('/module/common/buy');
    var listTpl = $("#listTpl").html();
    var productList = {
        init:function(){
            common.checkLoginStatus();
            this.cateId = utils.getQueryString().cateId;
            this.order = 1;
            this.pageIndex = 1;
            this.pageSize = 10;
            this.sort = 1;
            this.renderList();
            this.renderSelect();
            this.bindEvent();
        },
        
        bindEvent:function(){
            var self = this;
            $("#selectTab").on('click','li',function(){
                if($(this).hasClass('active')) return;
                $("#selectTab li").removeClass('active');
                $(this).addClass('active');
                $("#pager").hide();//分页隐藏
                self.cateId = $(this).data('cateId');
                self.pageIndex = 1;
                self.sort = 1;
                self.order = 1;
                $("#tabSort li").removeClass('active').eq(0).addClass('active');
                $("#tabSort li").find('span.default').removeClass('sort-down sort-up');
                self.renderList();
            });

            $("#tabSort").on("click","li",function(){
                $("#tabSort li").removeClass('active');
                $(this).addClass('active');
                var span = $(this).find('span.default');
                if(span.hasClass('sort-up')){
                    span.removeClass('sort-up').addClass('sort-down');
                    self.order = 0;
                    self.sort = $(this).data('value');
                }else{
                    span.removeClass('sort-down').addClass('sort-up');
                    self.order = 1;
                    self.sort = $(this).data('value');
                };
                if (self.sort == "1") {
                    self.order = 1;
                };
                self.pageIndex = 1;
                self.renderList();
            });

            $("#listQueue").on('click','a.list-look',function(){
                var num  = $(this).data('number');
                var name = $(this).data('name');
                var id   = $(this).data('id');
                var logo = $(this).data('logo');
                var isJoint = $(this).data('joint');
                buy.init(num,name,id,logo,isJoint);
            })

        },

        renderSelect:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.isLoadMask = false;
            ajax.isNeedToken = true;
            ajax.url = api.productClassifyStatistics;
            ajax.success = function(result){
                var selectTpl = $("#selectTpl").html();//模板导入
                $("#selectTab").html(_.template(selectTpl)(result.datas));
                //第一个和最后一个添加不同的样式
                $("#selectTab li:first p").addClass('first');
                $("#selectTab li:last p").addClass('last');
                $("#selectTab li").each(function(){
                    if($(this).attr('data-cate-id') == self.cateId){
                        $(this).addClass('active');
                    };
                });
            };
            ajax.request();
        },

        renderList:function(){
            var self  = this;
            $(".site-content").addClass('minHeight');
            var ajax = new Ajax();
            ajax.isLoadMask = true;
            ajax.isNeedToken = true;
            ajax.url=api.productClassifyList;
            ajax.data={
                cateId:    self.cateId,
                order:     self.order,
                sort:      self.sort,
                pageIndex: self.pageIndex,
                pageSize:  self.pageSize
            };
            ajax.success = function(result){
                $("#listQueue").add("#pager").empty();//清空
                var noDataTpl = '<li class="no-data-tpl"><p>亲，暂时没有符合条件的产品哦~</p></li>';//无数据模板
                if(result.datas.length){
                    var tplData = self.listFilter(result);
                    $("#listQueue").html(_.template(listTpl)(tplData));
                    $("#listQueue li").last().addClass('last');//去除最后一个底边边框
                    self.countDownHandle(result.datas);//倒计时
                    $("#pager").show();//分页
                    self.pager(result.pageCount);
                }else{
                    $("#listQueue").html(noDataTpl);//无数据模板
                }
                $("#mainContent").show();//加载完显示
                $(".site-content").removeClass('minHeight');//加载完后移除最小高度,避免数据过小,高度过高
            };
            ajax.request();
        },
        /*
        * 倒计时
        * result:array
        */
        countDownHandle:function(result){
           _.each(result,function(data,index){
              if(data.saleStartTime && Date.now() < new Date(data.saleStartTime.replace(/-/g, '/')).getTime()){
                var $text = $(".count-down").eq(index);
                new Countdown({
                    saleTimeStr:data.saleStartTime,
                    nowTimeStr :data.timeNow,
                    ele        :$text,
                    callback   : function () {
                    }
                })
              }
          });
        },
        /*
        * 对列表数据的处理
        * result : 接口返回的数据
        */
        listFilter:function(result){
            var array = [];
            var grade = {'1':'B','2':'BB','3':'BBB','4':'A','5':'AA','6':'AAA','':'暂无'};
            _.forEach(result.datas,function(data,index){
                //自定义标签
                data.tagListStr = _.map(data.tagList,function(item){
                    return "<span>"+item+"</span>"
                }).join("\n");
                data.remainingBalance = Math.round((data.buyTotalMoney-data.buyedTotalMoney)*100)/100;//剩余额度:总金额 - 已购买金额
                //选取金额限制(orgAmountLimit)和剩余金额(remainingBalance)中数值小的(在非空的情况下 如果为空 则取另外一个)
                if(data.remainingBalance && (!data.orgAmountLimit)){//限购金额为空 ==> 剩余额度
                    data.saleAmout = utils.formatAmount(data.remainingBalance);
                }else if(data.orgAmountLimit && (!data.remainingBalance)){//剩余额度为空 ==> 限购金额
                    data.saleAmout = utils.formatAmount(data.orgAmountLimit);
                }else if(!(data.remainingBalance || data.orgAmountLimit)){//全部为空
                    data.saleAmout = "不限";
                }else if(data.remainingBalance > data.orgAmountLimit * 1){//都不为空 且 剩余额度 > 限购金额 ==> 限购金额
                    data.saleAmout = utils.formatAmount(data.orgAmountLimit);
                }else if(data.remainingBalance <= data.orgAmountLimit * 1){//都不为空 且 剩余额度 < 限购金额 ==> 剩余额度
                    data.saleAmout = utils.formatAmount(data.remainingBalance);
                }
                // 安全等级
                if(data.grade == ''){
                    data.grade = 7;
                }
                //年化收益
                if (data.isFlow == "1") {
                    data.yearRate = data.flowMinRate.toFixed(2)
                } else {
                    data.yearRate = data.flowMinRate.toFixed(2) + '~' + data.flowMaxRate.toFixed(2);
                }
                //产品期限
                var deadLineArr = data.deadLineValueText.split(',');
                //固定期限
                if (deadLineArr.length == 2) {
                    data.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>';
                }
                //浮动期限
                if (deadLineArr.length == 4) {
                    data.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>~' + deadLineArr[2] + '<span>' + deadLineArr[3] + '</span>';
                }
                //产品进度
                data.progressClass = "";/*进度条,百分比(隐藏||显示)*/
                if(data.isHaveProgress == 0){
                    data.progressClass = "block";
                    if (data.buyTotalMoney - data.buyedTotalMoney < 0) {
                        data.percentage = 100 + '%';
                    } else {
                        data.buyedTotalMoney = data.buyedTotalMoney || 0;
                        data.buyTotalMoney = data.buyTotalMoney || 1;
                        data.percentage = parseInt(data.buyedTotalMoney / data.buyTotalMoney * 100) + "%";
                    }
                }else{
                    data.progressClass = "hidden";
                }
                /*
                * 0 移动端和PC端 
                * 1 移动端
                * 2 PC端
                * PC端未对接产品不可以购买 
                */
                if(data.hasOwnProperty("orgJointType")){
                    if(data.orgJointType == 2 || data.orgJointType == 0){
                        data.isJoint = true;
                    }else{
                        data.isJoint = false;
                    }
                }else{
                    data.isJoint = false;
                }
                //倒计时测试数据
                data.saleStartTime = "2018-11-11 16:11:00";
                array.push(data);
            })
            return array;
        },
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
                    self.renderList();
                    $("body,html").animate({scrollTop:0}, "normal");
                }
            }); 
        }
    }
    productList.init();
});