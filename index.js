const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0sxdnca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const coffeeCollection = client.db('CoffeeMachineDB').collection('CoffeeCollection')

        app.get('/coffees', async(req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.post('/coffees', async(req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee)
            console.log(newCoffee)
            res.send(result)
        })

        app.delete('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })





        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
