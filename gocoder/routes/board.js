var express = require("express");
var router = express.Router();
var mysql_odbc = require("../db/db_conn");
var conn = mysql_odbc().init();

router.get("/list", function (req, res, next) {
  res.redirect("/board/list/1");
});

// board/list/(페이지 숫자) 형식으로 게시판 리스트 노출
router.get("/list/:page", function (req, res, next) {
  // uri 변수 ':page'로 맵핑된 page 값을 req 객체로 가져옴
  var page = req.params.page;
  var sql =
    "select idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, date_format(regDate, '%Y-%m-%d %H:%i:%s') regdate from board";
  conn.query(sql, function (err, rows) {
    console.log("rows in board.js, ", rows);
    if (err) {
      console.error("err", err);
    }
    res.render("list", { title: "게시판 리스트", rows: rows });
  });
});

router.get("/write", function (req, res, next) {
  res.render("write", { title: "게시판 글쓰기" });
});

router.post("/write", function (req, res, next) {
  let { name, title, content, passwd } = req.body;
  let datas = [name, title, content, passwd];

  let sql = `insert into board(name, title, content, regdate, modidate, passwd, hit) values(?, ?, ?, now(), now(), ?, 0)`;

  conn.query(sql, datas, function (err, row) {
    if (err) {
      console.error("err", err);
    }
    res.redirect("/board/list");
  });
});

module.exports = router;
