var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes=function()
{
    router.route('/')
        .get(function (req, res)
        {
            conn.connect().then(function ()
            {
                var sqlQuery = "SELECT * FROM a";
                var req = new sql.Request(conn);
                req.query(sqlQuery).then(function (recordset)
                {
                    res.json(recordset.recordset);
                    conn.close();
                })
                .catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while selecting data");
                });
            })
            .catch(function (err) {
                conn.close();
                res.status(400).send("Error while selecting data");
            });

        });

        router.route('/')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("Name", sql.VarChar(50), req.body.Name)
                    request.input("Price", sql.Decimal(18, 2), req.body.Price)
                    request.execute("s_ProductInsert").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        });

        router.route('/:id')
        .put(function (req, res)
         {
            var _ID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ID", sql.Int, _ID)
                    request.input("Name", sql.VarChar(50), req.body.Name)
                    request.input("Price", sql.Decimal(18, 2), req.body.Price)
                    request.execute("s_ProdectUpdate").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while updating data");});
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while updating data");});
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while updating data");});
            }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while updating data");});
        });

        router.route('/:id')
        .delete(function (req, res) {
            var _ID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ID", sql.Int, _ID)
                    request.execute("s_ProductDelete").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).json("Msg:ID " + _ID +" Deleted successfully.");
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while Deleting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Deleting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while Deleting data");
                });
            })
        });

        return router;
};

module.exports=routes;