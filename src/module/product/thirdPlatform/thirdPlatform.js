define(function(require,exports,module){
	var Ajax = require('/component/ajax/ajax');
	var api = require('/config/api');
	var utils = require('/util/utils');
	var thirdPlatform = {
		init:function(){
			this.search   = utils.getQueryString();
			this.productId = this.search.productId;	
			this.orgNo     = this.search.orgNo;	
			this.orgName   = this.search.orgName;	
			this.skip();
		},

		skip : function(){
			var self = this;
            layer.load(4,{
                shade : 0.5,
                content:'<img src="/component/layer/skin/default/loading-2.gif"><span>T呗正在为您跳转到'+this.orgName+'平台……</span>',
                success:function(loadingLayer,index){
                   loadingLayer.addClass('layui-layer-loading-tb');
                   $(".layui-layer-shade").css('backgroundColor', "#fff");
                }
            })
            setTimeout(function(){
    			var ajax = new Ajax();
    			ajax.url = api.getOrgProductUrl;
    			ajax.isNeedToken = true;
    			ajax.isLoadMask  = false;
    			ajax.data = {
    				'orgNo'         : self.orgNo,
    				'productId'     : self.productId
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
            },1000)
		}
	}
	thirdPlatform.init();
})	