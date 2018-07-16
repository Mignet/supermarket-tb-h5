define(function(require, exports, module) {
    var utils    = require('/util/utils');
    var common   = require('/module/common/common');
    var Ajax    = require('/component/ajax/ajax');
    var api     = require('/config/api');
    var newLoanNews = {
        init : function(){
            common.checkLoginStatus();
            this.search = utils.getQueryString();
            document.title = this.search.title;
            $("iframe").attr('src',this.search.url);
        }
    }
    newLoanNews.init();
});