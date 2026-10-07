const express = require('express');
const cors = require('cors');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ensure uploads folder exists
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MEDCARE API',
            version: '1.0.0',
            description: 'Healthcare Drug-Drug and Drug-Food Interaction Checker API',
        },
    },
    apis: ['./server.js'], // files containing annotations
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/upload-prescription:
 *   post:
 *     summary: Upload a prescription image for OCR
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully (Mock OCR)
 */
app.post('/api/upload-prescription', upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ error: 'No image provided' });
    }
    // Mock OCR Extraction
    const mockExtractedMedicines = ['Aspirin', 'Warfarin'];
    res.json({
        message: 'Image uploaded and processed successfully',
        file_path: req.file.path,
        extracted_medicines: mockExtractedMedicines,
        note: 'This is a mock OCR extraction for demonstration purposes.'
    });
});

/**
 * @swagger
 * /api/check-drug-interaction:
 *   post:
 *     summary: Check for drug-drug interactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drugs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Aspirin", "Warfarin"]
 *     responses:
 *       200:
 *         description: Interaction results
 */
app.post('/api/check-drug-interaction', (req, res) => {
    const { drugs } = req.body;
    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
        return res.status(400).json({ error: 'Please provide an array of at least two drugs.' });
    }

    db.all(`SELECT * FROM drug_interactions 
            WHERE (drug1 IN (${drugs.map(() => '?').join(',')}) AND drug2 IN (${drugs.map(() => '?').join(',')}))`, 
            [...drugs, ...drugs], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (rows.length === 0) {
            return res.json({ interactions: [], message: 'No known interactions found among the provided drugs.' });
        }
        res.json({ interactions: rows, message: 'Interactions found. Please consult a pharmacist.' });
    });
});

/**
 * @swagger
 * /api/check-food-interaction:
 *   post:
 *     summary: Check for drug-food interactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drugs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Simvastatin", "Warfarin"]
 *     responses:
 *       200:
 *         description: Food interaction results
 */
app.post('/api/check-food-interaction', (req, res) => {
    const { drugs } = req.body;
    if (!drugs || !Array.isArray(drugs) || drugs.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of drugs.' });
    }

    db.all(`SELECT * FROM food_interactions WHERE drug IN (${drugs.map(() => '?').join(',')})`, drugs, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ food_interactions: rows });
    });
});

app.listen(port, () => {
    console.log(`MEDCARE Node.js backend running at http://localhost:${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
