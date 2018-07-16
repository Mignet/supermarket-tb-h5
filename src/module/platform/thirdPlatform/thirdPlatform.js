define(function(require,exports,module){
	var Ajax = require('/component/ajax/ajax');
	var api = require('/config/api');
	var utils = require('/util/utils');
	var thirdPlatform = {
		init:function(){
			this.search   = utils.getQueryString();
			this.orgNo    = this.search.orgNo;	
			this.orgName  = this.search.orgName;	
			this.skip();
		},

		skip : function(){
	     	var self = this;
	     	layer.msg('正在为您跳转至'+ self.orgName+'...', {icon: 16,notimeout:true});	
	     	var ajax = new Ajax();
	     	ajax.url = api.getOrgUserCenterUrl;
	     	ajax.isNeedToken = true;
	     	ajax.isLoadMask = false;   
	     	ajax.data = {
	     		'orgNo' : self.orgNo
	     	}
	     	ajax.success = function(data){
	     		if(self.orgNo == 'OPEN_XIAOYINGLICAI_WEB'){
	     		    data.orgAccount = decodeURIComponent(data.orgAccount)
	     		}
	            $("#form").attr('action', data.orgProductUrl);
	            $("#orgAccount").val(data.orgAccount);
	            $("#thirdProductId").val(data.thirdProductId);
	            $("#orgKey").val(data.orgKey);
	            $("#orgNumber").val(data.orgNumber);
	            $("#sign").val(data.sign);
	            $("#timestamp").val(data.timestamp);
	            $("#txId").val(data.txId);
	            $("#requestFrom").val(data.requestFrom);     		
				$("#form").submit();
	     	},
	     	ajax.error = function(msg,data){
	     		layer.msg(msg);
	     	}       
	     	ajax.request(); 				
		}
	}
	thirdPlatform.init();
})	