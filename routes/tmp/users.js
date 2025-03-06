let express = require('express');
let router = express.Router();

// RESTful don't preserve session state, so use the userid to identify person
// clear unfinish userid periodically to pretect data 

// /* GET users group. */
// router.get('/groupid', function (req, res, next) {
//   // todo : from db
//   // group id (int) from 1 to 4 
//   const groupid = Math.floor(Math.random() * 3) + 1
//   res.send({ 'group_id': groupid });
// });

// router.get('/userid', function (req, res, next) {
//   // todo : from db
//   // group id (int) from 1 to 4 
//   const userid = 1000
//   res.send({ 'user_id': userid });
// });

router.get('/', function (req, res, next) {
  // todo : from db
  // group id (int) from 1 to 4 
  const groupid = Math.floor(Math.random() * 3) + 1
  const userid = 1000
  res.send({
    'user_id': userid,
    'group_id': groupid
  });
});

module.exports = router;
