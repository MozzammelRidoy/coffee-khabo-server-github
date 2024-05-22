const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [
      'http://localhost:5173',
     
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());

//Mongodb Start
//
//
// const uri = 'mongodb://localhost:27017';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmeeuxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const coffeesCollectionDB = client
      .db("CoffeeKhaboDB")
      .collection("coffees");

      // database for users 
      const usersCollectionDB = client.db('UsersInfoDB').collection('users'); 

    // coffee get or show
    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollectionDB.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // coffee add or post
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeesCollectionDB.insertOne(newCoffee);
      res.send(result);
    });

    // coffee remove or delete
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollectionDB.deleteOne(query);
      res.send(result);
    });

    // coffee update or edit
    //seach or load
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollectionDB.findOne(query);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const updateCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const replaceCoffee = {
        $set: {
          name: updateCoffee.name,
          chef: updateCoffee.chef,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          quantity: updateCoffee.quantity,
          price: updateCoffee.price,
          photo: updateCoffee.photo
        },
      }; 
      const result = await coffeesCollectionDB.updateOne(filter, replaceCoffee, options);
      res.send(result); 
    });




// -------- // User Part ---------------------------------------------------
//------------------------------------------------------------


 // read or get,, user load
 app.get('/users', async(req, res)=> {
      const cursor = usersCollectionDB.find(); 
      const result = await cursor.toArray(); 
      res.send(result);
 })
   
   // create user and user info post
   app.post('/users', async(req, res)=> {
    const newUser = req.body; 
    const result = await usersCollectionDB.insertOne(newUser); 
    res.send(result);
   })

   // user delete or remove 
   app.delete('/users/:id', async(req, res)=> {
    const id = req.params.id; 
    const query = {_id : new ObjectId(id)}; 

    const result = await usersCollectionDB.deleteOne(query); 
    res.send(result); 
   })

   // user update information or user last login time
   app.patch('/users', async(req, res) => {
    const userData = req.body; 
    const filter = {email : userData.email}; 
    const updateDoc = {
      $set : {
        lastSignInTime : userData.lastSignInTime
      }
    }; 
    const result = await usersCollectionDB.updateOne(filter, updateDoc); 
    res.send(result); 
   })

  










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
  res.send("Coffee Khabo Server is Running");
});

app.listen(port, () => {
  console.log("Coffee Khabo Server is Running on PORT : ", port);
});
