define(function (require, exports, module) {
    var utils = require('/util/utils');
    var common = require('/module/common/common');
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');

    var noticeDetail = {
        init: function () {
            common.checkLoginStatus();
            this.msgId = utils.getQueryString().msgId;
            this.getNoticeDetail();
            this.getNearNotice();
        },
        getNoticeDetail: function () {
            var self = this;
            if (!this.msgId) return;
            var ajax = new Ajax();
            ajax.url = api.noticeDetail;
            ajax.data = {
                msgId: self.msgId
            };
            ajax.success = function (result) {
                var detailTpl = $("#detail").html();
                $("#detailTpl").html(_.template(detailTpl)(result));
            };
            ajax.request();
        },
        getNearNotice: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.nearNotice;
            ajax.data = {
                msgId: self.msgId
            };
            ajax.success = function (result) {
                if (result.beforOne) {
                    $("#beforeOne").text(result.beforOne.message).attr('href', "/module/aboutUs/noticeDetail.html?msgId=" + result.beforOne.id);
                } else {
                    $("#beforeOne").text("无");
                }
                if (result.nextOne) {
                    $("#nextOne").text(result.nextOne.message).attr('href', "/module/aboutUs/noticeDetail.html?msgId=" + result.nextOne.id);
                } else {
                    $("#nextOne").text('无');
                }
            };
            ajax.request();
        }
    };
    noticeDetail.init();
});