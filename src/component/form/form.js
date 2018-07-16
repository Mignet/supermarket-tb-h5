define(function(require, exports, module) {
	var Ajax = require('/component/ajax/ajax');
	/**
	 * form组件说明
	 * 1、校验区域必须以form标签包裹
	 * 2、使用说明:
	 * <input type="text" name="mobile" required="true" pattern="^1\d{10}$" repeat="true" for="password" label="手机号码" after="true"/>
	 * name     : 必须字段，与提交接口参数名称对应
	 * required : 非空校验
	 * pattern  ：正则校验
	 * repeat   ：确认密码与密码 校验，配合for使用,for为密码文本框的ID
	 * label    ：文本框名称，用于提示
     * after    : 表示在文本框后面提示校验错误信息
     * border   : 'parent'
	 * form 组件只对外开放 isPass , getFormData方法
	 * isPass方法：确认全局是否验证通过
	 * getFormData方法：获取全局的input select textarea的框的值
	 *
	 * 可能有很多场景不适用，遇到时完善...
	 * 
	 */
    var form = module.exports = {
        init : function(){
            this.ele = $(document).find('.form');
            for(var i = 0; i < this.ele.length ; i++){
                var formElement = $(this.ele[i]);
                formElement.find('input[type=number]').on('keypress',this._onKeypress);
                formElement.find('input[type=text]').on('focus',this._onfocusEvent);
                formElement.find('input[type=text]').on('blur',this._onblurEvent);
                formElement.find('input[type=password]').on('focus',this._onfocusEvent);
                formElement.find('input[type=password]').on('blur',this._onblurEvent);
                formElement.find('textarea').on('focus',this._onfocusEvent);
                formElement.find('textarea').on('blur',this._onblurEvent);
                formElement.find('select').on('focus',this._onfocusEvent);
                formElement.find('select').on('blur',this._onblurEvent);                
                formElement.find('.smsCodeBtn').on('click',this._smsOnclickEvent);    
                //formElement.find(formElement.find('.smsCodeBtn').attr('for')).on('keyup',this._activeSmsSendButton);
            }
        },
        
        /**
         * 获得焦点事件
         * @return {[type]} [description]
         */
        _onfocusEvent : function(){
            var novalidate = $(this).attr("novalidate");
            if(typeof novalidate == "undefined"){
                $(this).parent().removeClass('onerror').addClass('onfocus');                 
            };
        },

        /**
         * 失去焦点事件
         * @return {[type]} [description]
         */
        _onblurEvent : function(){
            var novalidate = $(this).attr("novalidate");
            if(!(typeof novalidate == "undefined")) return;
            var $this    = $(this);
            var parent   = $this.parent().removeClass('onfocus');
            var value    = $this.val();
            var required = $this.attr('required');
            var pattern  = $this.attr('pattern');
            var repeat   = $this.attr('repeat');
            var formElement   = $this.closest('form');
            var errorWrapper  = formElement.find('.errorWrapper');
            formElement.find('.onerror').removeClass('onerror');
   
            if(required){
                if(value){
                   errorWrapper.empty();
                }else{
                   parent.addClass('onerror');
                   form._assistRequired($this,errorWrapper);
                   return false;
                }                
            }

            if(pattern){
                if(new RegExp(pattern).test(value)){
                   errorWrapper.empty();
                }else{
                   parent.addClass('onerror');
                   form._assistPattern($this,errorWrapper);
                   return false;
                }                               
            }

            if(repeat != undefined){
                var target = '#' + $this.attr('for');
                var val = formElement.find(target).val();
                if(val == value){
                    errorWrapper.empty();
                }else{
                    parent.addClass('onerror');
                    form._assistRepeat($this,errorWrapper);
                    return false;
                }
            }
        },

        _activeSmsSendButton : function(){
            var $this = $(this);
            var thisButton     = $this.closest('form').find('.smsCodeBtn');
            var thisPattern  = new RegExp($this.attr('pattern'));
            var thisVaule    = $this.val();
            if(!thisButton.hasClass('sended')){
                if(thisPattern.test(thisValue)){
                    thisButton.removeClass('sended').addClass('send');                    
                }else{
                    thisButton.removeClass('send').removeClass('sended');
                }                             
            }            
        },
        
        /**
         * 必填项 检查是否 为空 辅助方法
         * @param  {[type]} $this [description]
         * @return {[type]}       [description]
         */
        _assistRequired : function($this,wrapper){
            var placeholder = $this.attr('placeholder');
            // var type     = $this.attr('type');
            // var label    = $this.attr('label');
            // if(type == 'select'){
            //     label = '请选择' + label;
            // }else{
            //     label = placeholder;
            // }
            wrapper.html('<i class="errorImg"></i><span class="error">'+placeholder+'</span>');
        },

        /**
         * 正则表达式验证 辅助方法
         * @param  {[type]} $this [description]
         * @return {[type]}       [description]
         */
        _assistPattern : function($this,wrapper){
            var label    = $this.attr('label');
            wrapper.html('<i class="errorImg"></i><span class="error">请输入'+label+'</span>');
        },

        /**
         * 密码与确认密码是否一样 辅助方法
         * @param  {[type]} $this [description]
         * @return {[type]}       [description]
         */
        _assistRepeat : function($this,wrapper){
            wrapper.html('<i class="errorImg"></i><span class="error">新密码与确认密码不一致</span>');
        },

        /**
         * keypress 事件，貌似有兼容性问题
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        _onKeypress : function(e){
             if($(this).attr('novalidate')) return;
             e = e || window.srcElement;
             if(e.which < 32 || e.charCode == 0 || e.ctrlKey || e.altKey){
                 return false;
             }

             if(!/^\d$/.test(String.fromCharCode(e.which))){
                if ( e && e.preventDefault ){
                    e.preventDefault();                   
                }else{                  
                    window.event.returnValue = false;
                }
                return false;
            }
        },

        _smsOnclickEvent : function(){
            var $this = $(this);
            if($this.hasClass('sended')) return false;
            var input = $($this.attr('for'));
            var reg = new RegExp(input.attr('pattern'));
            if(reg.test(input.val())){
                form._sendSmsVCode($this,input,reg);
            }else{
                var formElement = $this.closest('form');
                formElement.find('.onerror').removeClass('onerror');                
                input.parent().addClass('onerror');
                if(input.val()){
                    form._assistPattern(input,formElement.find('.errorWrapper'));
                }else{
                    form._assistRequired(input,formElement.find('.errorWrapper'));
                }
            }
        },


        _sendSmsVCode:function($this,input,reg){
            var ajax = new Ajax();
            ajax.url  = "user/sendVcode";
            if($(this).attr('token')){
                ajax.isNeedToken = true; 
            }  
            ajax.data = {
                mobile : input.val(),
                type   : $this.attr('classify')
            }
            ajax.success = function(data){                
                form._setIntervalCount($this,input,reg);
            };
            ajax.request();
        },
       
        _setIntervalCount : function($this,input,reg){
            var n = 60 ;
            var timer = setInterval(function(){
                n--;
                if(n<=0){
                    $this.removeClass('sended')
                    $this.text("重新发送") ;
                    clearInterval(timer) ;
                }else{
                    $this.addClass('sended');
                    $this.text('重新发送'+n+'s') ;
                }
            },1000);
        },

        isPass : function($this){
            var pass    = true;
            var form    = $this.closest('form');
            var element = form.find('input[required],textarea[required],select[required]');         
            for(var i = 0; i  < element.length; i++){
                var novalidate = $(element[i]).attr("novalidate");
                if(!(typeof novalidate == "undefined")) continue;
                $(element[i]).trigger('blur');
                if(form.find('.onerror').length > 0){
                    pass = false;
                    break;
                }                
            }
            return pass;
        },

        getFormData : function($this){
            var obj = {};
            var arr  = $this.closest('form').serializeArray();
            for(var i=0 ; i < arr.length; i++){
                obj[arr[i].name] = arr[i].value;
            }
            return obj;
        }
    };
    form.init()
});

