define(function(require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var utils = require('/util/utils');
    var common = require('/module/common/common');
    var laypage = require('/component/pager/laypage');
    var layer = require('/component/layer/layer');
    var buy = require('/module/common/buy');
    var Countdown = require('/component/countdown/countdown');
    var productTpl = $("#productTpl").html();
    var orgTpl = $("#orgTpl").html();
    var planner = {
        init: function() {
            this.pageIndex = 1;
            this.pageSize = 10;
            this.type = utils.getQueryString().type || 1;
            common.checkLoginStatus();
            this.initEvent();
            this.myPlanner();
            this.plannerRecommandProduct();
        },

        initEvent: function() {
            var self = this;
            $('.tab').on('click', 'a', function() {
                if ($(this).hasClass('active')) return;
                $(this).addClass('active').siblings().removeClass('active');
                if ($(this).data('value') == 1) {
                    $(".content-org").hide();
                    $(".content-product").show();
                    $(".content-page").addClass('none');
                    self.plannerRecommandProduct();
                } else {
                    $(".content-product").hide();
                    $(".content-org").show();
                    $(".content-page").addClass('none');
                    self.plannerRecommandOrg();
                }
            });

            if (this.type == 1) {
                $(".tab a").eq(0).addClass('active').siblings('a').removeClass('active');
                $(".content-org").hide();
                $(".content-product").show();
                $(".content-page").addClass('none');
                self.plannerRecommandProduct();
            } else if (this.type == 2) {
                $(".tab a").eq(1).addClass('active').siblings('a').removeClass('active');
                $(".content-product").hide();
                $(".content-org").show();
                $(".content-page").addClass('none');
                self.plannerRecommandOrg();
            }

            $(".hotplatorm-info").on('click', '.skip-org-detail', function() {
                if ($(this).data('href')) {
                    window.location.href = $(this).data('href');
                }
            })

            //退出登录
            $("#loginOut").on('click', function() {
                layer.confirm('确定退出登录？', function(index) { common.logout();
                    layer.close(index); });
            });
            $('.personal-setting a').on('click', function() {
                location.href = '../setting/setting.html';
            });

            $(".content-product").on('click', '.btn-wrapper', function() {
                var orgIsstaticproduct = $(this).attr('data-orgIsstaticproduct');
                var orgJointType = $(this).attr('data-orgJointType');
                var isVirtual = true;
                if(orgIsstaticproduct == "0" && (orgJointType == "0" || orgJointType == "2")){
                    isVirtual = false;     
                }               
                var num = $(this).data('number');
                var name = $(this).data('name');
                var id = $(this).data('productid');
                var logo = $(this).data('logo');
                buy.init(num, name, id, logo,isVirtual);    
            })


        },

        /**
         * 理财师信息
         * [myFinancialPlanner description]
         * @return {[type]} [description]
         */
        myPlanner: function() {
            var _this = this;
            var ajax = new Ajax();
            ajax.url = api.minePlanner;
            ajax.success = function(result) {
                if (result.headImage) {
                    $("#planner-headerLogo").attr(config.imageUrl + result.headImage + '?f=png');
                }
                $("#plannerName").text(result.userName);
                $("#plannerMobile").text(result.mobile);
                $("#plannerLevel").addClass('planner-level-' + result.cfpLevel);
                $("#plannerLevelName").text(result.cfpLevelName)
            };
            ajax.request();
        },

        /**
         * 理财师推荐产品
         * [recdProductPageList description]
         * @return {[type]} [description]
         */
        plannerRecommandProduct: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.recdProductPageList;
            ajax.data = {
                cateId: '801',
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            ajax.success = function(result) {
                if (result.pageCount == 0) {
                    $("#recommendProductList").html('<li class="no-data"><p>亲，暂时没有理财师推荐产品哦~</p></li>');
                } else {
                    var data = self.listFilter(result);
                    $("#recommendProductList").empty().html(_.template(productTpl)(data));
                    self.countDownHandle(result.datas); //倒计时
                    if (result.pageCount > 1) {
                        $(".content-page").removeClass('none');
                        self.pager(result.pageCount, 'plannerRecommandProduct');
                    }
                }
            };
            ajax.request();
        },
        /*
         * 倒计时
         * result:array
         */
        countDownHandle: function(result) {
            _.each(result, function(data, index) {
                if (data.saleStartTime && Date.now() < new Date(data.saleStartTime.replace(/-/g, '/')).getTime()) {
                    var $text = $(".count-down").eq(index);
                    new Countdown({
                        saleTimeStr: data.saleStartTime,
                        nowTimeStr: data.timeNow,
                        ele: $text
                    })
                }
            });
        },

        /**
         * 理财师推荐平台
         * [plannerRecommandOrg description]
         * @return {[type]} [description]
         */
        plannerRecommandOrg: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.plannerRecommendPlatfrom;
            ajax.data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            ajax.success = function(result) {
                if (result.pageCount == 0) {
                    $("#recommendOrgList").html('<li class="no-data"><p>亲，暂时没有理财师推荐平台哦~</p></li>');
                } else {
                    $("#recommendOrgList").empty().html(_.template(orgTpl)(result.datas));
                    if (result.pageCount > 1) {
                        $(".content-page").removeClass('none');
                        self.pager(result.pageCount, 'plannerRecommandOrg');
                    }
                }
            };
            ajax.request();
        },

        /*
         * 对列表数据的处理
         * result : 接口返回的数据
         */
        listFilter: function(result) {
            var array = [];
            var grade = { '1': 'B', '2': 'BB', '3': 'BBB', '4': 'A', '5': 'AA', '6': 'AAA', '': '暂无' };
            _.each(result.datas, function(data, index) {
                //自定义标签
                data.tagListStr = _.map(data.tagList, function(item) {
                    return "<span>" + item + "</span>"
                }).join("\n");

                data.remainingBalance = Math.round((data.buyTotalMoney - data.buyedTotalMoney) * 100) / 100; //可购买金额:总金额减去已购买金额
                //选取单笔购买限购金额(有限购)(orgAmountLimit)和剩余金额(remainingBalance)中数值小的 
                if ((data.remainingBalance > data.orgAmountLimit * 1) && (data.orgAmountLimit != "")) {
                    data.saleAmout = utils.formatAmount(data.orgAmountLimit);
                } else {
                    data.saleAmout = utils.formatAmount(data.remainingBalance);
                }
                // 安全等级
                data.gradeText = grade[data.grade];
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
                data.progressClass = ""; /*进度条,百分比(隐藏||显示)*/
                if (data.isHaveProgress == 0) {
                    data.progressClass = "block";
                    if (data.buyTotalMoney - data.buyedTotalMoney < 0) {
                        data.percentage = 100 + '%';
                    } else {
                        data.buyedTotalMoney = data.buyedTotalMoney || 0;
                        data.buyTotalMoney = data.buyTotalMoney || 1;
                        data.percentage = parseInt(data.buyedTotalMoney / data.buyTotalMoney * 100) + "%";
                    }
                } else {
                    data.progressClass = "hidden";
                }
                //倒计时测试数据
                // data.saleStartTime = "2017-1-22 16:11:00";
                array.push(data);
            });
            return array;
        },

        /**
         * 分页组件
         * @param  {[type]} pageCount [description]
         * @param  {[type]} fun       [description]
         * @return {[type]}           [description]
         */
        pager: function(pageCount, fun) {
            var self = this;
            laypage({
                cont: $(".content-page"), //容器。值支持id名、原生dom对象，jquery对象,
                pages: pageCount, //总页数
                skin: 'toobei', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
                skip: true, //是否开启跳页
                groups: 6, //连续显示分页数
                first: 1,
                last: pageCount,
                prev: '<', //若不显示，设置false即可
                next: '>', //若不显示，设置false即可             
                curr: self.pageIndex,
                jump: function(obj, first) {
                    if (first) return;
                    self.pageIndex = obj.curr;
                    self[fun]();
                }
            });
        }
    };
    planner.init();
});
