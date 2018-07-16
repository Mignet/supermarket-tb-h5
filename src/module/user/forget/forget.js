define(function(require, exports, module) {
	var form = require('/component/form/form');
	var Ajax = require('/component/ajax/ajax');
	var utils = require('/util/utils');
    var api   = require('/config/api');
    var config = require('/config/config');

    var register = {
	    init : function(){	
	    	this.initEvent();	    	
	    },

	    initEvent : function(){
	    	var self = this;
		    $(".findpasswrodBtn").on('click',function(){
               if(!form.isPass($(this))) return ;
               var data = form.getFormData($(this));
               self.register(data);		    	
		    })

		    $(document).on("keydown",function(event){
			    var event=window.event||event; 		
			    if(event.which == 13){
                    $(".findpasswrodBtn").trigger('click');     	
			    }
			});
	    },

	    register:function(data){
	    	var ajax  = new Ajax();
			ajax.url  = api.resetLoginPwd ;
			ajax.data = data ;
			ajax.success = function(data){
               location.href = './login.html';
		    }
		    ajax.request();
	    }
   }
    register.init();
});

