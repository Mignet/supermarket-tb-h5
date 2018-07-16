define(function(require, exports, module) {
	var form = require('/component/form/form');
	var Ajax = require('/component/ajax/ajax');
	var api   = require('/config/api');
	var utils    = require('/util/utils');
    var common   = require('/module/common/common');
    
	var login = {
		init : function(){
		    common.checkLoginStatus();
		    this.search = utils.getQueryString();
			this.initEvent();   	
		},

		initEvent : function(){
			var self = this;

			$("#loginButton").on("click",function(){	  
			    if(!form.isPass($(this))) return ;
				var data = form.getFormData($(this));
                self.getRefererInfo(data);
				self.login(data);
			});

			$(document).on("keydown",function(event){
			    var event=window.event||event;	
			    if(event.which == 13||event.keyCode == 13){
                    $("#loginButton").trigger('click');	    	
			    }
			});
		},

	    login:function(data){
	    	var self = this;
	    	var ajax = new Ajax();
		    ajax.url = api.login ;
		    ajax.data = data ;
		    ajax.success = function(data){
		       utils.setCookie('token',data.token,2);
		       if(self.search.back){
		       		history.back()
		       }else{
		       		location.href = '/index.html';		
		       }
		    }
		    ajax.request();
	    },

	    getRefererInfo:function(data){
			data.accessUrl = utils.getCookie('_href_');
			data.fromUrl   = utils.getCookie('_referer_');
		    utils.setCookie('_href_',null,null);
		    utils.setCookie('_referer_',null,null);
	    }
	};

	login.init();
});

