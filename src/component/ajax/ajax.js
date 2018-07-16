define(function(require, exports, module) {
    var layer = require("/component/layer/layer");
    var config = require("/config/config");
    var utils = require("/util/utils");
    /**
     * 参数描述
     * type     : post 与 get 提交
     * dataType : 返回的数据格式
     * timeout  : 请求超时时间
     * async    : 异步 true 与 false
     * data     : 提交参数
     * url      : 请求的url
     * isNeedToken :  true 与 false 是否需要token
     * isLoadMask  :  true 与 false 是否需要loadding标识
     */
    function Ajax() {
        this.isNeedToken = false,
        this.isLoadMask = true,
        this.isGoToLogin = true,
        this.data = {};
        this.option = {};
        this.defaults = this.getDefault();
    }

    Ajax.prototype = {

        constructor: Ajax,

        request: function() {
            var self = this;
            var xhr = $.ajax(this.setting());
            xhr.done(function(data, status, xhr) {
                self.complete("success", data);
            });
            xhr.fail(function(xhr, status) {
                self.complete(status);
            });
        },

        setting: function() {
            if (this.isLoadMask) this.layerIndex = layer.load(3);
            return _.extend({}, this.defaults, this.normalizeParameter());
        },

        normalizeParameter: function() {
            if (this.type) this.option.type = this.type;
            if (this.dataType) this.option.dataType = this.dataType;
            if (this.timeout > 0) this.option.timeout = this.timeout;
            if (this.async === false) this.option.async = false;
            if (this.cache) this.option.cache = true;
            //if (this.isNeedToken) this.defaults.data['token'] = utils.getCookie('token');
            this.option.url = config.httpsServerUrl + this.url + "?t=" + Date.now();
            _.extend(this.defaults.data, this.data);
            return this.option;
        },

        complete: function(status, data) {
            if (this.isLoadMask) {
                layer.close(this.layerIndex);
            }

            if (status === "success") {
                this.succeed(data);
            } else {
                var message = "";
                if (status === "parseerror") message = "响应数据格式异常";
                if (status === "timeout") message = "请求超时，请重试";
                if (status === "offline") message = "网络连接失败，请检查你的网络设置";
                this.fail(message, data);
            }

            if (config.environment != "produce") {
                console.log(this.url + ' : ');
                console.log(data);
            }
        },

        succeed: function(data) {
            if (data && data.code == "100003") {
                this.isGoToLoginPage(data);
            } else if (data && data.code == "0") {
                typeof this.success == 'function' && this.success(data.data);
            } else {
                if (_.isArray(data.errors) && data.errors.length > 0) {
                    this.fail(data.errors[0].msg, data);
                } else {
                    this.fail(data.msg, data);
                }
            }
        },

        isGoToLoginPage: function(data) {
            if (this.isGoToLogin) {
                if (this.back) {
                    location = "/module/user/login.html?back=true";
                } else {
                    location = "/module/user/login.html";
                }
            } else {
                typeof this.success == 'function' && this.success(data);
            }
        },

        fail: function(message, data) {
            message = message || "系统异常，请稍后重试！";
            if (typeof this.error == 'function') {
                this.error(message, data);
            } else {
                layer.msg(message)
            }
        },

        getTimestamp: function() {
            var d = new Date();
            var o = {};
            o.y = d.getFullYear();
            o.m = d.getMonth() + 1;
            o.d = d.getDate();
            o.h = d.getHours();
            o.min = d.getMinutes();
            o.s = d.getSeconds();
            return o.y + '-' + o.m + '-' + o.d + ' ' + o.h + ':' + o.min + ':' + o.s;
        },

        getDefault: function() {
            return {
                type: "POST",
                dataType: "JSON",
                timeout: 30000,
                async: true,
                cache: false,
                data: {
                    orgNumber: 'App_investor_web',
                    appKind: 'investor',
                    appClient: 'web',
                    appVersion: '1.0.0',
                    v: '1.0.0',
                    timestamp: this.getTimestamp(),
                    token : utils.getCookie('token')
                }
            }
        }
    }
    module.exports = Ajax;
});
