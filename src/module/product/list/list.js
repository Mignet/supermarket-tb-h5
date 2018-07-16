define(function(require, exports, module) {
    var Ajax  = require('/component/ajax/ajax');
    var api   = require('/config/api');
    var utils = require('/util/utils');
    var laypage  = require('/component/pager/laypage');
    var common   = require('/module/common/common');
    var buy     = require('/module/common/buy');
    var listTpl = $("#listTpl").html();
    var Countdown = require('/component/countdown/countdown');
    var productList = {
    	init:function(){
            common.checkLoginStatus();
            this.pageIndex = 1;
            this.pageSize = 8;
            this.profit ="";
            this.deadline = "";
            this.platfrom="";
            this.orgLevel = "";
            this.sort = 1;
            this.order = 1;
            this.renderSelect();
            this.initEvents();
        },

        initEvents : function(){  
            var self = this;    
            $("#filterBox").on('click','.launchPack',function(){
                var $this = $(this);
                if($this.hasClass('launch')){
                    $this.parent().css('height','auto');
                    $this.text('收起').removeClass('launch').addClass('pack');
                }else{
                    $this.parent().css('height','46px');
                    $this.text('展开').removeClass('pack').addClass('launch');         
                }                
            });
            $("#filterBox").on('click','a[data-value]',function(){
                var parent = $(this).closest('.filter-list-box');
                parent.find('a[data-value]').removeClass('active');
                $(this).addClass('active');    
                var id = parent.find('.filter-list').attr('id'); 
                var dataValue = $(this).data('value');
                switch(id){
                    case "orgLevel":  self.orgLevel = dataValue; break;
                    case "deadline":  self.deadline = dataValue; break;
                    case "platfrom":  self.platfrom = dataValue; break;
                    case "profit"  :  self.profit   = dataValue;
                }
                self.renderSelect();//筛选条件重新渲染
            });            


            $("#listQueue").on('click','a.list-look',function(){
                var num  = $(this).data('number');
                var name = $(this).data('name');
                var id   = $(this).data('id');
                var logo = $(this).data('logo');
                var isJoint = $(this).data('joint');//判断是否对接
                buy.init(num,name,id,logo,isJoint);
            })            
        },

        /*
        * 筛选条件
        */
        renderSelect:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.isLoadMask  = false;
            ajax.url = api.productHead;
            ajax.data={securityLevel:self.orgLevel};
            ajax.success = function(result){
                var platfromValueArr = [];
                self.pageIndex = 1;//重置页面 索引为1
                $(".filter-list").empty();
                _.each(result,function(value,key){
                    _.each(value,function(element, index) {
                        element.value = _.escape(element.value);//转义HTML字符串 替换 >
                        if(_.unescape(element.value) === self.orgLevel || element.value === self.profit || element.value === self.deadline || element.value === self.platfrom){
                        $("#"+key).append("<li><a class='ellipsis active' data-value="+element.value+">"+element.key+"</a></li>");//插入标签
                        }else{
                        $("#"+key).append("<li><a class='ellipsis' data-value="+element.value+">"+element.key+"</a></li>");//插入标签
                        }
                        if(key === "platfrom") platfromValueArr.push(element.value);
                    });
                });
                if($.inArray(self.platfrom,platfromValueArr) === -1){//当某一级别下,平台不存在的情况下,平台默认回到全部
                    $("#platfrom").prev().children('a').addClass('active');
                    self.platfrom ="";//平台不筛选
                }
                result.platfrom.length > 7 ? $(".launchPack").show() : $(".launchPack").hide();//当平台数大于7的时候,显示展开按钮
                self.renderScreenPageList();
            };
            ajax.request();
        },

        /*
        * 列表
        */
        renderScreenPageList:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.screenPageList;
            ajax.data = {
                pageSize        :       self.pageSize,
                pageIndex       :       self.pageIndex,
                sort            :       self.sort,
                order           :       self.order,
                productDeadLine :       self.deadline,
                platform        :       self.platfrom,
                yearProfit      :       self.profit,
                securityLevel   :       self.orgLevel
            };
            ajax.success=function(result){
                $("#listQueue").add("#pager").empty();//清空
                $(".site-content").addClass('minHeight');//加载之前添加最小高度
                if(result.datas && result.datas.length){
                    var tplData = self.listFilter(result);//数据处理后的模板
                    $("#listQueue").html(_.template(listTpl)(tplData));
                    $("#listQueue li").last().addClass('last');//去除最后一个底边边框
                    self.countDownHandle(result.datas);//倒计时
                    $("#pager").show();//分页
                    self.pager(result.pageCount);
                }else{
                    $("#listQueue").html(utils.noDataTpl("亲，暂时没有符合条件的产品哦~"),false);
                    $("#pager").hide();//分页
                }
                $(".site-content").removeClass('minHeight');//加载之后移除最小高度
                $("#filterList").add("#productList").show();
            };
            ajax.request();
        },

        /*
        * 对列表数据的处理
        * result : 接口返回的数据
        */
        listFilter:function(result){
            var array = [];
            _.each(result.datas,function(data,index){
                data.tagListStr = _.map(data.tagList,function(item){//自定义标签
                    return "<span>"+item+"</span>";
                }).join("\n");
                data.remainingBalance = Math.round((data.buyTotalMoney-data.buyedTotalMoney)*100)/100;//剩余额度:总金额 - 已购买金额
                //选取金额限制(orgAmountLimit)和剩余金额(remainingBalance)中数值小的(在非空的情况下 如果为空 则取另外一个)
                if(data.remainingBalance && (!data.orgAmountLimit)){//限购金额为空 ==> 剩余额度
                    data.saleAmout = utils.formatAmount(data.remainingBalance)+"元";
                }else if(data.orgAmountLimit && (!data.remainingBalance)){//剩余额度为空 ==> 限购金额
                    data.saleAmout = utils.formatAmount(data.orgAmountLimit)+"元";
                }else if(!(data.remainingBalance || data.orgAmountLimit)){//全部为空
                    data.saleAmout = "不限";
                }else if(data.remainingBalance > data.orgAmountLimit * 1){//都不为空 且 剩余额度 > 限购金额 ==> 限购金额
                    data.saleAmout = utils.formatAmount(data.orgAmountLimit)+"元";
                }else if(data.remainingBalance <= data.orgAmountLimit * 1){//都不为空 且 剩余额度 < 限购金额 ==> 剩余额度
                    data.saleAmout = utils.formatAmount(data.remainingBalance)+"元";
                }
                // 安全等级
                if(!data.grade){   data.grade = 7; }//在没有级别的时候,显示暂无
                //年化收益
                data.yearRate = (data.isFlow == "1" ? data.flowMinRate.toFixed(2) : data.flowMinRate.toFixed(2) + '~' + data.flowMaxRate.toFixed(2));
                //产品期限
                var deadLineArr = data.deadLineValueText.split(',');
                //固定期限
                if (deadLineArr.length === 2) {
                    data.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>';
                }else if (deadLineArr.length === 4) {//浮动期限
                    data.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>~' + deadLineArr[2] + '<span>' + deadLineArr[3] + '</span>';
                }
                //产品进度
                data.progressClass = "";/*进度条,百分比(隐藏||显示)*/
                if(data.isHaveProgress === 0){
                    data.progressClass = "block";
                    if (data.buyTotalMoney - data.buyedTotalMoney < 0) {
                        data.percentage = 100 + '%';
                    } else {
                        data.buyedTotalMoney = data.buyedTotalMoney || 0;
                        data.buyTotalMoney = data.buyTotalMoney || 1;
                        data.percentage = parseInt(data.buyedTotalMoney / data.buyTotalMoney * 100) + "%";
                    }
                }else{
                    data.progressClass = "none";
                }
                //合作机构未对接PC
                if( data.orgJointType == 1 ) {
                    data.orgIsstaticproduct = 1;
                }
                //倒计时测试数据
                 // data.saleStartTime = "2017-1-22 12:50:10";
                array.push(data);
            });
            return array;
        },
        /*
        * 倒计时
        * result:array
        */
        countDownHandle:function(result){
            _.each(result,function(data,index){
                if(data.saleStartTime && Date.now() < new Date(data.saleStartTime.replace(/-/g, '/')).getTime()){
                    var $text = $(".count-down").eq(index)
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
                    self.renderScreenPageList();
                    $("body,html").animate({scrollTop:0}, "normal");
                }
            }); 
        }
    };
    productList.init();
});

