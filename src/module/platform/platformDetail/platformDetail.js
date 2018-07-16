define(function(require, exports, module) {
    var Ajax    = require('/component/ajax/ajax');
    var api     = require('/config/api');
    var utils   = require('/util/utils')
    var common  = require('/module/common/common');
    var Swiper  = require('/component/swiper/swiper');
    var laypage = require('/component/pager/laypage');
    var layer   = require('/component/layer/layer')
    var buy     = require('/module/common/buy');
    var contentTpl = $("#contentTpl").html();
    var introduceTpl = $("#introduceTpl").html();
    var tpl = $('#listTpl').html();
    
    var platformDetail = {
        init: function() {
            this.pageIndex = 1;
            common.checkLoginStatus();
            this.orgNo = utils.getQueryString().orgNo;
            this.renderList();
            this.renderIntroduce();
            this.bindEvent();
        },

        bindEvent: function() {
            var self = this;
            $(".tab-head a").click(function(event) {
                $(this).parent().addClass('tab-active').siblings().removeClass('tab-active');
                $('.tab-change').hide();
                $(".tab-change").eq($(this).parent().index()).show(0,function(){    
                    if($(this).attr('id') === "avatar") self.teamSwiper();
                });
            });
            $("#listQueue").on('click','a.list-look',function(){
                var num  = $(this).data('number');
                var name = $(this).data('name');
                var id   = $(this).data('id');
                var logo  = $(this).data('logo');
                var isJoint = $(this).data('joint');
                buy.init(num,name,id,logo,isJoint);
            });
        },

        renderIntroduce: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.platfromDetail;
            ajax.isGoToLogin = false;
            ajax.data = { orgNo: self.orgNo };
            ajax.success = function(result) {
                $('.current-platform').text(result.orgName);
                $("#contentBox").empty();
                var dataTpl = self.introduceFilter(result);//处理之后的数据
                $("#introduceInfo").html(_.template(introduceTpl)(dataTpl));//导入
                if(result.orgActivityList && result.orgActivityList.length){
                    if(result.orgActivityList.length > 1)  self.activitySwiper();
                }else{
                    $(".act").hide();
                    $(".safe").css('paddingTop',"67px")
                }
                $("#contentBox").html(_.template(contentTpl)(dataTpl));//导入模板
                $("#contentBox").add('.tab').show();
                if (result.teamInfos.length) {
                    if (result.teamInfos.length > 4) {
                        $(".avatar .arrow").show();
                    } else {
                        $(".avatar .arrow").hide();
                    }
                } else {
                    $("#avatar").html(utils.noDataTpl('亲,暂时没有相关介绍哦~'));
                }
                if(!result.orgWebsiteRecords)  $("#webRecord").html(utils.noDataTpl('亲,暂时没有相关资料哦~'));
                if(!result.orgContactDetails)  $("#contactWay").html(utils.noDataTpl('亲,暂时没有相关资料哦~'));
                if(!result.orgEnvironmentList.length && !result.orgHonorList.length && !result.orgPapersList.length) $("#companyPic").html(utils.noDataTpl('亲,暂时没有相关图片哦~')).css('padding',"30px 40px");
                self.teamSwiper();//团队介绍swiper
                // if(result.orgRiskList &&result.orgRiskList.length)  self.chart(result.orgRiskList);
                if(result.orgEnvironmentList && !result.orgEnvironmentList.length)  $(".environment-pic").html(utils.noDataTpl('亲,暂时没有相关图片哦~'));
                if(result.orgHonorList && !result.orgHonorList.length)  $(".honor-pic").html(utils.noDataTpl('亲,暂时没有相关图片哦~'));
                if(result.orgPapersList && !result.orgPapersList.length)  $(".papers-pic").html(utils.noDataTpl('亲,暂时没有相关图片哦~'));
                self.introduceEvent();//事件函数
                layer.photos({
                  photos: '#picWrapper',
                  shift: 5
                }); 
            };
            ajax.request();
        },
        //活动 swiper
        activitySwiper : function(){
            var swiper = new Swiper('.swiper-container', {
                pagination : '.pagination',
                paginationClickable: true,
                centeredSlides: true,
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                loop: true
            });
        },
        //团队介绍 swiper
        teamSwiper : function(){
            var self = this;
            var mySwiper = new Swiper('.swiper-avatar', {
                slidesPerView: 4,
                paginationClickable: true,
                freeMode: true,
            });
            //最后一个边框为0
            $(".swiper-slide-visible").children().css('borderRight','1px solid #dcdcdc');
            $(".swiper-slide-visible").last().children().css('border','0');
            $(".avatar .arrow").click(function(e) {
                if ($(this).hasClass('move-left')) {
                    mySwiper.swipePrev();
                } else if ($(this).hasClass('move-right')) {
                    mySwiper.swipeNext();
                }
                //最后一个边框为0
                $(".swiper-slide-visible").children().css('borderRight','1px solid #dcdcdc');
                $(".swiper-slide-visible").last().children().css('border','0');
                self.introEvent();
            });
            self.introEvent();
        },
        introEvent:function(){
            $(".avatar-intro").off("mouseenter").on('mouseenter',function(event){
                event.stopPropagation();
                if($(this).text().length != $(this).next().text().length){
                    $(".describe-detail").show().css({
                        left:$(this).offset().left-$(".swiper-avatar").offset().left+60+"px",
                        top:"396px"
                    }).text($(this).next().text());
                }else{
                    $(".describe-detail").hide();
                }
            })
            $(".swiper-slide-visible").eq(3).find('.avatar-intro').on('mouseenter',function(event){
                $(".describe-detail").css({
                    left:"auto",
                    right:"60px",
                });
            });
            $(".avatar").on('mouseleave',function(){
                $(".describe-detail").hide();
            });
        },
        chart : function(orgRiskList){
            var indicatorNameArr = [];
            var indicatorScoreArr= [];
            _.each(orgRiskList,function(item){
                indicatorNameArr.push({name:item.indicatorName,max:100});
                indicatorScoreArr.push(item.indicatorScore)
            });
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('myCanvas'));
            // 指定图表的配置项和数据
           option = {
                tooltip: {trigger: 'item',show:false,confine:true},
                title: {show:false},
                legend: {show:false},
                radar: {indicator: indicatorNameArr,nameGap:5},
                series: [{
                   name: '分数:',
                   type: 'radar',
                   data : [{value :indicatorScoreArr,}],
                   itemStyle: {normal: {color: 'rgba(18,183,245,1)'}},
                   areaStyle: {normal: {opacity: 0.5}}
                }],
                color:["rgba(18,183,245,1)"],
                textStyle:{color:"#969696"},
            };
            myChart.setOption(option);// 使用刚指定的配置项和数据显示图表。

        },
        introduceEvent:function(){
            $(".pic-tab").on('click','li',function(){
                if($(this).hasClass('active')) return;
                $(".pic-tab").children('li').removeClass('active');
                $(this).addClass('active');
                $(".pic-wrapper").children('div').hide().eq($(this).index()).show();
            });
            $(".more").on('click',function(){
                $(this).toggleClass('down').prev().toggleClass('heightAuto');
            });
        },
        //机构介绍数据处理
        introduceFilter: function(result) {
            if(result.orgTag){
                var orgTagArr =result.orgTag.split(',');
                orgTagArr = _.without(orgTagArr,"");
              result.orgTag =_.map(orgTagArr,function(item,index) {
                if(index<3){
                  return '<li>' + item.substr(0,6) + '</li>';
                }
              }).join('');  
            }
            // result.orgActivityList=[{activityImg:'a69bd6ee35c6045037eca58772d433a0'},{activityImg:'a69bd6ee35c6045037eca58772d433a0'},{activityImg:'a69bd6ee35c6045037eca58772d433a0'}];
            //年化收益
            result.yearRate = result.isFlow == "1" ? result.feeRateMin : result.feeRateMin + '~' + result.feeRateMax;
            //产品期限
            var deadLineArr = result.deadLineValueText.split(',');
            if (deadLineArr.length == 2) { //固定期限
                result.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>';
            } else if (deadLineArr.length == 4) { //浮动期限
                result.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>~' + deadLineArr[2] + '<span>' + deadLineArr[3] + '</span>';
            }
            _.each(result.teamInfos,function(item){
                item.orgDescribeShort = item.orgDescribe.length >115 ? item.orgDescribe.substr(0,115)+"..." : item.orgDescribe;
            });
            result.environmentMore = result.orgEnvironmentList.length>4 ? "block" : "none";
            result.honorMore = result.orgHonorList.length>4 ? "block" : "none";
            result.pagerMore = result.orgPapersList.length>4 ? "block" : "none";
            return result;
        },
        
        // 平台在售产品
        renderList: function() {
            var _this = this;
            var ajax = new Ajax();
            ajax.url = api.productPageList;
            ajax.isLoadMask = false;
            ajax.data = {
                orgCode: _this.orgNo,
                pageSize: 5,
                pageIndex: _this.pageIndex,
                sort: 1,
                order: 1
            };
            ajax.success = function(response) {
                var datas = _this.listFilter(response);
                if (response.datas && response.datas.length > 0) {
                    $("#listQueue").html(_.template(tpl)(datas));
                    _this.pager(response.pageCount);//分页
                    if (response.totalCount > 6)  $("#pager").show();//总数大于6显示分页
                } else {
                    $("#productList").html(utils.noDataTpl('亲,暂时没有符合条件的产品哦~'))
                }
                $("#productList").add(".onSaleText").show();
                $(".site-list li:last").css('borderBottom',"0");//最后一个li下边框为0
            }
            ajax.request();
        },

        /*
         * 对列表数据的处理
         * result : 接口返回的数据
         */
        listFilter: function(result) {
            var array = [];
            _.each(result.datas, function(data, index) {
                //自定义标签
                data.tagListStr = _.map(data.tagList, function(item) {
                    return "<span>" + item + "</span>";
                }).join("\n");
                data.remainingBalance = Math.round((data.buyTotalMoney - data.buyedTotalMoney) * 100) / 100; //剩余额度:总金额减去已购买金额
                //选取金额限制(orgAmountLimit)和剩余金额(remainingBalance)中数值小的(在非空的情况下 如果为空 则取另外一个)
                if (data.remainingBalance && (!data.orgAmountLimit)) { //限购金额为空 ==> 剩余额度
                    data.saleAmout = utils.formatAmount(data.remainingBalance)+"元";
                } else if (data.orgAmountLimit && (!data.remainingBalance)) { //剩余额度为空 ==> 限购金额
                    data.saleAmout = utils.formatAmount(data.orgAmountLimit)+"元";
                } else if (!(data.remainingBalance || data.orgAmountLimit)) { //全部为空
                    data.saleAmout = "不限";
                } else if (data.remainingBalance > data.orgAmountLimit * 1) { //都不为空 且 剩余额度 > 限购金额 ==> 限购金额
                    data.saleAmout = utils.formatAmount(data.orgAmountLimit)+"元";
                } else if (data.remainingBalance <= data.orgAmountLimit * 1) { //都不为空 且 剩余额度 < 限购金额 ==> 剩余额度
                    data.saleAmout = utils.formatAmount(data.remainingBalance)+"元";
                }
                // 安全等级
                if (!data.grade)  data.grade = 7;
                //年化收益
                data.yearRate = (data.isFlow == "1" ? data.flowMinRate.toFixed(2) : data.flowMinRate.toFixed(2) + '~' + data.flowMaxRate.toFixed(2));
                //产品期限
                var deadLineArr = data.deadLineValueText.split(',');
                //固定期限
                if (deadLineArr.length === 2)  data.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>';
                //浮动期限
                if (deadLineArr.length === 4)  data.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>~' + deadLineArr[2] + '<span>' + deadLineArr[3] + '</span>';
                //产品进度
                data.progressClass = ""; /*进度条,百分比(隐藏||显示)*/
                if (data.isHaveProgress === 0) {
                    data.progressClass = "block";
                    if (data.buyTotalMoney - data.buyedTotalMoney < 0) {
                        data.percentage = 100 + '%';
                    } else {
                        data.buyedTotalMoney = data.buyedTotalMoney || 0;
                        data.buyTotalMoney = data.buyTotalMoney || 1;
                        data.percentage = parseInt(data.buyedTotalMoney / data.buyTotalMoney * 100) + "%";
                    }
                } else {
                    data.progressClass = "none";
                }
                /*
                * 0 移动端和PC端 
                * 1 移动端
                * 2 PC端
                */
                //PC端未对接产品不可以购买 
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
                // data.saleStartTime = "2016-11-14 16:54:10";
                array.push(data);
            });
            return array;
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
                    self.renderList();
                    $("body,html").animate({scrollTop:0}, "normal");
                }
            }); 
        }
    }
    platformDetail.init();
})
