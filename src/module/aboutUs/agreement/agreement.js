define(function (require, exports, module) {
    var common = require('/module/common/common');
    var agreement = {
        init: function () {
            common.checkLoginStatus();
        },
    };
    agreement.init();
});