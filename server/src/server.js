import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb"
import { spawn } from "child_process";

// const client = new MongoClient('mongodb://')

const app = express();
app.use(cors())
app.use(express.json())

// const client = new MongoClient('mongodb://127.0.0.1:27017');

// app.post('/api/sendImg', async (req, res) => {
//   const { img_array, label } = req.body;
//   console.log(img_array);
//   await client.connect();
//   const db = client.db('emoticon-db');
//   try {
//     await db.collection("data").insertOne({array: img_array, label: label});
//   } catch (error) {
//     res.sendStatus(500);
//   } finally {
//     client.close();
//   }
// });

app.put('/api/getPredict', async (req, res) => {
  const { img_array } = req.body;
  console.log(img_array);
  try {
    const predict = spawn('python3', ['./src/predict.py', img_array]);
    predict.stdout.on('data', (data) => {
      if (data) {
        res.send(data);
        console.log(data.toString());
      } else {
        res.sendStatus(500);
      }
    })
  } catch (error) {
    res.sendStatus(500);
  }
})

app.listen(2000, () => {
  console.log("Listening...")
});
