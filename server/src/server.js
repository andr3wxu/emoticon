import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb"
import { spawn } from "child_process";
import path from "path";

const __dirname = path.resolve("");
const distPath = path.join(__dirname, "../emoticon-client/dist");

const app = express();
app.use(express.static(distPath));
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

app.get('/*', (req, res) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  })
})

app.put('/api/getPredict', async (req, res) => {
  try {
    const { img_array } = req.body;
    console.log("Getting prediction...");

    const predict = spawn('python3', ['./src/predict.py', img_array]);
    predict.stdout.on('data', (data) => {
      if (data) {
        res.json(parseInt(data));
      } else {
        res.status(500).send("Unable to retrieve prediction.");
      }
    })
  } catch (error) {
    res.status(500).send("Unexpected error occured.");
  }
})

let server = app.listen(2000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
