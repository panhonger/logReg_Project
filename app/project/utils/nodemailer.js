const nodemailer = require('nodemailer');

//����һ��smtp������
const config1 = {
    host: 'smtp.163.com',
    port: 465,
    auth: {
        user: 'tibbers_blue@163.com', //ע���163�����˺�
        pass: 'jinmoxuan818' //�������Ȩ�룬����ע��ʱ������,���㿪����stmp������Ȼ�ͻ�֪����
    }
};
// ����һ��SMTP�ͻ��˶���
const transporter = nodemailer.createTransport(config1);

//�����ʼ�
module.exports = function (mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};
