define(function(require, exports, module) {
    var Ajax    = require('/component/ajax/ajax');
    var api     = require('/config/api');
    var config  = require('/config/config');
    var utils   = require('/util/utils');
    var common  = require('/module/common/common');
    var laypage = require('/component/pager/laypage');
    var Swiper  = require('/component/swiper/swiper');
    var Countdown = require('/component/countdown/countdown');
    var buy     = require('/module/common/buy');
    var newsTpl = $("#netloanNewsTpl").html();
    var index = {
        init: function() {           
            this.newsType = 1;
            this.isLogin();
            this.getBanner();
            this.getNotice();
            this.getPlatformProduct();
            this.getClassifyProduct();
            this.getOrgBanner();
            this.getNetloanNews();
            this.getMoveList();
            this.getNoticeList();
            this.initEvents();
        },


        initEvents: function() {
            var self = this;

            $(".hotplatorm-info").on('click','.skip-org-detail',function(){
                if ($(this).data('href'))  window.open($(this).data('href'));
            });

            $(".news-tab").on('click', 'a', function() {
                $('.news-tab').find("a").removeClass('active');
                $(this).addClass('active');
                self.newsType = $(this).data('id');
                self.getNetloanNews($(this).text());
            });

            $(".product-classify").on('click','a.buyButton',function(){
                var num  = $(this).data('number');
                var name = $(this).data('name');
                var id   = $(this).data('id');
                var logo  = $(this).data('logo');
                var isVirtual = $(this).data('virtual');
                buy.init(num,name,id,logo,isVirtual);
            });
        },

        isLogin: function() {
            var self = this;
            common.checkLoginStatus(function(data) {
                if (window.isLogin) {
                    $("#userName").text(data.mobile);
                    $("#greeting").text(self.getGreeting(new Date().getHours()));
                    $("#accountBalance").text(data.accountBalance + ' 元');
                    $("#totalProfit").text(data.totalProfit + ' 元');
                    $(".login-content").show();
                    utils.setCookie('userName',data.userName,2);
                    utils.setCookie('mobile',data.mobile,2);
                } else {
                    $(".loginout-content").show();
                }
            });
        },

        /**
         *
         * 获取banner图片
         * @return {[type]} [description]
         */
        getBanner: function() {
            var ajax = new Ajax();
            ajax.url = api.banners;
            ajax.isLoadMask = false;
            ajax.data = {
                advPlacement: 'pc_banner',
                type: '2'
            };
            ajax.success = function(data) {
                var bannerTpl = $("#bannerTpl").html();
                $("#site-bannerWrapper").html(_.template(bannerTpl)(data.datas));
                if (data.datas.length > 1) {
                    var swiper = new Swiper('.site-banner', {
                        pagination: '.pagination',
                        paginationClickable: true,
                        centeredSlides: true,
                        autoplay: 3000,
                        autoplayDisableOnInteraction: false,
                        loop: true
                    });
                }
            };
            ajax.request();
        },

        /**
         * 获取公告消息
         * @return {[type]} [description]
         */
        getNotice: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.bulletinList;
            ajax.isNeedToken = true;
            ajax.isLoadMask = false,
            ajax.success = function(result) {
                $('.notice').append(_.map(result.datas, function(obj) {
                    return '<li><a href="/module/aboutUs/noticeDetail.html?msgId=' + obj.id + '">' + obj.message + '</a></li>';
                }).join(''));
                if (result.datas.length > 1) {
                    self.loopNotice();
                }
            };
            ajax.request();
        },

        /**
         * 获取优质平台
         * @return {[type]} [description]
         */
        getPlatformProduct: function() {
            var ajax = new Ajax();
            ajax.url = api.hotPlatform;
            ajax.data = { pageSize: 4 };
            ajax.success = function(result) {
                var tpl = $("#orgProductTpl").html();
                $('.hotplatorm-info').html(_.template(tpl)(result.datas));
            };
            ajax.request();
        },

        /**
         * 获取分类产品信息
         * @return {[type]} [description]
         */
        getClassifyProduct: function() {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.productClassifyStatistics;
            ajax.isLoadMask = false;
            ajax.isNeedToken = true;
            ajax.success = function(result) {
                var tpl = $("#productClassifyTpl").html();
                var arr = self.classifyFilter(result);
                $('.product-classify').html(_.template(tpl)(arr));
                self.countDownHandle(arr);
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

        /**
         * 获取注入机构banner
         * @return {[type]} [description]
         */
        getOrgBanner: function() {
            var _this = this;
            var ajax = new Ajax();
            ajax.url = api.queryLatestOrg;
            ajax.isLoadMask = false,
            ajax.success = function(result) {
                var tpl = $("#orgBannerTpl").html();
                $("#cooperationBanner").html(_.template(tpl)(result.datas));
                var swiper = new Swiper('.cooperation-bannerwrap', {
                    slidesPerView: 4,
                    paginationClickable: true,
                    freeMode: true,
                    autoplay: 3000,
                    autoplayDisableOnInteraction: false,
                    loop: true
                });

                $('.cooperation-banner .arrow-left').on('click', function(e) {
                    e.preventDefault();
                    swiper.swipePrev();
                });

                $('.cooperation-banner .arrow-right').on('click', function(e) {
                    e.preventDefault();
                    swiper.swipeNext();
                });
            };
            ajax.request();
        },

        getNetloanNews: function(title) {
            var ajax = new Ajax();
            ajax.url = api.netloanNews;
            ajax.data = {
                pageSize: 3,
                typeCode: this.newsType
            };
            ajax.success = function(result) {
                if (result.datas && result.datas.length >= 1) {
                    title = title || '投资攻略';
                    $("#newsMore").attr('href', result.datas[0].moreUrl).show();
                    $('#netloanNewsBox').html(_.template(newsTpl)(result.datas));
                } else {
                    $("#newsMore").hide();
                    $('#netloanNewsBox').html("<li class='empty'><img src='/image/no_data.png'><p>亲，暂时没有相关新闻哦~</p></li>");
                }
            };
            ajax.request();
        },

        getMoveList: function() {
            var ajax = new Ajax();
            ajax.url = api.toobeiMove;
            ajax.data = {
                pageSize: 3,
                typeCode: 2
            };
            ajax.success = function(result) {
                if (result.datas && result.datas.length >= 1) {
                    $('#tb-move-box').html(_.template($("#tbMoveTpl").html())(result.datas));
                } else {
                    $("#move-more").hide();
                    $('#tb-move-box').html("<li class='empty'><img src='/image/no_data.png'><p>亲，暂时没有相关动态哦~</p></li>");
                }
            };
            ajax.request();
        },

        getNoticeList: function() {
            var ajax = new Ajax();
            ajax.url = api.bulletinList;
            ajax.data = {
                pageSize: 3,
                typeCode: 3
            };
            ajax.success = function(result) {
                if (result.datas && result.datas.length >= 1) {
                    $('#tb-notice-box').html(_.template($("#tbNoticeTpl").html())(result.datas));
                } else {
                    $("#notive-more").hide();
                    $('#tb-notice-box').html("<li class='empty'><img src='/image/no_data.png'><p>亲，暂时没有相关公告哦~</p></li>");
                }
            };
            ajax.request();
        },

        getGreeting: function(d) {
            if (d > 0 && d <= 8) {
                return '早上好！';
            }
            if (d > 8 && d <= 11) {
                return '上午好！';
            }
            if (d > 11 && d <= 13) {
                return '中午好！';
            }
            if (d > 13 && d <= 18) {
                return '下午好！';
            }
            if (d > 18 && d <= 23) {
                return '晚上好！';
            }
        },

        classifyFilter: function(result) {
            var array = [];
            _.forEach(result.datas, function(obj, index) {
                obj.cateDeclare = obj.cateDeclare.substring(0, 15);
                if (obj.productPageListResponse) {
                    _.extend(obj, obj.productPageListResponse);
                    //产品期限
                    var arr = obj.deadLineValueText.split(',');
                    if (arr.length == 2) {
                        obj.deadLineText = arr[0] + "<span class='unit'>" + $.trim(arr[1]) + "</span>";
                    } else if (arr.length == 4) {
                        obj.deadLineText = arr[0] + "<span class='unit'>" + $.trim(arr[1]) + "</span>~" + $.trim(arr[2]) +
                            "<span class='unit'>" + $.trim(arr[3]) + "</span>";
                    }
                    //产品期限
                    if (obj.isFlow == "1") {
                        obj.yearRate = obj.flowMinRate;
                    } else {
                        obj.yearRate = obj.flowMinRate + '~' + obj.flowMaxRate;
                    }

                    // 是否显示销售进度
                    if (obj.isHaveProgress == "0") {
                        obj.isHaveProgressClass = 'visible';
                    }

                    //销售进度
                    obj.remainingBalance = Math.round((obj.buyTotalMoney - obj.buyedTotalMoney) * 100) / 100; //剩余额度:总金额减去已购买金额
                    //选取金额限制(orgAmountLimit)和剩余金额(remainingBalance)中数值小的(在非空的情况下 如果为空 则取另外一个)

                    if (obj.remainingBalance <= 0) {
                        obj.remainingBalance = 0;
                        obj.salePercent = 100 + '%';
                    } else {
                        var buyedTotalMoney = obj.buyedTotalMoney || 0;
                        var buyTotalMoney = obj.buyTotalMoney || 1;
                        obj.salePercent = parseInt(buyedTotalMoney / buyTotalMoney * 100) + '%';
                    }

                    if (obj.remainingBalance && (!obj.orgAmountLimit)) { //限购金额为空 ==> 剩余额度
                        obj.saleAmout = utils.formatAmount(obj.remainingBalance);
                    } else if (obj.orgAmountLimit && (!obj.remainingBalance)) { //剩余额度为空 ==> 限购金额
                        obj.saleAmout = utils.formatAmount(obj.orgAmountLimit);
                    } else if (!(obj.remainingBalance || obj.orgAmountLimit)) { //全部为空
                        obj.saleAmout = "不限";
                    } else if (obj.remainingBalance > obj.orgAmountLimit * 1) { //都不为空 且 剩余额度 > 限购金额 ==> 限购金额
                        obj.saleAmout = utils.formatAmount(obj.orgAmountLimit);
                    } else if (obj.remainingBalance <= obj.orgAmountLimit * 1) { //都不为空 且 剩余额度 < 限购金额 ==> 剩余额度
                        obj.saleAmout = utils.formatAmount(obj.remainingBalance);
                    }
                    if (obj.tagList) {
                        obj.tagListText = _.map(obj.tagList, function(tag, index) {
                            return '<span>' + tag + '</span>';
                        }).join("");
                    } else {
                        obj.tagListText = "";
                    }
                    array.push(obj);
                } else {
                    obj.soldOutClass = "";
                    obj.isPlannerClass = "";
                    switch (obj.cateId) {
                        case 1: //1-热门产品
                            obj.yearRate = "7.00~12.00";
                            obj.deadLineText = "30<span>天</span>~360<span>天</span>";
                            break;
                        case 2: //2-新手产品 
                            obj.yearRate = "10.00~15.00";
                            obj.deadLineText = "1<span>天</span>~360<span>天</span>";
                            break;
                        case 3: //3-短期产品 
                            obj.yearRate = "6.00~12.00";
                            obj.deadLineText = "1<span>天</span>~90<span>天</span>";
                            break;
                        case 4: //4-高收益产品 
                            obj.yearRate = "10.00~18.00";
                            obj.deadLineText = "30<span>天</span>~360<span>天</span>";
                            break;
                        case 5: //5-稳健收益产品 /中长期产品
                            obj.yearRate = "6.00~10.00";
                            obj.deadLineText = "90<span>天</span>~360<span>天</span>";
                            break;
                        case 801: //801-理财师推荐产品 
                            obj.yearRate = "7.00~12.00";
                            obj.deadLineText = "30<span>天</span>~360<span>天</span>";
                            obj.soldOutClass = "hidden";
                            obj.isPlannerClass = 'block';
                    }
                    array.push(obj);
                }
            });
            return array;
        },

        /*
         * 通告循环
         */
        loopNotice: function() {
            var timer, self = this;
            $('.notice').animate({ "marginTop": "-40px" }, 500, function() {
                clearTimeout(timer);
                $(this).children(':first').appendTo($(this));
                $(this).css('margin-top', "0");
                timer = setInterval(self.loopNotice, 5000);
            });
        }
    };

    index.init();
});
