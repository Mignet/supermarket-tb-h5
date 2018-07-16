define(function (require, exports, module) {
    var utils = require('/util/utils');
    var common = require('/module/common/common');
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var dynamicDetail = {
        init: function () {
            common.checkLoginStatus();
            this.msgId = utils.getQueryString().msgId;
            this.getDynamicDetail();
            this.getNearDynamic();
        },
        // 动态详情
        getDynamicDetail: function () {
            var self = this;
            if (!this.msgId) return;
            var ajax = new Ajax();
            ajax.url = api.dynamicDetail;
            ajax.data = {msgId: self.msgId};
            ajax.success = function (result) {
                var detailTpl = $("#detail").html();
                $("#detailTpl").html(_.template(detailTpl)(result));
            };
            ajax.request();
        },
        // 邻近动态
        getNearDynamic: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.dynamicNearNews;
            ajax.data = {
                msgId: self.msgId
            };
            ajax.success = function (result) {
                if (result.beforOne) {
                    $("#beforeOne").text(result.beforOne.title).attr('href', "/module/aboutUs/dynamicDetail.html?msgId=" + result.beforOne.id);
                } else {
                    $("#beforeOne").text("无");
                }
                if (result.nextOne) {
                    $("#nextOne").text(result.nextOne.title).attr('href', "/module/aboutUs/dynamicDetail.html?msgId=" + result.nextOne.id);
                } else {
                    $("#nextOne").text('无');
                }
            };
            ajax.request();
        }
    };
    dynamicDetail.init();
});