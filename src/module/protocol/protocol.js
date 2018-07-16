define(function(require, exports, module) {
    var common   = require('/module/common/common');
    var protocol = {
        init : function(){
            common.checkLoginStatus();
        }
    } ;
    protocol.init() ;
});
