define(function(require, exports, module) {
    var Ajax  = require('/component/ajax/ajax');
    var api   = require('/config/api');
    var common   = require('/module/common/common');
    var guide = {
    	init : function(){
            common.checkLoginStatus();            
    	}
    }
    guide.init();
});
