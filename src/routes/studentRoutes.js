const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Routes pour les étudiants
router.get('/', studentController.getAllStudents); // Récupérer tous les étudiants
router.post('/', studentController.createStudent); // Créer un nouvel étudiant
router.get('/:id', studentController.getStudent); // Récupérer un étudiant par ID
router.put('/:id', studentController.updateStudent); // Mettre à jour un étudiant par ID
router.delete('/:id', studentController.deleteStudent); // Supprimer un étudiant par ID

module.exports = router;