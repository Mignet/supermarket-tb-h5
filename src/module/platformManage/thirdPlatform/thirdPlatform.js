define(function(require,exports,module){
	var Ajax = require('/component/ajax/ajax');
	var api = require('/config/api');
	var utils = require('/util/utils');
	var thirdPlatform = {
		init:function(){
			this.search   = utils.getQueryString();
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
                }
            });
            var ajax = new Ajax();
            ajax.url = api.getOrgUserCenterUrl;
            ajax.isLoadMask = false;
            ajax.data = {
                'orgNo' : self.orgNo
            };
            ajax.success = function(data){
                if(self.orgNo == 'OPEN_XIAOYINGLICAI_WEB'){
                    data.orgAccount = decodeURIComponent(data.orgAccount)
                }
                $("#form").attr('action',data.orgUsercenterUrl);
                $("#orgAccount").val(data.orgAccount);
                $("#orgKey").val(data.orgKey);
                $("#orgNumber").val(data.orgNumber);
                $("#sign").val(data.sign);
                $("#timestamp").val(data.timestamp);
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