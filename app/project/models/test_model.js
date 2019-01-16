let mysql = require('mysql');
let $util = require('../utils/mysql_util');
const db = $util.db();

module.exports = {

    //查询数据库信息
    queryInfoModel:function (cb) {
        let sql_info = `SELECT t.username,t.identify,t.phone,t.email FROM user t`;
        db.query(sql_info,[]).then(data => {
            console.log("data:"+JSON.stringify(data));
            cb({success:true,code:'0000',msg:"查询成功",data:data})
        }).catch(error => {
            console.error(error);
            cb({success: false, code: '1000', msg: '查询数据异常'});
        });
    },
    //登录----根据名字查询
    queryByNameModel:function (params,cb) {
        let username = params.uname;

        let param = [username];
        let sql_info = `SELECT * FROM user t WHERE username = ?`;
        db.query(sql_info,param).then(data => {
            console.log("data:"+JSON.stringify(data));
            cb(data)
        }).catch(error => {
            console.error(error);
            cb({success: false, code: '1000', msg: '查询数据异常'});
        });
    },
    //更新状态
    updataState:function (id, cb) {
        let param = [id];
        let sql_state = `UPDATE user t set t.state = 1 WHERE t.id = ?`;
        db.query(sql_state,param).then(result =>{
            if(result){
                cb(result);
            }else {
                cb({success: false, code: '1001', msg: '状态更改失败！'})
            }
        })
    },
    //查询id
    queryId:function (cb) {
        let id = 0;
        let sql_id = `SELECT MAX(t.id) AS id FROM user t`;
        db.query(sql_id,[]).then(data =>{
            if(!data[0].id){
                id++;
                id = id;
            }else {
               let data_id = data[0].id;
               data_id++;
               id = data_id;
            }
            console.log("id:"+JSON.stringify(id));
            cb({success:true,code:'0000',msg:"查询成功",id:id})
        }).catch( err =>{
            console.log("err:"+err);
            cb({success:false,code:'1001',msg:"查询成功",err})
        })
    },
    //注册
    regModel:function (body, id, cb) {

        let params = [id, body.username, body.password, body.phone, body.email, body.identify, body.repassword,body.state];
        console.log("params:"+JSON.stringify(params))
        let sql_reg = `INSERT INTO user VALUES(?,?,?,?,?,?,?,?)`;
        db.query(sql_reg,params).then(result =>{
            if(result){
                console.log("re:"+JSON.stringify(result))
                cb({success:true,code:'0000',msg:"注册成功"})
            }else {
                cb({success:false,code:'1002',msg:"注册失败"})
            }
        })
    },
    //手机验证码根据手机查找
    findByPhone:function (newPhone, cb) {
        let param = [newPhone];
        let sql_phone = `SELECT t.username,t.phone FROM user t WHERE t.phone = ?`;
        db.query(sql_phone,param).then(data =>{
            cb({success:true,code:'0000',msg:"查询成功",data})
        }).catch( err =>{
            console.log("err:"+err);
            cb({success:false,code:'1001',msg:"查询成功",err})
        })
    },
    //修改密码时根据名字查询
    findPwdByNameModel:function (body, cb) {
        let password = body.password;
        let repassword = body.repassword;
        let nameOrPhone = body.nameOrPhone;
        let param = [password,repassword,nameOrPhone];

        let sql_byName = `UPDATE user t SET t.password = ?,t.repassword=? WHERE t.username = ?`;
        db.query(sql_byName,param).then(data =>{
            console.log("hshshwwww:"+JSON.stringify(data));
            cb({success:true,code:'0000',msg:"修改密码成功"})
        }).catch( err =>{
            console.log("err:"+err);
            cb({success:false,code:'1006',msg:"修改密码失败",err})
        })
    },
    //修改密码时根据手机号码查询
    findPwdByPhoneModel:function (body, cb) {
        let password = body.password;
        let repassword = body.repassword;
        let nameOrPhone = body.nameOrPhone;
        let param = [password,repassword,nameOrPhone];

        let sql_byPhone = `UPDATE user t SET t.password = ?,t.repassword=? WHERE t.phone = ?`;
        db.query(sql_byPhone,param).then(data =>{
            console.log("hshshssss:"+JSON.stringify(data));
            cb({success:true,code:'0000',msg:"修改密码成功"})
        }).catch( err =>{
            console.log("err:"+err);
            cb({success:false,code:'1007',msg:"修改密码失败",err})
        })
    },
    //生成随机数
    createSixNum:function (cb) {
        let Num="";
        for(let i=0;i<6;i++)
        {
            Num+=Math.floor(Math.random()*10);
        }
        cb({Num});
    },

    insertCode:function (resp, email, cb) {
        let username = 'panzi';
        let params = [resp ,panzi];

        let sql_reg = `INSERT INTO user(email_code) VALUES(?) where username = ?`;
        db.query(sql_reg,params).then(result =>{
            if(result){
                cb({success:true,code:'0000',msg:"成功"})
            }else {
                cb({success:false,code:'1002',msg:"失败"})
            }
        })
    }
};