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

    //jwt auth

    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.TOKEN, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });
    // single item api
    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await itemCollection.findOne(query);
      res.send(item);
    });

    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      // create a document that sets the plot of the movie
      const updateDoc = {
        $set: {
          ...data,
        },
      };
      const result = await itemCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // add item
    app.post("/add", async (req, res) => {
      const data = req.body;
      const result = await itemCollection.insertOne(data);
      res.send(result);
    });

    // delete item
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });


    //++++++++++++++++++++++++++++++++++++++++++++++++++++//


    // all item api
    app.get("/order", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
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
