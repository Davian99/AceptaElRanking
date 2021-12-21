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

const deleteID = (elem) => {
  const { _id, ...rest } = elem;
  return rest;
};

const projection = {'_id': false};

const getRanking = async (db) => {
  return db.collection('ranking_db').find({}, { projection: projection }).toArray();
};

const updateRanking = async (db) => {
  const ranking = await db.collection('envios').aggregate(ranking_agg).toArray();
  await db.collection('ranking_db').deleteMany({});
  await db.collection('ranking_db').insertMany(ranking);
};

module.exports = {getRanking, updateRanking};