/*倒计时*/
define(function(require,exports,module){
    /*
    * [参数描述]
    * options
    * @param {string}    saleTimeStr [销售开始时间]
    * @param {string}    nowTimeStr  [现在时间]
    * @param {object}    ele         [展示倒计时的元素节点]
    * @param {function}  callback    [回调函数]
    ************************************************************************
    * @param {number} saleTime [销售开始时间毫秒数]
    * @param {number} nowTime  [当前时间毫秒数]
    * @param {number} diffTime [相差毫秒数]
    * @param {function} timer  [倒计时计时器]
    * @param {number} hour|minute|second [时分秒]
    * */
    function Countdown(options){
        for(var key in options){
            this[key] = options[key]
        }
        this.init();
    }

    Countdown.prototype = {
        constructor:Countdown,
        saleTime:0,
        nowTime:0,
        diffTime:0,
        hour:0,
        minute:0,
        second:0,
        timer :"",
        init:function(){
            this.getData();
            this.start();
        },
        getData:function(){
            this.saleTime  = new Date(this.saleTimeStr.replace(/-/g, '/')).getTime();
            this.nowTime = new Date(this.nowTimeStr.replace(/-/g, '/')).getTime();
            this.diffTime = this.saleTime - this.nowTime;
        },
        start:function(){
            var self = this;
            $(this.ele).show();
            this.timer = setInterval(function(){
                self.diffTime -= 1000;
                self.hour = Math.floor(self.diffTime/(1000*60*60));
                self.minute = Math.floor((self.diffTime-(self.hour*1000*60*60))/(1000*60));
                self.second = Math.floor((self.diffTime-(self.hour*1000*60*60)-(self.minute*1000*60))/(1000));
                $(self.ele).text("倒计时:"+self.hour+":"+self.minute+":"+self.second).next().removeClass('block').hide();
                if(self.diffTime < 0){
                    $(self.ele).hide().next().addClass('block').show();
                    clearInterval(self.timer);
                    if( typeof self.callback == 'function' ){
                        self.callback();
                    }
                }
            },1000);
        }
    };
    module.exports = Countdown;
});