let express = require('express');
let router = express.Router();

router.post('/', function (req, res, next) {
    const data = req.body
    // write to db
    res.send({'end':1});
});

module.exports = router;