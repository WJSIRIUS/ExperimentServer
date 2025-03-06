let express = require('express');
let router = express.Router();
const path = require('path'); // 引入 path 模块，用于处理文件路径

/* GET survey json. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/survey/questions.json'));
});

module.exports = router;
