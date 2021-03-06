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

// 게시물 작성 페이지 렌더링
router.get("/write", function (req, res, next) {
  res.render("write", { title: "게시판 글쓰기" });
});

// 게시물 작성 api
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

// 게시물 상세보기
router.get("/read/:idx", function (req, res, next) {
  var idx = req.params.idx;
  // 마지막 idx에 매개변수를 받음
  var sql = `select idx, name, title, content, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit from board where idx=?`;

  conn.query(sql, [idx], function (err, row) {
    if (err) {
      console.error(err);
    }
    res.render("read", { title: "글 상세", row: row[0] });
  });
});

// 게시물 수정
router.post("/update", function (req, res, next) {
  let { idx, name, title, content, passwd } = req.body;
  let datas = [idx, name, title, content, passwd];
  let sql = `update board set name=?, title=?, content=?, modidate=now() where idx=? and passwd=?`;

  conn.query(sql, datas, function (err, result) {
    if (err) {
      console.error(err);
    }
    console.log("result in /update", result);
    // affectedRows: 해당 쿼리로 변경된 수에 행을 불러옴
    // 0이면 업데이트 x => 비밀번호가 틀린 것
    if (result.affectedRows === 0) {
      res.send(
        '<script>alert("패스워드가 일치하지 않습니다."):history.back();</script>'
      );
    } else {
      res.redirect("/board/read/" + idx);
    }
  });
});

// 게시물 삭제
router.post("/delete", function (req, res, next) {
  let { idx, passwd } = req.body;
  let datas = [idx, passwd];

  let sql = "delete from board where idx=? and passwd=?";
  conn.query(sql, datas, function (err, result) {
    if (err) {
      console.error(err);
    }
    if (result.affectedRows === 0) {
      res.send(
        '<script>alert("패스워드가 일치하지 않습니다.");history.back();</script>'
      );
    } else {
      res.redirect("/board/list");
    }
  });
});

// 페이지네이션
router.get("/page/:page", function (req, res, next) {
  let page = req.params.page;
  let sql = `select idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit from board`;

  conn.query(sql, function (err, rows) {
    if (err) {
      console.error("err", err);
    }
    res.render("page", {
      title: "게시판 리스트",
      rows: rows,
      page: page,
      length: rows.length - 1,
      page_num: 10,
      pass: true,
    });
  });
});

module.exports = router;
