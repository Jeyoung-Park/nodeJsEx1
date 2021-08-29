var mysql=require('mysql');
var config=require('./db_info');

// console.log('config in db_conn', config);

module.exports=function(){
    return{
        init:function(){
            return mysql.createConnection({
                host:config.getDBInfo().local.host,
                port:config.getDBInfo().local.port,
                user:config.getDBInfo().local.user,
                password:config.getDBInfo().local.password,
                database:config.getDBInfo().local.database,
            })
        }
    }
}