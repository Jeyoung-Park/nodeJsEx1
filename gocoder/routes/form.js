// express 인스턴스 사용
var express = require("express");
// express 프레임워크 라우터를 사용하기 위해 변수 선언
var router = express.Router();

// URI 요청 응답 방식
router.get("/", function (req, res, next) {
  // 해당 view 파일을 렌더링
  res.render("form", {
    name: "jason",
    blog: "eloquence-developers.tistory.com",
    homepage: "eloquence-developers.tistory.com",
  });
});

// global 전역으로 router 사용할 수 있도록
module.exports = router;
