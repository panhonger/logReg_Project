let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');//2018-11-29
let session = require('express-session');//2018-11-29
let RedisStore = require('connect-redis')(session);//2018-11-29


let test_route = require('./app/project/routers/test_route');//������̨·�� 2018-11-20
let socket_route = require('./app/project/routers/socket_route');//������̨·�� 2018-11-27

let hbs = require('hbs');//����hbs 2018-11-20
let i18n = require('i18n');//���ʻ�

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

// 2018-11-20
i18n.configure({
    locales: ['zh_CN'],  // setup some i18n - other i18n default to en_US silently
    defaultLocale: 'zh_CN',
    directory: path.join(__dirname, 'views/common/i18n'),
    updateFiles: false,
    indent: "\t",
    extension: '.json'  // ���� JSON ������ע�ͣ������� js �᷽��һ�㣬Ҳ����д�������ģ������ļ���ʽ�� JSON
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');//2018-11-20

var i18n_helpers = new require('./views/common/helpers/i18n_helpers');//2018-11-20
hbs.registerHelper(i18n_helpers);//2018-11-20

//2018-11-20
hbs.registerHelper('ifCond', function (v1, v2, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

//2018-11-20
hbs.registerHelper('eq', function (v1, v2, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

//2018-11-20
hbs.registerHelper('neq', function (v1, v2, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    if (v1 != v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

//2018-11-20
hbs.registerHelper('containKey', function (v1, v2, v3, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    var super_users = config.routes.super_users;
    var is_super_user = false;
    if (super_users) {
        super_users.forEach(function (item) {
            // �����������Ƿ����ͨ���
            is_super_user = is_super_user || item == v3;
        });
    }
    if (is_super_user) {
        return options.fn(this);
    }
    if (v1) {
        if (v1.hasOwnProperty(v2)) {
            return options.fn(this);
        }
    }
    return options.inverse(this);
});

//��һ���쳣δ����,��v1 V2 Ϊ����ʱ�ᷢ���쳣  2018-11-20
hbs.registerHelper('ifContain', function (v1, v2, options) {

    if (v1.indexOf(v2) != -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});

//2018-11-20
hbs.registerHelper('isempty', function (v1, options) {
    if (!v1 || JSON.stringify(v1) == '{}') {
        return options.inverse(this);
    }
    return options.fn(this);
});

//json objectת��Ϊstring  2018-11-20
hbs.registerHelper('tostring', function (v1, options) {
    return JSON.stringify(v1);
});

//json objectת��Ϊtree�ṹ  2018-11-20
hbs.registerHelper('totree', function (v1, options) {
    return JSON.stringify(tree_utils.transData(v1, 'id', 'pid', 'children'));
});

//������1  2018-11-20
hbs.registerHelper("addOne", function(v1, options) {
    return parseInt(v1, 10) + 1;
});

// ��ʽ������ 2018-11-20
hbs.registerHelper("format", function (v1, options) {
    return moment(v1).format("YYYY-MM-DD HH:mm:ss");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//����cookie
app.use(cookieParser());
//2018 - 11-29 session������ʹ��
app.use(session({
    // store: new RedisStore(config.get('redis.session')),
    secret:'socketchat',//һ��String���͵��ַ�������Ϊ������������session��ǩ��
    resave:false,//(�Ƿ�����)���ͻ��˲��з��Ͷ������ʱ������һ����������һ���������ʱ��session�����޸ĸ��ǲ����档Ĭ��Ϊtrue
    saveUninitialized:false//��ʼ��sessionʱ�Ƿ񱣴浽�洢��Ĭ��Ϊtrue
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/mainPage', test_route);// ����·�� 2018-11-20
app.use('/chatPage',socket_route);// ����·�� 2018-11-27


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


console.log("__dirname:"+JSON.stringify(__dirname))
module.exports = app;
