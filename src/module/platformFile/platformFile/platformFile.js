define(function(require,exports,module){
    var Ajax = require('/component/ajax/ajax');
    var api   = require('/config/api');
    var laypage  = require('/component/pager/laypage');
    var common= require('/module/common/common');
    var utils = require('/util/utils');
    var plarformListTpl = $("#plarformListTpl").html();
    var file = {
        init:function(){
            common.checkLoginStatus();
            this.listJSON = {pageIndex:1,pageSize:10};
            this.renderSelect();
            this.renderList();
            this.bindEvent();
        },
        bindEvent:function(){
            var self = this;
            $(".site-filter").on('click','a[data-value]',function(){
                var parent = $(this).closest('.filter-list-box');
                parent.find('a[data-value]').removeClass('active');
                $(this).addClass('active');    
                var id = parent.find('.filter-list').attr('id'); 
                var dataValue = $(this).data('value');
                switch(id){
                    case "level" :
                      self.listJSON.securityLevel =   dataValue
                    break;
                    case "deadline" :
                     self.listJSON.productDeadLine = dataValue
                    break;
                    case "profit" :
                     self.listJSON.yearProfit = dataValue
                }
                self.renderList();
            });

            $(".search").on('click', '.search-button', function() {
                if (!$(this).prev().val()) return;
                self.listJSON.platformName=$(this).prev().val();
                $(this).prev().val("");
                self.renderList();
            });

            $(document).on('keyup',function(event){
                var event = window.event||event;
                if(event.which == 13||event.keyCode == 13){
                    $(".search-button").trigger('click');         
                }
            })
        },
        /*
        * 筛选条件
        */
        renderSelect:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.isLoadMask  = false;
            ajax.url = api.loanOrgSearch;
            ajax.success = function(result){
                _.each(result,function(value,key){
                    _.each(value,function(element, index) {
                        element.value = _.escape(element.value);//转义HTML字符串 替换 >
                        if(_.unescape(element.value) === self.orgLevel || element.value === self.profit || element.value === self.deadline || element.value === self.platfrom){
                            $("#"+key).append("<li><a class='ellipsis active' data-value="+element.value+">"+element.key+"</a></li>");
                        }else{
                            $("#"+key).append("<li><a class='ellipsis' data-value="+element.value+">"+element.key+"</a></li>");
                        }
                    });
                });
                $(".site-search").removeClass('none');
            };
            ajax.request();
        },
        /*
        *  列表渲染
        */
        renderList:function(){
            var self = this;
            var ajax = new Ajax();
            ajax.isLoadMask= true;
            ajax.url = api.loanOrgList;
            ajax.data= self.listJSON;
            ajax.success = function(result){
                if(result.datas.length){
                    var _result = self._filter(result.datas);
                    $("#plarformList").empty().html(_.template(plarformListTpl)(_result));
                    self.pager(result.pageCount);
                }else{
                    $("#plarformList").empty().html(utils.noDataTpl("亲，暂时没有符合条件的平台哦~"));//无数据模板
                }
                $(".site-content").css('minHeight',"auto");
                $("#plarformList").add('.reminder').removeClass('none');

            };
            ajax.request();
        },
        /*
        * 列表数据处理
        */
        _filter:function(result){
            var array = [];
            _.each(result,function(data){
                data.yearRete = parseFloat(data.minProfit).toFixed(2)+"~"+parseFloat(data.maxProfit).toFixed(2)+"%";
                data.bidSecurity = data.bidSecurity.substr(0,16);
                array.push(data);
            });
            return array;
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
                curr   : self.listJSON.pageIndex, 
                jump   : function(obj, first){
                    if(first) return;
                    self.listJSON.pageIndex = obj.curr;
                    self.renderList();
                    $("body,html").animate({scrollTop:0}, "normal");
                }
            }); 
        }
    };
    file.init();
})