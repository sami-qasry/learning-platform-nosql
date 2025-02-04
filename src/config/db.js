// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : 
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : 

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  // TODO: Implémenter la connexion MongoDB
  // Gérer les erreurs et les retries
  try {
    mongoClient = new MongoClient(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log('Connexion à MongoDB réussie');
  } catch (error) {
    console.error('Erreur lors de la connexion à MongoDB :', error);
    process.exit(1);
  }
}

async function connectRedis() {
  // TODO: Implémenter la connexion Redis
  // Gérer les erreurs et les retries
  try {
    redisClient = redis.createClient({ url: config.redis.uri });
    redisClient.on('error', (err) => console.error('Erreur Redis :', err));
    await redisClient.connect();
    console.log('Connexion à Redis réussie');
  } catch (error) {
    console.error('Erreur lors de la connexion à Redis :', error);
    process.exit(1);
  }
}

//implementation de la fermeture de la connexion
function closeConnections() {
  if (mongoClient) {
    mongoClient.close().then(() => console.log('Connexion MongoDB fermée'));
  }
  if (redisClient) {
    redisClient.quit().then(() => console.log('Connexion Redis fermée'));
  }
}

// Export des fonctions et clients
module.exports = {
  // TODO: Exporter les clients et fonctions utiles
  connectMongo,
  connectRedis,
  closeConnections,
  getMongoDb: () => db,
  getRedisClient: () => redisClient
};