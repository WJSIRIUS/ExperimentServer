let express = require('express');
let router = express.Router();

/* GET rank. */
router.get('/', function (req, res, next) {
    // req.body = { round : int , userid : id, group: int , data: { elec_cons: float, carb_cred: float }}
    const reqparam = req.body
    // todo: save and query rand
    const rank = {
        elec_cons: 100,
        carb_cred: 100
    }
    res.send(JSON.stringify({ ...rank, req: reqparam }));
});

module.exports = router;