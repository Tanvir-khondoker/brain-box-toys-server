const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors())
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ypzt2um.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
//    commenting for ph group post
    // await client.connect();

    const toysCollection = client.db("brainToys").collection("categories");
    const addedToysCollection = client.db("brainToys").collection("addedToys");

    app.get("/categories", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // app.get("/details/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await addedToysCollection.findOne(query);
    //   res.send(result);
    // });

    // adding a toys
    app.post("/addedToys", async (req, res) => {
      const adding = req.body;
      console.log(adding);
      const result = await addedToysCollection.insertOne(adding);
      res.send(result);
    });

    app.patch("/addedToys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedToys = req.body;
      console.log(updatedToys);
      const updateDoc = {
        $set: {
          status: updatedToys.status,
        },
      };
      const result = await addedToysCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/addedToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedToysCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/addedToys", async (req, res) => {
      let query = {};

      if (req.query && req.query.email) {
        query = { email: req.query.email };
      }

      const result = await addedToysCollection.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("brain is  running");
});

app.listen(port, () => {
  console.log(`brain box server is running on port ${port}`);
});




