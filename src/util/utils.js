define(function(require, exports, module) {
	module.exports = {
		setCookie : function(name,value,expiredays){
			var date = new Date()
			date.setDate(date.getDate() + expiredays)
			var reg = /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/;
			if(document.domain && (document.domain === "localhost" || reg.test(document.domain))){
			    //如果document.domain是localhost或ip就不做cookie domain限制
				document.cookie = name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + date.toGMTString())+";path=/";
			}else{
				document.cookie = name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + date.toGMTString())+";path=/;domain=.toobei.com";
			}

		},

		getCookie : function (name){
			if (document.cookie.length>0){
				start=document.cookie.indexOf(name + "=")
				if (start!=-1){ 
					start=start + name.length+1 
					end=document.cookie.indexOf(";",start)
					if (end==-1) end=document.cookie.length
					return unescape(document.cookie.substring(start,end))
				} 
			}
			return ""
		},
		
		getQueryString : function (search) {
			var url = decodeURIComponent ( search || location.search );
			var request = {};
			if (url.indexOf("?") != -1) {
			  var str = url.substr(1);
			  arr = str.split("&");
			  for(var i = 0; i < arr.length; i ++) {
			     request[arr[i].split("=")[0]] = unescape(arr[i].split("=")[1]);
			  }
			}
			return request || {};
		},

		dealThePhone : function(phone) {
		    if(phone) {
		        var phone = phone.replace(/\s/g,"");
		        return phone.substr(0, 3) + "****" + phone.substr(phone.length-4, 4);
		    }
		},
		
		/*
		* 对Email地址进行掩码处理
		* 
		* 入参：
		*      email：Email地址
		* 
		* 返回：
		*      进行掩码处理后的Email地址
		*/
		dealTheEmail : function(email) {
			if(email) {
			    var email = email.replace(/\s/g,"");
			    var name  = email.split("@")[0];
			    var url   = email.split("@")[1];
			    if(name.length>2){
			        return name.substr(0, 2) + "****@" + url;
			    }else{
			        return name.substr(0, 1) + "****@" + url;
			    }
			}
		},

		/*
		* 对银行账号进行掩码处理
		* 
		* 入参：
		*      accNo：银行账号
		* 
		* 返回：
		*      accNo : 进行掩码处理后的账号
		*/
		dealTheAccNo : function(accNo) {
			try {
			    var accNo = accNo.replace(/\s/g,"");
			    var numLength = accNo.length;
			    if(numLength < 8) {
			        return accNo;
			    }
			    return accNo.substr(0, 4) + "********" + accNo.substr(accNo.length-4, 4);
			} catch(err) {
			    return accNo;
			}
		},

		/*
		* 格式化银行账号（每隔4位加一个空格）
		* 
		* 入参：
		*      accNo：银行账号
		* 
		* 返回：
		*      formatAcc : 格式化后的账号
		*/
		formatAccount : function(accNo){
			var formatAcc = "";
			if(!accNo || $.trim(accNo)===""){
			    return formatAcc;
			}
			var accNo = $.trim(accNo.replace(/\s/g, ""));
			var accLength = accNo.length;
			var accArray = [];
			// 获取需要的空格数
			var spaceCount = (accLength % 4 == 0) ? parseInt(accLength/4)-1 : parseInt(accLength/4);
			for(var i=0; i<spaceCount; i++){
			    // 每4位数添加进数组
			    var fourNumbers = accNo.substr(i * 4, 4);
			    accArray.push(fourNumbers);
			}
			// 添加最后的几位数（1~4位）
			accArray.push(accNo.substring(spaceCount * 4, accLength));

			// 组装成格式化账号
			formatAcc = accArray.join(" ");

			return formatAcc;
		},
		/*
		* [金额每三位加一个逗号]
		* @method formatAmount
		* @param {number} amt [数值]
		* @param {boolean} bool [判断是否取两位小数,默认为undefined或false 取两位小数,如果不取,设为true]
		* @return {string|number} [格式化后的数值]
		*/
		formatAmount : function(amt,bool){
			if(amt && !isNaN(amt)){
				amt = bool ? new String($.trim(Math.round(amt))):new String($.trim(Math.round(amt).toFixed(2)));
				return amt.split('').reverse().join("").replace(/(\d{3})(?=\d)/g, '$1,').split('').reverse().join("");
			}else{
				return amt;
			}
		},

		pointOutBindCard:function(){
			$("#bindingCard").mouseenter(function(){
                $('.bindingCardTips').show();
                $('.goAuthentication').hide();
            })
            $(".headertop").mouseleave(function(){
                $('.bindingCardTips').hide();
                $('.goAuthentication').hide();
            })
            $("#usernameAuthentication").mouseenter(function(){
                $('.goAuthentication').show();
                $('.bindingCardTips').hide();

            })
		},
		/*
		* [数据为空时展示的模板]
		* @method noDataTpl
		* @param {string}  text [展示的文本]
		* @param {boolean} bool [模板是否包含ul标签,默认为空,包含ul标签]
		* @return {string} [空数据模板]
		* */
		noDataTpl:function(text,bool){
			if(bool){
				return '<li class="no-data-tpl"><p>'+text+'</p></li>';
			}else{
				return '<ul><li class="no-data-tpl"><p>'+text+'</p></li></ul>';
			}
		}
    };     
});
