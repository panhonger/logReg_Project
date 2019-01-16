let mysql = require('mysql');
let $util = require('../utils/mysql_util');
const db = $util.db();

module.exports = {
    //好友列表
    findUsersModel:function (cb) {
        let sql_users = 'select * from user';
        db.query(sql_users,[]).then(data =>{
            console.log("data1:"+JSON.stringify(data));
            cb(data)
        })
    },
    //发送消息
    upChatCordModel:function (params, cb) {
        console.log("can:"+JSON.stringify(params));

        let param = [params.myserverid,params.content,params.myDate,params.youserverid];
        let sql_content = `insert into chatrecord(serverid,lr,data,toserver) VALUES(?,?,?,?)`;
        db.query(sql_content,param).then(result =>{
            if(result){
                cb({success:true,code:'0000',msg:"插入成功"})
            }else {
                cb({success:false,code:'1000',msg:"插入成功"})
            }
        })
    }
};