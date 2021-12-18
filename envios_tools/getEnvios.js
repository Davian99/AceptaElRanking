const fetch = require('isomorphic-fetch');
const fs = require('fs');
const { parseEnvio } = require('./parsers');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';

const connectDB = async (db_name) => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(db_name);
  return [client, db];
}; 

const fetchEnvio = n_envio => {
  return fetch(`https://www.aceptaelreto.com/user/submission.php?id=${n_envio}`, {
    "credentials": "include",
    "referrer": "https://www.aceptaelreto.com/user/lastsubmissions.php",
    "method": "GET",
    "mode": "cors"
  }).then(res => res.text())
}

const getStoreEnvio = async (num_envio, db) => {
  console.log(num_envio)
  const envio = await fetchEnvio(num_envio);
  const data = parseEnvio(envio);
  console.log(data);
};

const getAll = async (ini, n, db) => {
  const data = await Promise.all([...Array(n).keys()]
    .map(elem => elem + ini)
    .map(envio => fetchEnvio(envio)
      .then(fetched => parseEnvio(fetched))
    ));
  console.log(data);
};

const main = async () => {
  console.time('main');
  const [client, db] = await connectDB('acepta_el_ranking');
  const envios_collection = db.collection('envios');
  await getStoreEnvio(484);
  console.timeEnd('main');
  client.close();
}
main();