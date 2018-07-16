define(function (require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var common = require('/module/common/common');
    var utils = require('/util/utils');
    var laypage = require('/component/pager/laypage');
    //公告列表模板
    var listTpl = $("#bulletinList").html();

    var dynamic = {
        init: function () {
            common.checkLoginStatus();
            this.pageIndex = 1;
            this.pageSize = 10;
            this.render();
        },
        render: function () {
            var self = this;
            var service = new Ajax();
            service.url = api.toobeiMove;
            service.data = {
                pageIndex: self.pageIndex,
                pageSize: self.pageSize,
                typeCode: 2
            };
            service.success = function (result) {
                if (result.datas && result.datas.length) {
                    $("#dynamicList").html(_.template(listTpl)(result.datas));
                    self.pager(result.pageCount);
                    $(".dynamic-list li").last().addClass('last');
                } else {
                    $("#dynamicList").html(utils.noDataTpl('亲，暂时没有相关动态哦~'),true);
                }
            };
            service.request();
        },

        pager: function (pageCount) {
            var self = this;
            laypage({
                cont: $("#pager"), //容器。值支持id名、原生dom对象，jquery对象,
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
                    self.render();
                    $("body,html").animate({scrollTop: 0}, "normal");
                }
            });
        }
    };
    dynamic.init();
});