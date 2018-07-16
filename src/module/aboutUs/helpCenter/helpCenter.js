define(function (require, exports, module) {
    var common = require('/module/common/common');
    var helpCenter = {
        init: function () {
            common.checkLoginStatus();
            this.bindEvent();
        },
        bindEvent: function () {
            //点击事件
            $(".tab").on('click', "li", function () {
                var index = $(this).index();
                if ($(this).hasClass('active')) return;
                $(".tab li").removeClass('active');
                $(this).addClass('active');
                $(".tab-content ul").hide().eq(index).show();
            });
            //展开收起
            $(".question").on("click", function () {
                $(this).toggleClass("arrow-down arrow-up borderBottom").next().toggle();
            });
        }
    };
    helpCenter.init();
});