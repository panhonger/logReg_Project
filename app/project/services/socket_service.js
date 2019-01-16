let models = require('../models/socket_model');

class socket_service {
    constructor() {}

    findUsers(cb){
        models.findUsersModel(cb);
    }

    upChatCord(params,cb) {
        models.upChatCordModel(params,cb);
    }
}

module.exports = new socket_service();