const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB}:${process.env.PASS}@cluster0.62mn9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//run function
async function run() {
  try {
    await client.connect();
    const itemCollection = client.db("bike-parts").collection("itemCollection");
    const orderCollection = client.db("order").collection("orderCollection");

    // all item api
    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const item = await cursor.toArray();
      res.send(item);
    });


  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Im Running");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
