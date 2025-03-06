let express = require('express');
let router = express.Router();
let dbaction = require('../mongodb/dbservice')
const path = require('path');
// RESTful don't preserve session state, so use the userid to identify person
// clear unfinish userid periodically to pretect data 

// /* GET users group. */
// router.get('/users/groupid', function (req, res, next) {
//   // todo : from db
//   // group id (int) from 1 to 4 
//   const groupid = Math.floor(Math.random() * 3) + 1
//   res.send({ 'group_id': groupid });
// });

// router.get('/users/userid', function (req, res, next) {
//   // todo : from db
//   // group id (int) from 1 to 4 
//   const userid = 1000
//   res.send({ 'user_id': userid });
// });

// router set
router.get('/userinfo', getUserInfo);
router.get('/survey', getSurvey);
router.get('/rank', getRoundRank);
router.post('/submit', postSubmitData);


function getUserInfo(req, res, next) {
  // todo : from db
  // group id (int) from 1 to 4 
  // const groupid = Math.floor(Math.random() * 3) + 1
  // const userid = 1000
  dbaction.createUser().then((success, rej) => {
    if (success) {
      const { userid, groupid } = success
      const user = {
        'user_id': userid,
        'group_id': groupid,
      }
      res.send(JSON.stringify(user));
    }
    if (rej) {
      res.send({ 'reqstatus': 0, 'reqtype': 'getuserdata' });
    }
  })

}

function getSurvey(req, res, next) {
  try {
    res.sendFile(path.join(__dirname, '../public/survey/questions_v1.json'));
  } catch (err) {
    console.log('request get survey error.')
  }
}

function getRoundRank(req, res, next) {

  // req.body = { round : int , userid : id, group: int , data: { elec_cons: float, carb_cred: float }}
  // console.log(req.body)
  // already json
  // const data = JSON.parse(req.body)
  const data = req.body
  dbaction.getRank(data).then((success, rej) => {
    if (success) {

      // 解构赋值要同名
      // {"total":2,"ec":2,"cc":1}
      const { total, ecrank, ccrank } = success
      const rank = {
        'total_count': total,
        'elec_cons_count': ecrank,
        'carb_cred_count': ccrank,
      }
      // res.send(JSON.stringify({ elec_cons: ecrank, carb_cred: ccrank, user_id: data['userid'], group_id: data['groupid'], round: data['roundid'] }));
      // res.send(JSON.stringify(success))
      res.send({ ...rank, userid: data['userid'], groupid: data['groupid'], round: data['roundid'] })
    }
    if (rej) {
      res.send({ 'reqstatus': 0, 'reqtype': 'getrank' });
    }

  })
}

function postSubmitData(req, res, next) {
  // const submitdata = JSON.parse(req.body)
  const submitdata = req.body
  dbaction.postExperimentData(submitdata).then((success, rej) => {
    if (success) {
      res.send({ 'reqstatus': 1, 'reqtype': 'postdata' });
    }
    if (rej) {
      res.send({ 'reqstatus': 0, 'reqtype': 'postdata' });
    }
  })


}

module.exports = router;
