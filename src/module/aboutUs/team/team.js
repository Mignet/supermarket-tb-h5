define(function (require, exports, module) {
    var common = require('/module/common/common');
    var Swiper = require('/component/swiper/swiper');
    var team = {
        init: function () {
            common.checkLoginStatus();
            this.bindEvent();
        },
        bindEvent: function () {
            var mySwiper = new Swiper('.swiper-container', {
                slidesPerView: 3,
                resistance:'100%'
            });

            $(".arrow").on('click', function (e) {
                if ($(this).hasClass('arrow-left')) {
                    e.preventDefault();
                    mySwiper.swipePrev();
                } else if ($(this).hasClass('arrow-right')) {
                    e.preventDefault();
                    mySwiper.swipeNext();
                }
            });
            $(".wrapper").css('opacity', '1');
        }
    };
    team.init();
});