const fs = require('fs');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';

const connectDB = async (db_name) => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(db_name);
  return [client, db];
}; 

const main = async () => {
  const [client, db] = await connectDB('acepta_el_ranking');
  const envios_collection = db.collection('envios');
  
  const envios = JSON.parse(fs.readFileSync('envios.json'))
    .map(envio => ({
      user: envio.NOMBRE,
      num_envio: envio.NUM,
      fecha: envio.FECHA,
      problem: envio.PROBLEMA,
      language: envio.LENGUAJE,
      veredict: envio.VEREDICTO,
      time: envio.TIEMPO,
      memory: envio.MEMORIA,
      position: envio.POSICION,
    }));
  envios.sort((a, b) => a.num_envio - b.num_envio);
  await envios_collection.insertMany(envios);
  console.log(envios[0]);
  
  client.close();
}
main();