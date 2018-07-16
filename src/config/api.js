define(function(require, exports, module) {
    module.exports = api = {
        // 登录
        login : "user/login",

        // 微信登录
        weChatLogin : "user/wechat/login",

        // 发送验证码
        sendVcode : "user/sendVcode",

        // 用户注册
        register : 'user/register',

        // 重置登录密码
        resetLoginPwd : 'user/resetLoginPwd',

        // 修改登录密码
        modifyLoginPwd : 'user/modifyLoginPwd',

        // 微信分享
        wechatShare: 'user/wechat/share',

        // 用户是否注册
        checkMobile : 'user/checkMobile',

        // 获取配置信息
        getDefaultConfig  : 'app/default-config',

        //下载app列表
        downloadAppList : 'app/downloadAppList',

        //获取机构banner
        banners : "homepage/advs",

        //获取优质平台
        hotPlatform : 'platfrom/highQualityPlatform',

        //热门产品列表
        hotProduct : 'product/hotProduct',

        // 平台在售产品
         platformSaleProducts:'platfrom/platformSaleProducts',

        //产品列表
        productPageList : 'product/productPageList',

        //产品详情
        productDetail : 'product/productDetail',

        // 精选产品
        selectProduct:'product/selectProduct',
        
        // 产品筛选-分页
        screenPageList:'product/screenPageList',

        // 产品筛选条件
        productHead:'product/productHead',
        
        // 产品购买记录列表
        productInvestList:'product/productInvestList',

        // 产品分类统计
        productClassifyStatistics : 'product/productClassifyStatistics/2.0.1',

        //产品分类列表
        productClassifyPageList:'product/productClassifyPageList',
        
        //是否实名验证
        personAuthenticate  : 'account/personcenter/setting',

        //获取用户信息
        getUserInfo : 'user/getUserInfo', 

        //默认配置
        defaultConfig : 'app/default-config',

        //检查是否有注册第三方账户
        isBindOtherOrg : 'platfrom/isBindOrgAcct',

        //绑定第三方账户
        bindOrgAcct :'platfrom/bindOrgAcct',

        //获取第三方购买路径
        getOrgProductUrl : 'platfrom/getOrgProductUrl',

        //获取第个人中心路径
        getOrgUserCenterUrl : 'platfrom/getOrgUserCenterUrl',

        //筛选条件
        platformHead           : 'platfrom/platformHead',

        //机构列表
        'platfromList'         : 'platfrom/pageList',

        // 最新入驻机构
        queryLatestOrg:      'platfrom/queryLatestOrg',
        
        //机构详情
        platfromDetail       : 'platfrom/pcOrgDetail',

        //机构在售产品
        'productPageList' : 'product/productPageList',

        //是否实名验证
        personAuthenticate  : 'account/personcenter/setting',

        //检查是否有注册第三方账户
        isBindOtherOrg : 'platfrom/isBindOrgAcct',

        //绑定第三方账户
        bindOrgAcct :'platfrom/bindOrgAcct',

        //是否第三方老用户
        isExistInPlatform : 'platfrom/isExistInPlatform',

        //获取第三方购买路径
        getOrgProductUrl : 'platfrom/getOrgProductUrl',

        //获取第个人中心路径
        getOrgUserCenterUrl : 'platfrom/getOrgUserCenterUrl',

        //我的
        minePage      : 'personcenter/homepage',

        //未读公告通知
        unreadCount   : 'msg/person/unreadCount',

        //公告
        bulletinList  : 'msg/bulletin/pageList',

        //通知
        personList    : 'msg/person/pageList',

        //通知设置已读
        readed        : 'msg/person/readed',

        //通知全部设置已读
        allReaded     : 'msg/person/allReaded',

        //公告详情
        noticeDetail :  'msg/notice/detail' ,

        //公告邻近记录
        nearNotice:    'msg/notice/nearNotices',

        //公告设置已读
        noticeReaded :  'msg/person/readed',

        //公告全部设置已读
        noticeAllReaded     : 'msg/notice/allReaded',

        //是否设置交易密码
        verifyPayPwdState : 'account/verifyPayPwdState',

        //平台管理
        platfromManager : 'platfrom/accountManager/pageList',

        //平台绑定
        bindOrgAcct : 'platfrom/bindOrgAcct',

        //绑定平台统计
        platormStatistics  : 'platfrom/accountManager/statistics',

        //投资记录
        customerInvestRecord : 'investRecord/customer/investRecord',
        
        //投资记录（其他）
        unRecordInvestList : 'investRecord/customer/unRecordInvestList',

        //投资记录（分类数量）
        investRecordCounts : ' investRecord/customer/investRecordCounts',

        //验证支付密码
        verifyPayPwd : 'account/verifyPayPwd',

        //修改支付密码
        modifyPayPwd : 'account/modifyPayPwd',

        //重置交易密码验证身份证
        verifyIdCard : 'account/verifyIdCard',

        //重置交易密码验证身份证
        resetPayPwd : ' account/resetPayPwd',   

        //重置支付密码-点击手机发送验证码
        accountSendVcode:'account/sendVcode', 

        //重置支付密码-输入手机验证-已实现
        inputVcode:'account/inputVcode', 

        //小金库账户
        account : 'account/myaccount',

        //我的理财师
        minePlanner : 'user/mycfp',

        //理财师推荐产品列表
        recdProductPageList : 'product/productClassifyPageList/2.0.1',
        
        //理财师推荐
        plannerRecommendPlatfrom : '/platfrom/queryPlannerRecommendPlatfrom',

        //红包
        queryRedPacket : 'redPacket/queryRedPacket',

        //邀请有理
        invitation : 'invitation/customer/homepage',

        //邀请列表
        invitationList : 'invitation/investor/pageList',

        //邀请统计
        invitationstatistics: 'invitation/investor/statistics',

        // 微信分享
        wechatShare : 'invitation/wechat/share',

        //获取系统默认信息
        defaultConfig : 'app/default-config',

        // 退出登录
        logout : "user/logout",

        //已经反馈
        feedback : "app/suggestion",

        //账户明细
        accountDetailList : 'account/myaccountDetail/pageList',

        // 查询账户类型
        queryAccountType : 'account/queryAccountType',

        //账户提现记录
        withdrawHistory : 'account/queryWithdrawLog',

        //提现累计
        withdrawSummary : 'account/getWithdrawSummary',

        //查询银行
        queryAllBank : 'account/queryAllBank',

        //添加银行卡
        addBankCard : 'account/addBankCard',

        //查询用户办卡信息
        getUserBindCard : 'account/getUserBindCard',

        //设置支付密码
        initPayPwd      : 'account/initPayPwd',

        //我的账户
        myaccount : 'account/myaccount',

        //提现银行卡信息
        getWithdrawBankCard : 'account/getWithdrawBankCard',

        //查询省份
        queryAllProvince : 'account/queryAllProvince',

        //查询城市
        queryCityByProvince : 'account/queryCityByProvince',

        //提现
        userWithdrawRequest : 'account/userWithdrawRequest',

        //网贷新闻列表
        //
        netloanNews : 'dynamicnews/netloanNews/pageList',
        
        //网贷新闻详情
        netloanNewsDetail : '/dynamicnews/netloanNews/detail',
        
        //T呗动态
        toobeiMove : 'dynamicnews/pageList',

        //t呗动态详情
        dynamicDetail:'dynamicnews/detail',

        //T呗动态邻近记录
        dynamicNearNews:'dynamicnews/nearNews',

        //网贷平台列表
        loanOrgList:'jpress/jpplatform/pageList',

        // 网贷平台检索条件
        loanOrgSearch:'jpress/jpplatform/platformHead',
    };
});