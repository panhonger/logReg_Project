let express = require('express');
let router = express.Router();
let sdate = require("silly-datetime");//时间换转化模块

const appUtils = require('../utils/app_utils');
const service = require('../services/socket_service');

//登录跳转
router.get("/toOthersLog",function (req,res) {
    res.render("app/project_bz/login-bz") ;
});
//注册跳转
router.get("/toOthersReg",function (req,res) {
    console.log("ahhaha")
    res.render("app/project_bz/registerBz") ;
});
//主页跳转
router.get("/toOthersIndex",function (req,res) {
    console.log("aeeea");
    res.render("app/project_bz/homeBz") ;
});


//####################################分割线############################################

//好友列表
router.get('/allusers',function (req,res,next) {
    try {
        service.findUsers(function (resp) {
            //console.log("resp:"+JSON.stringify(resp));
            appUtils.respJsonData(res,resp)
        });
    }catch (e){
        console.log("err:"+e);
        appUtils.respMsg(res, false, err.code, `查询数据发生错误`, null, err)
    }

});

router.post('/upChatreCord',function (req,res,next) {//将聊天数据添加到数据库中
    try {
        let myserverid = req.body.myserverid;//自己的id
        let youserverid = req.body.youserverid;//与你聊天的人的id
        let content = req.body.content;//聊天内容
        //let body = req.body;
        let myDate = new Date();
        //myDate = sdate.format(myDate,'YYYY年MM月DD日 hh:mm:ss');//当期时间

        let params = {myserverid,youserverid,content,myDate};
        console.log('params:'+JSON.stringify(params));
        service.upChatCord(params,function (resp) {
            console.log('respchat:'+JSON.stringify(resp));
            appUtils.respJsonData(res,resp)
        });
    }catch (e){
        console.log("err:"+e);
        appUtils.respMsg(res, false, err.code, `插入数据发生错误`, null, err)
    }

});
module.exports = router;