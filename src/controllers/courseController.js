// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

const COURSES_COLLECTION = 'courses';


async function getAllCourses(req, res) {
  try {
    // Fetch all courses from MongoDB
    const courses = await mongoService.findAll(COURSES_COLLECTION);

    if (!courses || courses.length === 0) {
      return res.status(404).json({ error: 'Aucun cours trouvé.' });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

async function createCourse(req, res) {
  try {
    const courseData = req.body;

    if (!courseData.name || !courseData.description) {
      return res.status(400).json({ error: 'Les champs "npm" et "description" sont obligatoires.' });
    }

    const courseId = await mongoService.insertOne(COURSES_COLLECTION, courseData);

    await redisService.cacheData(`course:${courseId}`, { ...courseData, _id: courseId });

    res.status(201).json({ message: 'Cours créé avec succès', courseId });
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide.' });
    }

    // Vérification dans le cache Redis
    let course = await redisService.getFromCache(`course:${id}`);

    if (!course) {
      // Si non trouvé dans le cache, rechercher dans MongoDB
      course = await mongoService.findOneById(COURSES_COLLECTION, id);

      if (!course) {
        return res.status(404).json({ error: 'Cours non trouvé.' });
      }

      // Mise en cache des résultats pour des requêtes futures
      await redisService.cacheData(`course:${id}`, course);
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

// Controller to get course statistics
async function getCourseStats(req, res) {
  try {
    // Vérification dans le cache Redis
    let stats = await redisService.getFromCache('course:stats');

    if (stats) {
      res.status(200).json({ message: "stats from cache", stats });
      return;
    }
    if (!stats) {
      // Si non trouvé dans le cache, calculer les statistiques
      const totalCourses = await mongoService.countDocuments(COURSES_COLLECTION);

      stats = { totalCourses };

      // Mise en cache des statistiques
      await redisService.cacheData('course:stats', stats, 3600); // Cache valide pour 1 heure
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des cours:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

// Controller to update a course by ID
async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide.' });
    }

    // Vérification de l'existence du cours dans MongoDB
    const updatedCount = await mongoService.updateOne(COURSES_COLLECTION, id, updateData);

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Mise à jour dans le cache Redis
    await redisService.cacheData(`course:${id}`, { ...updateData, _id: id });

    res.status(200).json({ message: 'Cours mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

// Controller to delete a course by ID
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide.' });
    }

    // Suppression du cours dans MongoDB
    const deletedCount = await mongoService.deleteOne(COURSES_COLLECTION, id);

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Suppression du cache Redis associé au cours
    await redisService.invalidateCache(`course:${id}`);

    res.status(200).json({ message: 'Cours supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

// Export des contrôleurs
module.exports = {
  getAllCourses,
  createCourse,
  getCourse,
  getCourseStats,
  updateCourse,
  deleteCourse,
};