// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : 
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: 

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.get('/', courseController.getAllCourses);
router.post('/', courseController.createCourse); // POST to create a new course
router.get('/stats', courseController.getCourseStats); // GET to retrieve course statistics
router.get('/:id', courseController.getCourse); // GET to retrieve a course by ID
router.put('/:id', courseController.updateCourse); // PUT to update a course by ID
router.delete('/:id', courseController.deleteCourse);

module.exports = router;