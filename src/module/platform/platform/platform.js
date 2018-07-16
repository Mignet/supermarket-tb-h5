define(function(require, exports, module) {
    var Ajax  = require('/component/ajax/ajax');
    var api   = require('/config/api');
    var utils = require('/util/utils');
    var common   = require('/module/common/common');
    var laypage  = require('/component/pager/laypage');
    var orgTpl = $("#orgProductTpl").html();
    var filterTpl = $("#filterBox").html();//选择模板
    var platform = {
    	init:function(){
            this.__FILTERJSON__ = {pageIndex:1,pageSize :12,};
            common.checkLoginStatus();
	    	    this.renderSelect();
            this.renderOrganization();
        },
        //选择渲染
        renderSelect:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.platformHead;
            ajax.isLoadMask  = false,
            ajax.success=function(result){
                $("#filterBox").empty().html(filterTpl);
                _.each(result,function(value,key){
                    _.each(value,function(element,index){
                        element.value = _.escape(element.value);
                        $("#"+key).append("<li data-value="+element.value+"><a>"+element.key+"</a></li>");//插入标签
                    });
                });
                $(".filter-list-box li a").addClass('ellipsis');//样式设置
                $("#filterList").show();
                self.filterEvent();
    		}
    		ajax.request();
    	},
        
    	filterEvent:function(){
            var self = this;
            $(".filter-list-box ul li").on('click',function(){
                if($(this).hasClass('active')) return;
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                var parentId = $(this).parent().attr('id');
                var dataValue = $(this).data('value');
                switch(parentId){
                    case "orgLevel":  self.__FILTERJSON__.securityLevel = dataValue;break;
                    case "deadline":  self.__FILTERJSON__.productDeadLine   = dataValue; break;
                    case "background":self.__FILTERJSON__.background   = dataValue; break;
                    case "profit"  :  self.__FILTERJSON__.yearProfit     = dataValue;
                }
                self.__FILTERJSON__.pageIndex = 1;//点击之后渲染展示第一页
                self.renderOrganization();
            });

    	},
    	renderOrganization : function(){
    		var self = this;
		    var ajax = new Ajax();
		    ajax.url = api.platfromList;
	    	ajax.data= this.__FILTERJSON__;
		    ajax.success = function(result){
                $(".hotplatorm-info").add("#pager").empty();
                if(result.datas && result.datas.length){
                  $('.hotplatorm-info').html(_.template(orgTpl)(result.datas));
                  if (result.totalCount > 12) {
                    $("#pager").show();
                    self.pager(result.pageCount);
                  }
                }else{
                  $(".hotplatorm-info").html(utils.noDataTpl("亲，暂时没有符合条件的平台哦~",true));//无数据模板
                  $(".no-data-tpl").css('width',"1200px");
                  $("#pager").hide();
                }
                $(".site-content").removeClass('minHeight');
                $(".skip").on('click',function(){
                  location.href=$(this).data("href")
                })
		    };
		    ajax.request();
       },
       /*
       * 分页
       */
       pager:function(pageCount){
           var self = this;
           laypage({
               cont   : $("#pager"), //容器。值支持id名、原生dom对象，jquery对象,
               pages  : pageCount, //总页数
               skin   : 'toobei', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
               skip   : true, //是否开启跳页
               groups : 6, //连续显示分页数
               first  : 1,
               last   : pageCount,
               prev: '<', //若不显示，设置false即可
               next: '>', //若不显示，设置false即可             
               curr   : self.__FILTERJSON__.pageIndex, 
               jump   : function(obj, first){
                   if(first) return;
                   self.__FILTERJSON__.pageIndex = obj.curr;
                   self.renderOrganization();
                   $("body,html").animate({scrollTop:0}, "normal");
               }
           }); 
       }
    };
    platform.init();
});
