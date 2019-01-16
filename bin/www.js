#!/usr/bin/env node

/**
 * Module dependencies.
 */

let app = require('../app');
let debug = require('debug')('haha:server');
let http = require('http');

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3009');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

let io=require("socket.io").listen(server);
let usocket = {},user = [];
io.on('connection', (socket) =>{
    socket.on('new user', (uname,nick,uid,lcon) => {
        if(uid in usocket){
            delete(usocket[socket.uid]);
            for(let i=0;i<user.length;i++){
                if(parseInt(user[i].uid)==uid){
                    user.splice(i,1);
                    break;
                }
            }
        }
        socket.uid = uid;
        usocket[uid] = socket;
        let obj={uname:uname,nick:nick,uid:uid,lcon:lcon};
        user.push(obj);
        socket.emit('login',JSON.stringify(user));

    });
    socket.on('send private message', function(msg,ruid,suid,showTime,rname){
        if(ruid in usocket) {
            let nick="",
                lcon="",
                uname="";
            for(let i=0;i<user.length;i++){
                if(user[i].uid==suid){
                    nick=user[i].nick;
                    lcon=user[i].lcon;
                    uname=user[i].uname;
                    break;
                }
            }
            usocket[ruid].emit('receive private message', {msg:msg,nick:nick,lcon:lcon,uid:suid,rname:uname,time:showTime});
        }
        let userList=str+uname;
        pool.getConnection((err,conn)=>{
            if(err) throw err;
            let sql="INSERT INTO "+userList+" VALUES(null,?,?,?,?,now(),?,?,?)";
            conn.query(sql,[ruid,suid,msg,showTime,nick,lcon,true],(err,result)=>{
                conn.release();
            })
        });
        let friendList=str+rname;
        pool.getConnection((err,conn)=>{
            if(err) throw err;
            let sql="INSERT INTO "+friendList+" VALUES(null,?,?,?,?,now(),?,?,?)";
            conn.query(sql,[suid,ruid,msg,showTime,nick,lcon,false],(err,result)=>{
                conn.release();
            })
        })
    });
    socket.on('addFriend',function(remark,ruid,nick,uname,suid){
        usocket[ruid].emit('receive addFriend',{remark:remark,nick:nick,uname:uname,suid:suid});
    });
    socket.on('agree add friend msgBack',function(nick,suid,ruid,isAgree){
        usocket[ruid].emit('receive agree add friend msgBack',{nick:nick,ruid:ruid,suid:suid,isAgree:isAgree});
    });
    socket.on('disconnect', function(){
        //移除

        if(socket.uid in usocket){
            delete(usocket[socket.uid]);
            //user.splice(user.indexOf(socket.uid, 1));
        }
        for(let i=0;i<user.length;i++){
            if(socket.uid==user[i].uid){
                user.splice(i,1);
                break;
            }
        }
        socket.broadcast.emit('user left',socket.username)
    })

});
console.log("Listening on "+port);
