const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
const cors = require('cors')
const bodyParser = require('body-parser');


const port = 5000;

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('booking'));
app.use(fileUpload());


app.get('/', (req, res) => {
    res.send('Welcome to apartment hunt Server Side')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjawr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const bookingCollection = client.db("apartmentHunt").collection("bookingList");
  const addHouseCollection = client.db("apartmentHunt").collection("addRentHouses");

  // store house booking in database
  app.post('/addHouseBooking', (req, res) => {
    const bookingHouse = req.body;
    bookingCollection.insertOne(bookingHouse)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

app.get("/getHouseBooking", (req, res) => {
    bookingCollection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        });
});

app.post('/addRentHouse', (req, res) => {
    const file = req.files.file;
        const title = req.body.title;
        const price = req.body.price;
        const loc = req.body.loc;
        const bedroom = req.body.bedroom;
        const bath = req.body.bath;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        const image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        const src = image.img;

    addHouseCollection.insertOne({title, price, loc, bedroom, bath, src, image})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})
app.get('/addRentHouseShow', (req, res) => {
    addHouseCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
})



  
});










app.listen(process.env.PORT || port);