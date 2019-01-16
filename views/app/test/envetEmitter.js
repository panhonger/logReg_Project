//监听事件
let util = require('util');
let EventEmitter = require('events').EventEmitter;//定义一个子类
function MyEmitter(){//构造函数
    EventEmitter.call(this);
}
util.inherits(MyEmitter,EventEmitter);//继承
let em = new MyEmitter();
//on() 方法为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数
//emit() 按参数的顺序执行每个监听器，如果事件有注册监听返回 true，否则返回 false。
em.on('hello',function (data) {//接收事件并打印到控制台
    console.log('收到事件hello的数据:',data);
});
em.emit('hello', 'EventEmitter传递消息真方便!');

console.log('############################################################################');
let domain = require('domain');
let myDomain = domain.create();
myDomain.on('error', function(err){// 接收事件并打印
    console.log('domain接收到的错误事件:', err);
});
myDomain.run(function(){
    let emitter1 = new MyEmitter();
    emitter1.emit('error', '错误事件来自emitter1');
    let emitter2 = new MyEmitter();
    emitter2.emit('error', '错误事件来自emitter2');
});


