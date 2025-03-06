// Use this connection string in your application

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://winteraejane:SMnhEZJi6GtxPVGn@cluster0.ovjoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

const mongoose = require('mongoose');
const config = require('../config.json')
// const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, };
mongoose.connect(config.url.experiment).then((res, rej) => {
  console.log("Pinged your deployment. You successfully connected to MongoDB experiment!");
}).catch((err) => {
  console.log(`Error : ${err}. Disconnect from MongoDB.`)
})

mongoose.connect(config.url.rank).then((res, rej) => {
  console.log("Pinged your deployment. You successfully connected to MongoDB rank!");
}).catch((err) => {
  console.log(`Error : ${err}. Disconnect from MongoDB.`)
})
mongoose.Promise = global.Promise;

module.exports = {
  Experiment: require('./models/experiment'),
  Rank: require('./models/stage2rank'),
}