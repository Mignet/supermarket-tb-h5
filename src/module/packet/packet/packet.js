define(function(require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var utils = require('/util/utils');
    var common = require('/module/common/common');
    var laypage = require('/component/pager/laypage');
    var layer = require('/component/layer/layer');

    var packet = {
        init: function() {
            this.pageIndex = 1;
            this.pageSize = 6;
            this.type = 1;
            common.checkLoginStatus();
            this.initEvent();
            this.redPacketNum();
            this.renderRedPacket(1);
            this.tpl = [0];
            for (var i = 1; i <= 3; i++) {
                this.tpl[i] = $('#packetTpl' + i).html();
            }
        },

        initEvent: function() {
            var self = this;

            $('.tab').on('click', 'a', function() {
                if ($(this).hasClass('active')) return;
                $(this).addClass('active').siblings().removeClass('active');
                self.type = $(this).data('value');
                self.renderRedPacket(1);
            })

            //退出登录
            $("#loginOut").on('click', function() {
                layer.confirm('确定退出登录？', function(index) { common.logout();
                    layer.close(index); });
            });
            $('.personal-setting a').on('click', function() {
                location.href = '../setting/setting.html';
            });
        },

        // 红包详情
        renderRedPacket: function(pageNum) {
            var _this = this;
            var ajax = new Ajax();
            ajax.url = api.queryRedPacket;
            ajax.isNeedToken = true;
            ajax.isLoadMask = true;
            ajax.data = {
                type: _this.type,
                pageIndex: pageNum,
                pageSize: _this.pageSize
            };
            ajax.success = function(response) {
                $(".packet-list").html(_.template(_this.tpl[_this.type])(response.datas));
                _this.pager(response.pageCount, 'renderRedPacket');
                _this.pageIndex = 1;
                $('.packet-rolling').each(function(index, obj) {
                    var moveLength = $(obj).width() - $(obj).parent().width();
                    if (moveLength > 0) {
                        _this.rollLeft(moveLength + 30, $(obj));
                    }
                });
                var redPacketText;
                if (response.datas.length == 0) {
                    switch (_this.type) {
                        case 1:
                            redPacketText = "暂无可使用红包哦～";
                            break;
                        case 2:
                            redPacketText = "暂无已使用红包哦～";
                            break;
                        case 3:
                            redPacketText = "暂无已过期红包哦～";
                            break;
                    }
                    $('.no-packet-content').show();
                    $('.no-packet-content-text').text(redPacketText);
                } else {
                    $('.no-packet-content').hide();
                }
            };
            ajax.request();
        },

        // 红包数目统计
        redPacketNum: function() {
            var _this = this;
            for (var i = 1; i < 4; i++) {
                _this.redPacketNumIndex(i);
            }
        },

        redPacketNumIndex: function(i) {
            var _this = this;
            var ajax = new Ajax();
            ajax.url = api.queryRedPacket;
            ajax.isNeedToken = true;
            ajax.isLoadMask = false;
            ajax.data = { type: i };
            ajax.success = function(response) {
                $('.tab span').eq(i - 1).text(response.totalCount);
                if (i == 1) {
                    $('.packet-all-count').text(response.totalCount);
                }
            };
            ajax.request();
        },

        /**
         *
         * @param 溢出长度（需滚动长度）
         * @param $obj
         */
        rollLeft: function(pos, $obj) {
            function movePos(pos) {
                $obj.animate({
                    left: '-' + pos + 'px'
                }, 30 * pos, 'linear', function() {
                    $obj.css({ left: 0 });
                });
            }
            movePos(pos);
            setInterval(function() {
                movePos(pos);
            }, 35 * pos);

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
                    self[fun](self.pageIndex);
                }
            });
        }
    };
    packet.init();
});
