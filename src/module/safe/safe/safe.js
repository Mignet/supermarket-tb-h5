define(function(require, exports, module) {
    var common   = require('/module/common/common');
    var safe = {
        init : function(){
            common.checkLoginStatus();
        }
    };
    safe.init();
});