let express = require('express');
let router = express.Router();

const appUtils = require('../utils/app_utils');
const service = require('../services/test_service');

//跳转登录页面
router.get("/toLogPage",function(req, res){
    res.render("app/project/login")
});
//跳转注册页面
router.get("/toRegPage",function(req, res){
    res.render("app/project/register")
});
//跳转到主页
router.get("/toHomePage",function (req,res) {
    let users = req.query;
    let id = req.query.id;
    let user = req.session.user;
    console.log("S:"+JSON.stringify(users))
    res.render("app/project/home",{
        users:users.username,
        id:users.id,
       user:req.session.user
    })
});
//查询数据库信息
router.get("/toQueryInfo",function (req,res) {
   try {
       service.queryInfoService(function (resp) {
           console.log("resp:"+JSON.stringify(resp));
           appUtils.respJsonData(res,resp)
       })
   }catch (e){
       console.log("err:"+e);
       appUtils.respMsg(res, false, err.code, `查询数据发生错误`, null, err)
   }
});
//根据名字查询
router.get("/toQueryByName",function (req,res) {
    try {
        let query = req.query;
        console.log("respquery:"+JSON.stringify(query));
        service.queryByNameService(query,function (resp) {
            console.log("resp11:"+JSON.stringify(resp));
            appUtils.respJsonData(res,resp)
        })
    }catch (e){
        console.log("err:"+e);
        appUtils.respMsg(res, false, err.code, `查询数据发生错误`, null, err)
    }
});
//登录
router.get("/toLog",function (req,res) {
    try {
        let query = req.query;
        console.log("query11:"+JSON.stringify(query));
        service.queryByNameService(query,function (resp) {
            if(resp.success){
               let users = resp.resp[0];
                req.session.user = users;
                console.log("users:"+JSON.stringify(users));
            }
            console.log("resp11:"+JSON.stringify(resp));
            appUtils.respJsonData(res,resp)
        })
    }catch (e){
        console.log("e:"+e);
        throw e;
    }
});
//注册
router.post("/toReg",function(req, res){
   try{
       let body = req.body;
       console.log("_query:"+JSON.stringify(body))
       service.regService(body,function (resp) {
           console.log("_qrespqqq:"+JSON.stringify(resp))
           appUtils.respJsonData(res,resp)
       })
   }catch (err){
       console.log("err:"+e);
       appUtils.respMsg(res, false, err.code, `插入数据发生错误`, null, err)
   }
});
//跳转到找回密码主页
router.get("/toFindPwd",function (req,res) {
    res.render("app/project/findPwd")
});
//验证手机号是否注册
router.get("/toQueryPhone",function (req,res) {
    try{
        let body = req.query;
        console.log("_query:"+JSON.stringify(body))
        service.queryPhoneService(body,function (resp) {
            console.log("_qrespqqqssss:"+JSON.stringify(resp));
            appUtils.respJsonData(res,resp)
        })
    }catch (err){
        console.log("err:"+e);
        appUtils.respMsg(res, false, err.code, `插入数据发生错误`, null, err)
    }
});
//根据手机找回密码跳转页面
router.get("/toFindPwdByPhone",function (req,res) {
    let phone = req.query;
    console.log("jahah:"+JSON.stringify(phone));
    res.render("app/project/findPwdByPhone",{newPhone:phone.phone})
});
//手机号验证找回密码
router.post("/ByPhone",function (req,res) {
    try{
        let body = req.body;
        console.log("_quertre:"+JSON.stringify(body));
        service.findPwdService(body,function (resp) {
            console.log("_qresprtrtr:"+JSON.stringify(resp));
            appUtils.respJsonData(res,resp)
        })
    }catch (err){
        console.log("err:"+e);
        appUtils.respMsg(res, false, err.code, `插入数据发生错误`, null, err)
    }
});
//邮箱验证
router.get("/toFindPwdByEmail",function (req,res) {
   /* let email = req.query;
    console.log("jahahss:"+JSON.stringify(email));,{newEamil:email.email}*/
    res.render("app/project/findPwdPage")
});

router.post('/email',function (req,res) {
    try {
        let body = req.body;
        service.emailService(body,function (resp) {
            console.log("_qresprtrtr:"+JSON.stringify(resp));
            appUtils.respJsonData(res,resp)
        })
    }catch (e){
        console.log("err:"+e);
        appUtils.respMsg(res, false, err.code, `插入数据发生错误`, null, err)
    }

});


module.exports = router;