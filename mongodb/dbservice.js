const db = require('./db')
const mongoose = require('mongoose')
const config = require('../config.json')

const Experiment = db.Experiment
const Rank = db.Rank

async function createUser() {

    try {

        const default_groupid = 1
        const userid = new mongoose.Types.ObjectId()

        const groupcounts = await Rank.getGroupCount()
        // console.log(`debug - count : ${groupcounts}`)

        let groupid = default_groupid
        let groupcount = groupcounts[default_groupid]
        if (groupcounts) {
            for (const i in config.group) {
                gid = config.group[i]
                if (groupcount >= groupcounts[gid]) {
                    groupid = gid
                    groupcount = groupcounts[gid]
                }
            }
        } else {
            groupid = default_groupid
        }

        const User = {
            'userid': userid,
            'groupid': groupid
        }

        // console.log(`debug - User : ${JSON.stringify(User)}`)
        const userrank = new Rank(User)
        await userrank.save()
        return User
    } catch (err) {
        return err
    }
}

async function getRank(data) {
    try {
        const addres = await Rank.addData(data)
        // console.log("add data : ")
        // console.log(addres)

        // const ranktypes = { 'electricityconsumption': 1, 'carboncredit': 0 }
        // const electricityconsumptionrank = await Rank.getEC1CC0Rank(data, ranktypes['electricityconsumption'])
        // const carboncreditrank = await Rank.getEC1CC0Rank(data, ranktypes['carboncredit'])

        // const rank = { 'electricityconsumptionrank': electricityconsumptionrank, 'carboncreditrank': carboncreditrank }

        // { total, ec, cc }
        const [total, ec, cc] = await Rank.getEC1CC0Rank(data)
        // // {350 350 350} {400 300} 
        // // gt - 340 : 2, 360 : 1, 200:2
        // // total : 2

        const rank = { "total": total, "ecrank": ec, "ccrank": cc }
        console.log(`debug - rank: ${JSON.stringify(rank)} data:${JSON.stringify(data)}`)
        return rank
    } catch (err) {
        return err
    }
}

async function postExperimentData(submitdata) {
    try {
        const userexperiment = new Experiment(submitdata)
        await userexperiment.save()
        return true
    } catch (err) {
        return err
    }

}


module.exports = {
    createUser,
    getRank,
    postExperimentData,
}