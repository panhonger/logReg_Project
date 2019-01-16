let models = require('../models/test_model');

class test_service {
    constructor() {} //是用于创建和初始化类中创建的一个对象的一种特殊方法

    //查询数据库信息
    queryInfoService(cb) {
         models.queryInfoModel(cb);
    }
    //登录----根据名字查询信息
    queryByNameService(query,cb){
        console.log("query12:"+JSON.stringify(query));
        models.queryByNameModel(query,function (resp) {
            console.log("dataresp:"+JSON.stringify(resp));
            let username = query.uname;
            let password = query.upwd;
            if(resp.length > 0){
                if(username == resp[0].username && password != resp[0].password){
                    cb({success: false, code: '1004', msg: '密码错误'})
                }
                else if(username == resp[0].username && password == resp[0].password){
                    let id = resp[0].id;
                    models.updataState(id,function (resp_state) {
                        if (resp_state){
                            cb({success: true, code: '0000', msg: '登录成功',resp:resp})
                        }else {
                            cb({success: true, code: '1005', msg: resp_state.msg})
                        }
                    })
                }
            }else {
                cb({success: false, code: '1003', msg: '该用户未注册'})
            }
        });
    }
    //注册
    regService(body, cb){
        models.queryId(function (resp_id) {
            console.log("resp_id:"+JSON.stringify(resp_id.id));
            if(resp_id.id){
                let id = resp_id.id;
                models.regModel(body, id, cb)
            }
        });
    }
    //验证手机号是否注册
    queryPhoneService(body ,cb) {
        let phone = body.phone;
        models.findByPhone(phone ,cb);
    }
    //手机号验证找回密码
    findPwdService(body, cb){
        let newPhone = body.newPhone;
        let inputData = body.nameOrPhone;
        models.findByPhone(inputData,function (resp) {
            if(resp.data.length > 0){
                if(inputData == resp.data[0].username){
                    models.findPwdByNameModel(body, cb)
                }else if(inputData == resp.data[0].phone){
                    models.findPwdByPhoneModel(body, cb)
                }
            }else {
                cb({success: false, code: '1008', msg: '该账号未注册'})
            }
        });

    }

    emailService(body, cb){
        let email = req.body.email;

        models.createSixNum(function (resp) {
            console.log("resp:"+JSON.stringify(resp));
            //去数据库中找有没有同名的用户名，这里就要自己写了，不同的数据库查询方法不同
            let mail = {
                // 发件人
                from: '<tibbers_blue@163.com>',
                // 主题
                subject: '接受凭证',//邮箱主题
                // 收件人
                to:email,//前台传过来的邮箱
                // 邮件内容，HTML格式
                text: '用'+resp+'作为你的验证码'//发送验证码
            };
            models.insertCode(resp, email,cb)
        });
    }

}

module.exports = new test_service();