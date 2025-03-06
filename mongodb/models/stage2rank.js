const mongoose = require('mongoose')
const config = require('../../config.json')
const db = require('../db')

const Schema = mongoose.Schema

// output rank, but don't save it, because it's changing
// rank: {
//     electricityconsumptionrank: Number,
//     carboncreditrank: Number,
// },
const stage2rankSchema = new Schema(
    {
        userid: Schema.Types.ObjectId,
        groupid: { type: Number, enum: config.group },
        rounddata: [
            {
                roundid: { type: Number, enum: config.round },

                result: {
                    electricityconsumption: Number,
                    carboncredit: Number,
                }
            }
        ]
    },
)

stage2rankSchema.statics.addData = async function (data) {
    // data: {
    //     userid: Schema.Types.ObjectId,
    //     groupid: { type: Number, enum: [1, 2, 3, 4] },
    //     roundid: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    //     electricityconsumption: Number,
    //     carboncredit: Number,}
    try {
        const filter = {
            userid: data.userid,
            groupid: data.groupid,
        }
        // todo existing?
        // const existing = await this.findOne(filter)
        // new: true, 返回更新后的文档
        const option = { upsert: true, new: true, }
        let update = {
            $push: {
                rounddata: {
                    "roundid": data.roundid,
                    "result": {
                        "electricityconsumption": data.electricityconsumption,
                        "carboncredit": data.carboncredit,
                    }
                },
            }
        }
        // console.log(existing)
        // console.log(res)
        // if (existing) {}
        const res = await this.findOneAndUpdate(filter, update, option)
        return res
    } catch (err) {
        console.log(`addData ERROR: ${err}`)
    }


}
stage2rankSchema.statics.getEC1CC0Sort = function (data, type) {
    try {

        const filter = {
            groupid: data.groupid,
            rounddata: [
                {
                    roundid: data.roundid,
                }
            ]
        }
        const projection = {
            userid: 1,
            groupid: 0,
            rounddata: [
                {
                    roundid: 0,
                    result: 1,
                }
            ]
        }
        const ascending = 1
        const descending = -1
        const sortpattern1 = { rounddata: [{ result: { electricityconsumption: ascending } }] }
        const sortpattern0 = { rounddata: [{ result: { carboncredit: ascending } }] }

        return this.find(filter).sort(type ? sortpattern1 : sortpattern0)

    } catch (err) {
        console.log(`getSort ERROR: ${err}`)

    }
}

// counter
stage2rankSchema.statics.getEC1CC0Rank = async function (data) {
    try {
        // oldapi
        // const filter = {
        //     groupid: data.groupid,
        //     rounddata: [
        //         {
        //             roundid: data.roundid,
        //         }
        //     ]
        // }
        // const pattern1 = { rounddata: [{ result: { electricityconsumption: { $gt: data.electricityconsumption } } }] }
        // const pattern0 = { rounddata: [{ result: { carboncredit: { $gt: data.carboncredit } } }] }
        // const subset = this.find(filter)
        // return (subset.count(type ? pattern1 : pattern0) + 1) / subset.count()


        // debug
        // console.log(data)
        // const data = {
        //     userid: '67c6f871a87314e9b783fc82',
        //     groupid: 3,
        //     roundid: 1,
        //     electricityconsumption: 350,
        //     carboncredit: 50
        // }

        // const filter1 = {
        //     "groupid": data.groupid,
        //     "rounddata": [
        //         {
        //             "roundid": data.roundid,
        //             "result": {
        //                 "electricityconsumption": { $gt: data.electricityconsumption }
        //             }
        //         }
        //     ]
        // }

        const filter1 = {
            "groupid": data.groupid,
            rounddata: {
                $elemMatch: {
                    roundid: data.roundid,
                    "result.electricityconsumption": { $gt: data.electricityconsumption }
                }
            }

        }

        // wrong query:
        // result: {
        // electricityconsumption: { $gt: data.electricityconsumption }
        // }
        const filter0 = {
            "groupid": data.groupid,
            rounddata:
            {
                $elemMatch: {
                    roundid: data.roundid,
                    "result.carboncredit": { $gt: data.carboncredit }
                }
            }
        }

        // $gt : hugier the number is, smaller the rank is


        // debug
        // console.log(`debug - filter group:${data.groupid}`)
        // const debug1 = await this.countDocuments(filter1)
        // const debug0 = await this.countDocuments(filter0)
        // const total = await this.countDocuments({groupid:data.groupid})
        // console.log(debug1)
        // console.log(debug0)
        // console.log(total)

        // unique round
        // return await (this.countDocuments(ranktypes ? filter1 : filter0) + 1) / this.countDocuments({ "groupid": data.groupid })


        const ec = await this.countDocuments(filter1)
        const cc = await this.countDocuments(filter0)
        const total = await this.countDocuments({ "groupid": data.groupid, "rounddata.roundid": data.roundid })
        // noexist
        return [ total, ec, cc ]
    } catch (err) {
        console.log(`getRank ERROR: ${err}`)

    }
}

// group ounter
stage2rankSchema.statics.getGroupCount = async function () {
    // unused api
    // return await this.find({ groupid: 1 }).count()
    // good api
    // return await this.countDocuments({ groupid: 1 });
    try {
        let groupcounts = {}
        for (const idx in config.group) {
            gid = config.group[idx]
            // const groupcount = await this.find({ groupid: id }).count()
            const groupcount = await this.countDocuments({ groupid: gid })
            // console.log(`debug - id:${gid} groupcount:${groupcount}`)
            groupcounts[gid] = groupcount
        }
        return groupcounts
    } catch (err) {
        console.log(`getGroupCount ERROR: ${err}`)
    }
}

module.exports = db.dbrank.model('Rank', stage2rankSchema)