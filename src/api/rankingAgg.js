const ranking_agg = [
    {
      '$match': {
        'veredict': 'AC'
      }
    }, {
      '$group': {
        '_id': {
          'user': '$user', 
          'problem': '$problem'
        }
      }
    }, {
      '$group': {
        '_id': '$_id.user', 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$sort': {
        'count': -1, 
        '_id': 1
      }
    }, {
      '$limit': 100
    }, {
      '$project': {
        'user': '$_id', 
        'count': '$count', 
        '_id': false
      }
    }
];

const projection = {'_id': false};

const getRanking = async (db) => {
  const curr_date = new Date();
  const last_ranking_update = await db.collection('last_ranking_update').findOne({}, {limit: 1});
  if (last_ranking_update?.date && curr_date - last_ranking_update.date < 15 * 60 * 1000)
    return db.collection('ranking_db').find({}, { projection: projection }).toArray();
  else {
    const ranking = await db.collection('envios').aggregate(ranking_agg).toArray();
    await db.collection('ranking_db').deleteMany({});
    await db.collection('ranking_db').insertMany(ranking);
    await db.collection('last_ranking_update').deleteMany({});
    await db.collection('last_ranking_update').insertOne({date: curr_date});
    
    //Removes the mongodb id from all elements
    return ranking.map(elem => ({ _id, ...rest } = elem, rest));
  }
}

module.exports = {ranking_agg, getRanking};