let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');//2018-11-29
let session = require('express-session');//2018-11-29
let RedisStore = require('connect-redis')(session);//2018-11-29


let test_route = require('./app/project/routers/test_route');//创建后台路由 2018-11-20
let socket_route = require('./app/project/routers/socket_route');//创建后台路由 2018-11-27

let hbs = require('hbs');//设置hbs 2018-11-20
let i18n = require('i18n');//国际化

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
    extension: '.json'  // 由于 JSON 不允许注释，所以用 js 会方便一点，也可以写成其他的，不过文件格式是 JSON
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
            // 检查规则里面是否存在通配符
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

//有一个异常未处理,当v1 V2 为数字时会发生异常  2018-11-20
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

//json object转换为string  2018-11-20
hbs.registerHelper('tostring', function (v1, options) {
    return JSON.stringify(v1);
});

//json object转换为tree结构  2018-11-20
hbs.registerHelper('totree', function (v1, options) {
    return JSON.stringify(tree_utils.transData(v1, 'id', 'pid', 'children'));
});

//索引加1  2018-11-20
hbs.registerHelper("addOne", function(v1, options) {
    return parseInt(v1, 10) + 1;
});

// 格式化日期 2018-11-20
hbs.registerHelper("format", function (v1, options) {
    return moment(v1).format("YYYY-MM-DD HH:mm:ss");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//设置cookie
app.use(cookieParser());
//2018 - 11-29 session的配置使用
app.use(session({
    // store: new RedisStore(config.get('redis.session')),
    secret:'socketchat',//一个String类型的字符串，作为服务器端生成session的签名
    resave:false,//(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。默认为true
    saveUninitialized:false//初始化session时是否保存到存储。默认为true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/mainPage', test_route);// 设置路由 2018-11-20
app.use('/chatPage',socket_route);// 设置路由 2018-11-27


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
