define(function(require, exports, module) {
    
    var mode = {
        
        environment : '__ENV__'              
    }

    var host = {
        __ENV__ : 'pre.toobei.com',  // 默认本是 dev.toobei.com ，但环境不通过
        pre     : 'pre.toobei.com',                   
        produce : 'www.toobei.com'    
    }

    var imgHost = {
        __ENV__ : 'https://preimage.toobei.com/',
        pre     : 'https://preimage.toobei.com/',           
        produce : 'https://image.toobei.com/'       
    }

    module.exports = window.config = {

        environment    :  mode.environment,

        imgHost        :  imgHost,

        httpsServerUrl :  'https://' + host[mode.environment]  + '/toobeiapi/',

        vcodeUrl       :  'https://'  + host[mode.environment]  + '/toobeiimg/',

        imageUrl       :   imgHost[mode.environment]      
    }
  
    window.easemobim = window.easemobim || {};
    
    easemobim.config = {
      tenantId: '13522',
      dialogWidth:'600px',
      dialogHeight:'600px',
      soundReminder:true,
      visitor:{description: 'T呗PC官网'}
    };   
});
