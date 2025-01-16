// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :

// Fonctions utilitaires pour Redis
// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl = 3600) {
  try {
    const redisClient = db.getRedisClient();

    // Sérialisation des données avant de les stocker
    await redisClient.set(key, JSON.stringify(data), { EX: ttl });
    console.log(`Données mises en cache avec la clé: ${key}`);
  } catch (error) {
    console.error(`Erreur lors de la mise en cache des données avec la clé ${key}:`, error);
    throw error;
  }
}

async function getFromCache(key) {
  try {
    const redisClient = db.getRedisClient();

    // Récupération et désérialisation des données
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du cache pour la clé ${key}:`, error);
    throw error;
  }
}

async function invalidateCache(key) {
  try {
    const redisClient = db.getRedisClient();

    await redisClient.del(key);
    console.log(`Cache invalidé pour la clé: ${key}`);
  } catch (error) {
    console.error(`Erreur lors de l'invalidation du cache pour la clé ${key}:`, error);
    throw error;
  }
}

module.exports = {
  cacheData,
  getFromCache,
  invalidateCache,
};