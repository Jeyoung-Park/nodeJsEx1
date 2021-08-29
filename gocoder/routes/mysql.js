var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var global = require("../global/variable.js");
var mysql_odbc=require('../db/db_conn');


router.get("/", function (req, res, next) {
  // 데이터 베이스 접속 정보 입력
  // var connection = mysql.createConnection({
  //   host: "localhost",
  //   port: 3306,
  //   user: "root",
  //   // password: "asajason1229",
  //   password: global.getDBPassword(),
  //   database: "nodedb",
  // });
  var connection=mysql_odbc.init();
  // connect 함수를 이용해 해당 db에 접속 시도
  // 접속 오류 발생 시 err
  connection.connect(function (err) {
    if (err) {
      res.render("mysql", { connect: "연결 실패", err: err });
      console.error(err);
      throw err;
    } else {
      console.log("mysql 연결 성공");
      res.render("mysql", { connect: "연결 성공", err: "없음" });
      // res.render("form", {
      //   name: "jason",
      //   blog: "eloquence-developers.tistory.com",
      //   homepage: "eloquence-developers.tistory.com",
      // });
    }
  });
  connection.end();
});

module.exports = router;
