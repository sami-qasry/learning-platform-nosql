const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

const STUDENTS_COLLECTION = 'students';

// Get all students
async function getAllStudents(req, res) {
    try {
        const students = await mongoService.findAll(STUDENTS_COLLECTION);

        if (!students || students.length === 0) {
            return res.status(404).json({ error: 'Aucun étudiant trouvé.' });
        }

        res.status(200).json(students);
    } catch (error) {
        console.error('Erreur lors de la récupération des étudiants:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Create a new student
async function createStudent(req, res) {
    try {
        const studentData = req.body;

        if (!studentData.firstName || !studentData.lastName) {
            return res.status(400).json({ error: 'Les champs "firstName" et "lastName" sont obligatoires.' });
        }

        const studentId = await mongoService.insertOne(STUDENTS_COLLECTION, studentData);

        await redisService.cacheData(`student:${studentId}`, { ...studentData, _id: studentId });

        res.status(201).json({ message: 'Étudiant créé avec succès', studentId });
    } catch (error) {
        console.error('Erreur lors de la création de l\'étudiant:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Get a single student by ID
async function getStudent(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID invalide.' });
        }

        let student = await redisService.getFromCache(`student:${id}`);

        if (!student) {
            student = await mongoService.findOneById(STUDENTS_COLLECTION, id);

            if (!student) {
                return res.status(404).json({ error: 'Étudiant non trouvé.' });
            }

            await redisService.cacheData(`student:${id}`, student);
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'étudiant:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Update a student by ID
async function updateStudent(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID invalide.' });
        }

        const updatedCount = await mongoService.updateOne(STUDENTS_COLLECTION, id, updateData);

        if (updatedCount === 0) {
            return res.status(404).json({ error: 'Étudiant non trouvé.' });
        }

        await redisService.cacheData(`student:${id}`, { ...updateData, _id: id });

        res.status(200).json({ message: 'Étudiant mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Delete a student by ID
async function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID invalide.' });
        }

        const deletedCount = await mongoService.deleteOne(STUDENTS_COLLECTION, id);

        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Étudiant non trouvé.' });
        }

        await redisService.invalidateCache(`student:${id}`);

        res.status(200).json({ message: 'Étudiant supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'étudiant:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Get student statistics
async function getStudentStats(req, res) {
    try {
        let stats = await redisService.getFromCache('student:stats');

        if (stats) {
            return res.status(200).json({ message: "Statistiques provenant du cache", stats });
        }

        const totalStudents = await mongoService.countDocuments(STUDENTS_COLLECTION);

        stats = { totalStudents };

        await redisService.cacheData('student:stats', stats, 3600); // Cache valid for 1 hour

        res.status(200).json(stats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des étudiants:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Export controllers
module.exports = {
    getAllStudents,
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    getStudentStats,
};