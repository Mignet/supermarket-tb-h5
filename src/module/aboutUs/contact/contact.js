define(function(require, exports, module) {
   var common   = require('/module/common/common');
   var contact = {      
       init : function(){
          common.checkLoginStatus();
       }
    };
    contact.init();
});