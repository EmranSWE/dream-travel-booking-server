const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express=require("express")
const cors=require("cors");
require('dotenv').config();
const port=process.env.PORT || 5000;
const app=express();

app.use(express.json());
app.use(cors());

//Connection with node mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mj3b1qf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const topplaceCollection=client.db('dreamTravel').collection('topplace');


        //Query api
        app.get('/topplace',async(req,res)=>{
            const query= {};
            const cursor = topplaceCollection.find(query);
            const topplaces= await cursor.toArray();
            res.send(topplaces)
        });
        app.get('/topplace/:id',async (req,res) =>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const topplace=await topplaceCollection.findOne(query);
            res.send(topplace)
        });
        

         //POST api 
         app.post('/topplace',async(req,res)=>{
            const newTopPlace =req.body;
            const result=await topplaceCollection.insertOne(newTopPlace)
            res.send(result);
        });

          //DELETe api

          app.delete('/topplace/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result= await topplaceCollection.deleteOne(query);
            res.send(result)
        });


    }

    finally{

    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("Db User connected")
});

app.listen(port, ()=>{
    console.log('Listening the port',port)
})