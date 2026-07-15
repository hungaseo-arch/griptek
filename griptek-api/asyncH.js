// async 라우트 핸들러의 reject 를 Express 에러 핸들러로 전달 (Express 4)
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
