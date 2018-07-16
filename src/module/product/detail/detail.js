define(function (require, exports, module) {
    var Ajax = require('/component/ajax/ajax');
    var api = require('/config/api');
    var utils = require('/util/utils');
    var common = require('/module/common/common');
    var laypage = require('/component/pager/laypage');
    var buy = require('/module/common/buy');
    var detail = {
        init: function () {
            common.checkLoginStatus();
            this.productId = utils.getQueryString().productId;
            this.renderDetail();
            this.bindEvent();
        },
        /*
        * [绑定方法]
        * */
        bindEvent: function () {
            var self = this;
            $('#site-detailWrapper').on('click', '.productBuyButton', function () {
                var orgIsstaticproduct = $(this).attr('orgIsstaticproduct');
                var orgJointType = $(this).attr('orgJointType');
                var isVirtual = true;
                if(orgIsstaticproduct == "0" && (orgJointType == "0" || orgJointType == "2")){
                    isVirtual = false;     
                }               
                var orgNumber = $(this).attr('orgnumber');
                var buyProductId = $(this).attr('productid');
                var orgName = $(this).attr('orgname');
                var productid = $(this).attr('productid');
                var logo = $(this).attr('logo');
                buy.init(orgNumber, orgName, productid, logo,isVirtual);    
            });
        },
        renderDetail: function () {
            var self = this;
            var ajax = new Ajax();
            ajax.url = api.productDetail;
            ajax.data = {
                productId: self.productId
            };
            ajax.success = function (result) {
                $('.current-platform').text(result.orgInfoResponse.orgName).parent().attr('href', '../platform/platformDetail.html?orgNo='+result.orgInfoResponse.orgNo);
                $('.current-product').text(result.productName);
                var resultTpl = self.detailFilter(result);
                var detailTpl = $("#detailTpl").html();
                $("#site-detailWrapper").html(_.template(detailTpl)(resultTpl));
                $("#productMsg").html(result.productDesc).parent().removeClass("none");
                var rightHeight = $('.productBuyButton').outerHeight() + $('.attention').outerHeight() + $(".project-progress").outerHeight();
                $(".detail-enter").height(rightHeight);
            };
            ajax.request();
        },
        detailFilter: function (result) {
            result.orgLogo = config.imageUrl + result.orgInfoResponse.orgLogo + '?f=png';
            result.orgName = result.orgInfoResponse.orgName;
            result.tagListTpl = _.map(result.tagList, function (item) {
                return "<span>" + item + "</span>";
            }).join("\n");//自定义标签
            //剩余额度:总金额减去已购买金额
            result.remainingBalance = Math.round((result.buyTotalMoney - result.buyedTotalMoney) * 100) / 100;
            //选取金额限制(orgAmountLimit)和剩余金额(remainingBalance)中数值小的(在!空的情况下 如果为空 则去另外一个)
            result.orgAmountLimit = result.orgInfoResponse.orgAmountLimit;
            if (result.remainingBalance && (!result.orgAmountLimit)) {
                result.saleAmout = utils.formatAmount(result.remainingBalance);
            } else if (result.orgAmountLimit && (!result.remainingBalance)) {
                result.saleAmout = utils.formatAmount(result.orgAmountLimit);
            } else if (!(result.remainingBalance || result.orgAmountLimit)) {
                result.saleAmout = "不限";
            } else if (result.remainingBalance > result.orgAmountLimit * 1) {
                result.saleAmout = utils.formatAmount(result.orgAmountLimit);
            } else if (result.remainingBalance <= result.orgAmountLimit * 1) {
                result.saleAmout = utils.formatAmount(result.remainingBalance);
            }
            //产品进度
            if (!result.isHaveProgress) {
                result.progressClass = "block";
                if (result.buyTotalMoney - result.buyedTotalMoney < 0) {
                    result.percentage = 100 + '%';
                } else {
                    result.buyedTotalMoney = result.buyedTotalMoney || 0;
                    result.buyTotalMoney = result.buyTotalMoney || 1;
                    result.percentage = parseInt(result.buyedTotalMoney / result.buyTotalMoney * 100) + "%";
                }
            } else {
                result.progressClass = "none";
                result.percentage = "";
            }
            //产品总额度
            result.buyTotalMoney = utils.formatAmount(Math.floor(result.buyTotalMoney / 10000)) + "<span>万</span>";
            //产品期限
            var deadLineArr = result.deadLineValueText.split(',');
            //固定期限
            if (deadLineArr.length === 2) {
                result.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>';
            }
            //浮动期限
            if (deadLineArr.length === 4) {
                result.deadLineText = deadLineArr[0] + '<span>' + deadLineArr[1] + '</span>~' + deadLineArr[2] + '<span>' + deadLineArr[3] + '</span>';
            }
            //年化收益
            if (result.isFlow == "1") {
                result.yearRate = result.flowMinRate.toFixed(2);
            } else {
                result.yearRate = result.flowMinRate.toFixed(2) + '~' + result.flowMaxRate.toFixed(2);
            }
            //购买人数
            result.buyedTotalPeople = utils.formatAmount(result.buyedTotalPeople, true);
            return result;
        }
    };

    detail.init();
});
