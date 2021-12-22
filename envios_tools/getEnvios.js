const env = require('dotenv').config();
const fetch = require('isomorphic-fetch');
const fs = require('fs');
const cron = require('node-cron');
const { parseEnvio } = require('./parsers');
const { MongoClient } = require('mongodb');
const { storeEnvio } = require('./storeEnvios');

const url = process.env.LOCAL_DB_URL || `mongodb+srv://admin:${process.env.ATLAS_PWD}@cluster0.7gleu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connectDB = async (db_name) => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(db_name);
  return [client, db];
}; 

const fetchEnvio = n_envio => {
  return fetch(`https://www.aceptaelreto.com/user/submission.php?id=${n_envio}`).then(res => res.text());
}

const getStoreEnvio = async (num_envio, db) => {
  const envio = await fetchEnvio(num_envio);
  const {data, status} = parseEnvio(envio);

  //Only store when is a new envio and is not in queue
  if (status !== 201 && data.veredict != 'IQ' && data.num_envio != null)
    await storeEnvio(data, db);
  return status !== 201 && data.veredict != 'IQ';
};

const getEnvio = async (num_envio) => {
  const envio = await fetchEnvio(num_envio);
  const {data} = parseEnvio(envio);
  return data;
};

const projection = {
  'num_envio': 1, 
  '_id': 0
};

let executing = false;

const getAll = async (db) => {
  executing = true;
  let last = (await db.findOne({}, { projection: projection, sort: {'num_envio': -1} }))?.num_envio;
  if (last == null)
    last = 0;
  last++;
  console.log(`[FETCHER][START] Started fetching session with ${last}`);
  while (await getStoreEnvio(last, db)){
    if (last % 100 === 0)
      console.log(`[FETCHER][INFO] Fetching ${last}`);
    last++;
  }
  executing = false;
  console.log(`[FETCHER][END] Ended fetching session with ${last}`);
  return last;
};

const getEnvios = async () => {
  const [client, db] = await connectDB('acepta_el_ranking');
  const envios_collection = db.collection('envios');

  //Run crawler every minute
  var task = cron.schedule('* * * * *', async () =>  {
    if (executing)
      return;
    await getAll(envios_collection);
  });
}

module.exports = {
  getEnvios,
  getEnvio,
};