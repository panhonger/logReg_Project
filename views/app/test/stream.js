let Writable = require('stream').Writable;//����һ��
let util = require('util');
// ����call Writable����
function MyWritable(options) {
    Writable.call(this, options);
}
//�̳�Writable
util.inherits(MyWritable, Writable);
MyWritable.prototype._write = function(chunk, encoding, callback) {
console.log("��д���������:", chunk.toString()); // �˴��ɶ�д������ݽ��д���
callback();
};
process.stdin.pipe(new MyWritable()); // stdin��Ϊ����Դ��MyWritable��Ϊ���Դ
