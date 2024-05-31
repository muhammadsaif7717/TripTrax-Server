const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middlewere's
app.use(cors());
app.use(express.json());

// manage detabase
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oh0s98i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();  //comment this line before deploy in varcel

    //collections
    const usersCollection = client.db("TripTraxDB").collection("users");
    const touristSportsCollection = client
      .db("TripTraxDB")
      .collection("touristSpots");
    const countryCollection = client
      .db("TripTraxDB")
      .collection("countriesInfo");

    //operations
    // ********* //
    //  Post a User to mongodb
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //get users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get specified user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // ******* //

    //post a tourists spot
    app.post("/tourist-spots", async (req, res) => {
      const newTouristsSpot = req.body;
      console.log(newTouristsSpot);
      const result = await touristSportsCollection.insertOne(newTouristsSpot);
      res.send(result);
    });

    //get tourists spots
    app.get("/tourist-spots", async (req, res) => {
      const cursor = touristSportsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get specified tourists spot
    app.get("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSportsCollection.findOne(query);
      res.send(result);
    });

    // update specific Tourists spot
    app.put("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTouristsSpot = req.body;
      const spot = {
        $set: {
          spotName: updatedTouristsSpot.spotName,
          countryName: updatedTouristsSpot.countryName,
          location: updatedTouristsSpot.location,
          description: updatedTouristsSpot.description,
          cost: updatedTouristsSpot.cost,
          seasonality: updatedTouristsSpot.seasonality,
          travelTime: updatedTouristsSpot.travelTime,
          totalVisitors: updatedTouristsSpot.totalVisitors,
          name: updatedTouristsSpot.name,
          email: updatedTouristsSpot.email,
          photo: updatedTouristsSpot.photo,
        },
      };
      const result = await touristSportsCollection.updateOne(
        filter,
        spot,
        options
      );
      res.send(result);
    });

    //delete specific Tourists spot
    app.delete("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSportsCollection.deleteOne(query);
      res.send(result);
    });

    //************ */
    //  Post a Country info to mongodb
    app.post("/countries", async (req, res) => {
      const countryInfo = req.body;
      console.log(countryInfo);
      const result = await countryCollection.insertOne(countryInfo);
      res.send(result);
    });

    //get Countries
    app.get("/countries", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get specified country
    app.get("/countries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await countryCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });  //comment this line before deploy in varcel
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
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


//* MuHammad Saif *//