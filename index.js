const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());





app.get('/', (req, res) => {
res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5dt4u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const eventCollection = client.db("freshBazar").collection("products");
  console.log('Database connected')

  app.post('/addBooking',(req, res) => {
    const newBooking = req.body;
    eventCollection.insertOne(newBooking)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
    console.log(newBooking);
  })
    
  app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })


  app.delete('deleteEvent/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      console.log('delete this', id);
      eventCollection.findOneAndDelete({_id: id})
      .then(documents => res.send(!!documents.value))
  })

  // app.get('/product/:id', (req, res) => {
  //   eventCollection.find({_id: ObjectID(req.params.id)})
  //   .toArray ((err, documents) =>{
  //     res.send(documents);
  //   })
  // })

  app.get('/bookings', (req, res) =>{
    //console.log(req.query.email);
    eventCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
      
    })
  })


 

//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})