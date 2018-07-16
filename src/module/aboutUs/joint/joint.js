define(function (require, exports, module) {
    var common = require('/module/common/common');
    var joint = {
        init: function () {
            common.checkLoginStatus();
        }
    };
    joint.init();
});