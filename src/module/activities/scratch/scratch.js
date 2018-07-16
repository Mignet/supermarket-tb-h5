define(function (require, exports, module) {
	var utils   = require('/util/utils');
 var Service 	 = require('/component/ajax/ajax');
 var Marquee     = require('./marquee');
 var WScratchPad = require('./wScratchPad');
	var utils    = require('/util/utils');

 var scratch = {
 	init: function() {
		utils.template();
 		this.enabled = true;

 		this.judgeUser();
 		this.bindEvent();
 		this.buildScratchPad('#scratch-pad');

 	},

 	startMarquee: function() {
 		var marqueeService = new Service();
 		marqueeService.url = 'activity/scratch/records';
 		// marqueeService.isNeedToken = true;
 		marqueeService.success = function(result) {
 			console.log(result);
 			// result = {"hasRecord":true,"winningRecords":[{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"},{"extends1":"","extends2":"","id":1016,"investscratchId":"9fbbea00bd9542de88fa6c8ca6d32db2","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":20.6,"winningTime":"2016-08-26 15:25:14"},{"extends1":"","extends2":"","id":1015,"investscratchId":"152ace0b8b1b4528a66dff7f603b7011","isshaved":1,"mobile":"18111111120","userId":"0891f28a9886436d9313ea0af073c7b8","winningAmt":8,"winningTime":"2016-08-26 15:08:00"}]};
 			if( result.winningRecords.length  > 0 ) {
 			var str = "";
 			for(var i = 0; i < result.winningRecords.length; i ++) {
 				str += '<li class="clearfix">';
 				str	+= '<div class="marquee-col">投资人' + result.winningRecords[i].mobile;
 				str	+= '</div><div class="marquee-col">刮中 <span class="money-color">' + result.winningRecords[i].winningAmt;
 				str	+= '元</span></div><div class="marquee-col">' + result.winningRecords[i].winningTime.substring(0, 10);
 				str	+= '</div></li>';
 			}

 			str += '<li class="clearfix">';
 				str	+= '<div class="marquee-col">投资人' + result.winningRecords[0].mobile;
 				str	+= '</div><div class="marquee-col">刮中 <span class="money-color">' + result.winningRecords[0].winningAmt;
 				str	+= '元</span></div><div class="marquee-col">' + result.winningRecords[0].winningTime.substring(0, 10);
 				str	+= '</div></li>';

 			$('#marquee-view').html(str);

 			new Marquee({
 				dom 	: document.getElementById('marquee-view'),
 				height 	: 50,
 				speed 	: 25,
 				inter 	: 4000,
 				count 	: result.winningRecords.length
 			});
 			} else {
 				$('#marquee-view').hide();
 			}

 		}
 		marqueeService.request();
 	},

 	judgeUser: function() {
 		var self = this;
		$('#marquee-view').hide();
 		if( !utils.getCookie('token') ) {
 			this.showNoLogin();
 			return ;
 		}
		$('#marquee-view').show();
		this.startMarquee();

 		var scratchService = new Service();
 		scratchService.url = 'activity/scratch/detail';
 		scratchService.isNeedToken = true;
 		scratchService.success = function(result){
 			console.log(result);
			// result = {
			// 		"availableScratchTime": 1,
			// 		"nextScratchMoney": 588,
			// 		"totalScratchTime": 3
			// 		};
			switch( result.totalScratchTime ) {
				case 0:
				case 1: {
					self.showNoInvest();
					break;
				}
				case 2: {
					if( result.availableScratchTime > 0 ) {
						$('.scratch-light .scratch-text').text('您拥有' + result.availableScratchTime + '次刮奖机会');	
						self.setMoney(result.nextScratchMoney);
						self.showScratch();
					} else {
						self.showTwoInvest();
					}
					break;
				}
				case 3: {
					if( result.availableScratchTime > 0 ) {
						$('.scratch-light .scratch-text').text('您拥有' + result.availableScratchTime + '次刮奖机会');	
						self.setMoney(result.nextScratchMoney);
						self.showScratch();
					} else {
						self.showNoChance();
					}
					break;
				}
			}
		}
		scratchService.onError = function(msg) {
			console.log(msg);
		}
		scratchService.request();
	},

	showNoLogin: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.no-login').show();
	},

	showNoInvest: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.no-invest').show();
	},

	showTwoInvest: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.two-invest').show();
	},

	showNoChance: function() {
		$('.scratch-light').hide();
		$('.scratch-dark').show().find('.scratch-box').hide();
		$('.no-chance').show();
	},

	showScratch: function() {
		$('.scratch-dark').hide();
		$('.scratch-light').show();
	},

	setMoney: function(money) {
		$('.scratch-back-text').text(money + '元现金奖励');
		$('.pop-text-red').text(money + '元');
		$('.pocket-money').text(money + '元');
	},

	showPop: function() {
		$('.pop-window').show();
	},

	bindEvent: function() {
		var self = this;

		$('.pop-know').on('click', function(){
			$('.pop-window').hide();
			//重置刮刮乐
			self.enabled = true;
			$('#scratch-pad').wScratchPad('reset');
			self.judgeUser();
		});

		$('.login-img').on('click', function(){
			location.href = '../user/login.html';
			// comm.goUrl('../user/login.html');
		});

		$('.invest-img').on('click', function(){
			location.href = '../product/list.html';
			// comm.goUrl('../financing/financing.html');
		});
	},

	scratchComplete: function() {
		
		var self = this;
		var completeService = new Service();
 		completeService.url = 'activity/scratch/winning';
 		completeService.isNeedToken = true;
 		completeService.success = function(result) {
 			self.showPop();
 		}
 		completeService.request();
	},

	buildScratchPad: function(id) {
		var self = this;
		$(id).wScratchPad({
			bg: './scratch/red.png',
			fg: './scratch/black.png',
			scratchMove: function (e, percent) {
				console.log(percent);
				if (percent > 40) {
					if( !self.enabled ) return ;
					self.enabled = false;
					this.clear();
					self.scratchComplete();

				}
			}
		});
	}
};




scratch.init();
});