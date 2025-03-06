const mongoose = require('mongoose')
const config = require('../../config.json')
import {dbexp} from '../db'

const Schema = mongoose.Schema

const experimentSchema = new Schema(
    {
        userid: Schema.Types.ObjectId,
        groupid: { type: Number, enum: config.group },
        starttime: Date,
        finishtime: Date,
        progress: { type: String, enum: ['onstage1', 'onstage2', 'finishedall',] },
        answer: {
            stage1: [
                {
                    quetionid: Number,
                    questiontype: String,
                    optionscount: Number,
                    optionschoice: [String],
                },
            ],
            stage2: [
                {
                    roundid: { type: Number, enum: config.round },
                    state: Boolean,
                    userinput: {
                        electricityused: Number,
                        transportratio: Number,
                        garbagedays: Number,
                    },
                    roundresult: {
                        electricityconsumption: Number,
                        carboncredit: Number,
                        roundvirtualcurrency: Number,
                        endvirtualcurrency: Number,
                        carbonquota: Number,
                    },
                    roundrate: {
                        virtualcurrencyrate: Number,
                        carboncreditexchangerate: Number,
                        carbonquotarate: Number,
                        carbonquotatraderate: Number,
                    },
                    roundrank: {
                        electricityconsumptionrank: Number,
                        carboncreditrank: Number,
                    }

                }
            ],
        }
    }
)

// remove unfinish data periodically
// experiment.static.clearDataPeriodically = function () {
//     // const unfinished_data = this.find({progress:{$in:['stage1',stage2]}})
//     this.remove({ progress: { $in: ['onstage1', 'onstage2'] } })
// }

const Experiment = dbexp.model('Experiment', experimentSchema)
export default Experiment