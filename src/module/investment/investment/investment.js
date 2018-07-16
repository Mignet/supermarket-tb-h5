define(function(require, exports, module) {
  var utils = require('/util/utils');
  var common = require('/module/common/common');
  var api   = require('/config/api');
  var Ajax  = require('/component/ajax/ajax');
  var listTpl  = require('../template/list.html');

  var investment = {
    	init : function(){
          common.checkLoginStatus();
          common.loginOutClick();
          this.status   = 1;
          this.pageSize = 10;
          this.initEvent();
          this.renderInvestment();
      },

      initEvent : function(){
        var self = this;
    		$(".tab").on('click','span',function(){
               $(this).siblings().removeClass('current');
               $(this).addClass('current');
               self.status = $(this).data('value');
               window.pager = null;
               self.renderInvestment();
    		});
    	},

    	renderInvestment : function(pageIndex){
    		    var self = this;
            var ajax = new Ajax();
            ajax.url = api.customerInvestRecord;
            ajax.isNeedToken = true;
            ajax.data = {
            	status    : this.status,
              pageSize  : this.pageSize,
              pageIndex : pageIndex || 1
            };
            ajax.success = function(result){
                $("#investmentTab").html(_.template(listTpl)(result));
                common.pager(result.pageCount,$("#pager"),_.bind(self.renderInvestment,self),3);
            }
            ajax.request();
    	}
  }
  investment.init();
})