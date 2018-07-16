define(function (require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var utils = require('/util/utils');
    var laypage = require('/component/pager/laypage');
    var layer = require('/component/layer/layer');
    var common = require('/module/common/common');

    var account = {
        init: function () {
            this.isLogin();
            this.pageIndex = 1;
            this.pageSize = 10;
            this.status = 1;
            this.typeValue = 1;
            this.initData();
            this.bindEvent();
        },

        /**
         * 登录态
         * @return {Boolean} [description]
         */
        isLogin: function () {
            common.checkLoginStatus(function (data) {
                $("#investmentAmt").text(data.investAmount);
                $("#investmentIncome").text(data.totalProfit);
                $("#investmentReward").text(data.accountBalance);
            });
        },

        /**
         * 初始化数据库
         * [initData description]
         * @return {[type]} [description]
         */
        initData: function () {
            this.investClassifyCount();
            this.rewardClassifyCount();
            var search = utils.getQueryString();
            if (search.from == "withdrawal") {
                this.withdrawHistory();
                $(".tab").find('a').eq(2).addClass('active');
                $("div[data-for=investmentDetial]").removeClass('none');
            } else {
                this.investmentHistory();
                $(".tab").find('a').eq(0).addClass('active');
                $("div[data-for=investmentRecord]").removeClass('none');
            }
        },

        /**
         * 绑定事件
         * @return {[type]} [description]
         */
        bindEvent: function () {
            var self = this;

            $(".tab").on('click', 'a', function () {
                if ($(this).hasClass('active')) return;
                $(this).addClass('active').siblings().removeClass('active');
                $('.tab-child').addClass('none');
                var id = $(this).data('id');
                $('div[data-for=' + id + ']').removeClass('none');
                self.pageIndex = 1;
                if (id == 'investmentRecord') {
                    self.investmentHistory();
                }
                if (id == 'investmentReward') {
                    self.investmentReward();
                }
                if (id == 'investmentDetial') {
                    self.withdrawHistory();
                }
            })

            $('div[data-for=investmentRecord]').on('click', 'a', function () {
                if ($(this).hasClass('active')) return;
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                if ($(this).data('value') == '4') {
                    self.pageIndex = 1;
                    self.investmentOtherHistory();
                } else {
                    self.pageIndex = 1;
                    self.status = $(this).data('value');
                    self.investmentHistory();
                }
            })

            $('div[data-for=investmentReward]').on('click', 'a', function () {
                if ($(this).hasClass('active')) return;
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                self.pageIndex = 1;
                self.typeValue = $(this).data('value');
                self.investmentReward();
            })

            //退出登录
            $("#loginOut").on('click', function () {
                layer.confirm('确定退出登录？', function (index) {
                    common.logout();
                    layer.close(index);
                });
            });

            $('.personal-setting a').on('click', function() {
                location.href = '../setting/setting.html';
            });
        },


        /**
         * 投资记录（1、募集中，2、回款中，3、已完成 ，4、其他等 的目录条数）
         * [investmentHistory description]
         * @return {[type]} [description]
         */
        investClassifyCount: function () {
            var ajax = new Ajax();
            ajax.url = api.investRecordCounts;
            ajax.success = function (result) {
                $("#collect").text('（' + result.tzz + '）');
                $("#back").text('（' + result.hkz + '）');
                $("#done").text('（' + result.hkwc + '）');
                $("#other").text('（' + result.qt + '）');
            };
            ajax.request();
        },

        /**
         * 奖励明细（1、募集中，2、回款中，3、已完成 ，4、其他等 的目录条数）
         * [investmentHistory description]
         * @return {[type]} [description]
         */
        rewardClassifyCount: function () {
            var ajax = new Ajax();
            ajax.url = api.queryAccountType;
            ajax.success = function (result) {
                var template = _.map(result.datas, function (obj, index) {
                    return '<a data-value="' + obj.typeValue + '">' + obj.typeName + '</a>';
                }).join('');
                var elements = $('div[data-for=investmentReward]').html(template);
                elements.find('a').eq(0).addClass('active');
            };
            ajax.request();
        },

        /**
         * 投资记录（1、募集中，2、回款中，3、已完成）
         * [investmentHistory description]
         * @return {[type]} [description]
         */
        investmentHistory: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.customerInvestRecord;
            ajax.data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                status: this.status
            };
            ajax.success = function (result) {
                self.switchThead(1);
                if (result.pageCount == 0) {
                    self.noDataHtml(7, '亲，暂时没有相关投资记录哦~');
                } else {
                    $(".table-tbody").html(_.template($("#investHistoryTpl").html())(result.datas));
                }
                self.pager(result.pageCount, 'investmentHistory');
            };
            ajax.request();
        },


        /**
         * 投资记录（4、其他）
         * [investmentHistory description]
         * @return {[type]} [description]
         */
        investmentOtherHistory: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.unRecordInvestList;
            ajax.data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            ajax.success = function (result) {
                self.switchThead(2);
                if (result.pageCount == 0) {
                    self.noDataHtml(4, '亲，暂时没有相关投资记录哦~');
                } else {
                    $(".table-tbody").html(_.template($("#investOtherHistoryTpl").html())(result.datas));
                }
                self.pager(result.pageCount, 'investmentOtherHistory');
            };
            ajax.request();
        },

        /**
         * 奖励明细
         * [investmentReward description]
         * @return {[type]} [description]
         */
        investmentReward: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.accountDetailList;
            ajax.data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                typeValue: this.typeValue
            };
            ajax.success = function (result) {
                self.switchThead(3);
                if (result.pageCount == 0) {
                    self.noDataHtml(4, '亲，暂时没有相关奖励记录哦~');
                } else {
                    $(".table-tbody").html(_.template($("#rewardHistoryTpl").html())(result.datas));
                }
                self.pager(result.pageCount, 'investmentReward');
            };
            ajax.request();
        },

        /**
         * 提现记录
         * [withdrawHistory description]
         * @return {[type]} [description]
         */
        withdrawHistory: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.withdrawHistory;
            ajax.data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            ajax.success = function (result) {
                self.switchThead(4);
                if (result.pageCount == 0) {
                    self.noDataHtml(6, '亲，暂时没有相关提现记录哦~');
                } else {
                    $(".table-tbody").html(_.template($("#withdrawHistoryTpl").html())(result.datas));
                }
                self.pager(result.pageCount, 'withdrawHistory');
            };
            ajax.request();
        },

        /**
         * 切换头部
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        switchThead: function (val) {
            var thead = $("thead");
            if (val == 1) {
                thead.html('<tr><th >平台</th><th>产品名称</th><th>产品期限</th><th >投资金额（元）</th><th >预期收益（元）</th><th >购买时间</th><th >到期时间</th></tr>');
            }
            if (val == 2) {
                thead.html('<tr><th >平台</th><th>产品名称</th><th>产品期限</th><th >投资金额（元）</th><th >购买时间（元）</th></tr>');
            }
            if (val == 3) {
                thead.html('<tr><th >类别</th><th>奖励金额（元）</th><th>奖励时间</th><th >备注</th></tr>');
            }
            if (val == 4) {
                thead.html('<tr><th>提现银行</th><th>银行账户</th><th>提现金额</th><th>提现时间</th><th>状态</th><th>备注</th></tr>');
            }
        },

        /**
         * 无数据提示
         * @param  {[type]} colspan [description]
         * @param  {[type]} tip     [description]
         * @return {[type]}         [description]
         */
        noDataHtml: function (colspan, tip) {
            $(".table-tbody").html('<tr><td colspan="' + colspan + '" class="no-data"><img src="/image/no_data.png"><p>' + tip + '</p></td></tr>');
        },

        /**
         * 分页组件
         * @param  {[type]} pageCount [description]
         * @param  {[type]} fun       [description]
         * @return {[type]}           [description]
         */
        pager: function (pageCount, fun) {
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
                jump: function (obj, first) {
                    if (first) return;
                    self.pageIndex = obj.curr;
                    self[fun]();
                }
            });
        }

    };

    account.init();
});