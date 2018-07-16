define(function (require, exports, module) {
	function marquee(options) {
		for (key in options) {
			this[key] = options[key];
		}
		this.init();
	}

	marquee.prototype = {

		//构造函数
		constructor: marquee,

		//滚动dom
		dom: null,

		//插件高度
		height: 22,

		//滚动速度（多少ms滚动1px）
		speed: 50,

		//更换速度（多少ms换下一条）
		inter: 4000,

		//总条数
		count: 4,

		init: function () {
			this.marqueeText(this.dom, this.height, this.speed, this.inter, this.count);
		},

		//单行滚动
		scrollRow: function (dom, height, speed) {
			setTimeout(function () {
				dom.scrollTop++;
				if (dom.scrollTop % height !== 0) {
					this.scrollRow(dom, height, speed);
				}
			}.bind(this), speed);
		},

		//滚动
		marqueeText: function (dom, height, speed, inter, count) {
			this.scrollRow(dom, height, speed);
			setInterval(function () {
				this.scrollRow(dom, height, speed);
				if (dom.scrollTop === count * height) {
					dom.scrollTop = 0;
				}
			}.bind(this), inter);
		}

	}

	module.exports = marquee;
});