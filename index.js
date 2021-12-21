const env                   = require('dotenv').config();
const express               = require('express')
const { MongoClient }       = require('mongodb');
const { getRanking }        = require('./src/api/ranking');
const { getTableFromArray } = require('./src/generateTable');
const { getEnvios, getEnvio }         = require('./envios_tools/getEnvios');

const url = process.env.LOCAL_DB_URL || `mongodb+srv://admin:${process.env.ATLAS_PWD}@cluster0.7gleu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connectDB = async (db_name) => {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(db_name);
  return [client, db];
}; 

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const init = async (db) => {
    
  app.get('/user/:username', async (req, res) => {
    console.time('user');
    const envios_user = await db.collection('envios').find({user: req.params.username}, {projection: { _id: 0 }, sort: { fecha: 1 }}).toArray();
    console.timeEnd('user');
    res.json(envios_user);
  });

  app.get('/envio/:num_envio', async (req, res) => {
    console.time('envio');
    const envio = await db.collection('envios').findOne({num_envio: Number(req.params.num_envio)}, {projection: { _id: 0 }});
    console.timeEnd('envio');
    res.json(envio);
  });

  app.get('/get/:num_envio', async (req, res) => {
    console.time('envio');
    const envio = await getEnvio(Number(req.params.num_envio));
    console.timeEnd('envio');
    res.json(envio);
  });

  app.get('/ranking', async (req, res) => {
    console.time('ranking');
    const ranking = await getRanking(db);
    console.timeEnd('ranking');
    res.json(ranking);
  });

  app.get('/table', async (req, res) => {
    const ranking = await getRanking(db);
    const html = getTableFromArray(ranking);
    res.send(html);
  });
}

const main = async () => {
  //Background fetch envios
  getEnvios();
  const [client, db] = await connectDB('acepta_el_ranking');
  init(db);
};
main()