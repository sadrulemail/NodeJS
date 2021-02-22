var sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
        user: 'sa',
        password: 'fsbank',
        server: '172.20.1.70',
        database: 'Test_TT'
    });
 
    return conn;
};

module.exports = connect;