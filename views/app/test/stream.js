let Writable = require('stream').Writable;//构建一个
let util = require('util');
// 构造call Writable函数
function MyWritable(options) {
    Writable.call(this, options);
}
//继承Writable
util.inherits(MyWritable, Writable);
MyWritable.prototype._write = function(chunk, encoding, callback) {
console.log("被写入的数据是:", chunk.toString()); // 此处可对写入的数据进行处理
callback();
};
process.stdin.pipe(new MyWritable()); // stdin作为输入源，MyWritable作为输出源
