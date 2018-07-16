define(function(require, exports, module) {
	var form = require('/component/form/form');
	var Ajax = require('/component/ajax/ajax');
	var utils = require('/util/utils');
    var api   = require('/config/api');
    var config = require('/config/config');
    var common   = require('/module/common/common');

    var register = {
	    init : function(){
	    	common.checkLoginStatus();
	    	this.refrshImg();	    	
	    	this.initEvent();	    	
	    },

	    initEvent : function(){
	    	var self = this;
		    $("#refreshVeri").on("click",function(){
		    	self.refrshImg() ;
		    });

		    $("#telphone").on('blur',function(){
		    	if(/^1\d{10}$/.test($(this).val())){
		    		self.refrshImg();
		    		self.checkMobile();
		    	}
		    })

		    $(".submitButton").on('click',function(){
               if(!form.isPass()) return ;
               var data = form.getFormData();
               self.getRefererInfo(data);
               self.register(data);		    	
		    })

		    $("#userProtocol").on('click',function(){
		    	var height = $(window).height() -100;
				layer.open({
				  title : 'T呗用户协议',
				  type  : 2,
				  area  : ['800px', height+'px'],
				  fix   : true,
				  scrollbar: false,
				  content: '/module/user/userProtocol.html'
				});		    	
		    })

			$(document).on("keydown",function(event){
			    var event=window.event||event; 		
			    if(event.which == 13){
                    $(".submitButton").trigger('click');     	
			    }
			});
	    },

	    hiddenButton : function(){
	    	$('.login').hide();
	    	$('.register').hide();
	    },
  
	    register:function(data){
	    	var ajax  = new Ajax();
			ajax.url  = api.register ;
			ajax.data = data ;
			ajax.success = function(data){
               location.href='/module/user/login.html';
		    }
		    ajax.request();
	    },

	    refrshImg:function(){
	    	var codeImgSrc = config.vcodeUrl + 'captcha?mobile='+ $("#telphone").val()+'&d='+Date.now();		
			$('#verImg').attr('src',codeImgSrc);
	    },


	    checkMobile : function(){
	        var ajax  = new Ajax();
			ajax.url  = api.checkMobile ;
			ajax.data = {
				mobile : $("#telphone").val()
			} ;
			ajax.success = function(data){
			   if(data.regFlag == "2"){
                 layer.msg('你已经是T呗用户，请直接登陆');
                 setTimeout(function(){
                   location.href='/module/user/login.html';
                 },800)
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
   }

   register.init();
});
 
