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

	    	$("#mobile").on('blur',function(){
	    		if(/^1\d{10}$/.test($(this).val())){
		    		self.checkMobile();	    			
	    		}
	    	})

		    $("a.submit").on('click',function(){
               if(!form.isPass($(this))) return ;
               var data = form.getFormData($(this));
               self.register(data);		    	
		    })

			$(document).on("keydown",function(event){
			    var event=window.event||event; 		
			    if(event.which == 13){
                    $("a.submit").trigger('click');     	
			    }
			});
	    },

	    register:function(data){
	    	var ajax  = new Ajax();
			ajax.url  = api.register ;
			ajax.data = this.getRefererInfo(data);
			ajax.success = function(data){
               location.href='./login.html';
		    }
		    ajax.request();
	    },

	    checkMobile : function(){
	        var ajax  = new Ajax();
			ajax.url  = api.checkMobile ;
			ajax.isLoadMask = false;
			ajax.data = {
				mobile : $("#mobile").val()
			} ;
			ajax.success = function(data){
			   if(data.regFlag == "2"){
                 layer.msg('你已经是T呗用户，请直接登陆');
                 setTimeout(function(){
                   location.href='./login.html';
                 },800)
			   }
		    }
		    ajax.request();	
	    },

	    getRefererInfo:function(data){
			data.accessUrl = utils.getCookie('_href_');
			data.fromUrl   = utils.getCookie('_referer_');
		    utils.setCookie('_href_','',-1);
		    utils.setCookie('_referer_','',-1);
		    return data;
	    }	    
   }

   register.init();
});
 
