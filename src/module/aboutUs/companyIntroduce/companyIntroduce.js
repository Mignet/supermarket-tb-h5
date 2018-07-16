define(function(require, exports, module) {
   var common   = require('/module/common/common');
   var company = {      
       init : function(){
          common.checkLoginStatus();
       },
    };
    company.init();
});