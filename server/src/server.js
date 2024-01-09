import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb"
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

// db function not strictly necessary, for future development.
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
  try {
    const { img_array } = req.body;
    console.log("Getting prediction...");

    const predict = spawn('python3', ['./src/predict.py', img_array]);
    console.log(2343);
    predict.stdout.on('data', (data) => {
      if (data) {
        console.log(parseInt(data));
        return res.send(data);
      } else {
        return res.status(500).send("Unable to retrieve prediction.");
      }
    })
    predict.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
      return res.status(500).send("Error during script execution.");
    });
    console.log(123213);
  } catch (error) {
    res.status(500).send("Unexpected error occured.");
  }
})

let server = app.listen(2000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
