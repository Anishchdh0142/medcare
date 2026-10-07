const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'medcare.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS drug_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drug1 TEXT,
        drug2 TEXT,
        severity TEXT,
        description TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS food_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drug TEXT,
        food TEXT,
        severity TEXT,
        description TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT,
        image_path TEXT,
        extracted_text TEXT
    )`);

    // Insert sample data
    const insertMed = db.prepare("INSERT OR IGNORE INTO medicines (name) VALUES (?)");
    ['Aspirin', 'Warfarin', 'Lisinopril', 'Ibuprofen', 'Simvastatin'].forEach(med => insertMed.run(med));
    insertMed.finalize();

    const insertDrugInt = db.prepare("INSERT OR IGNORE INTO drug_interactions (drug1, drug2, severity, description) VALUES (?, ?, ?, ?)");
    insertDrugInt.run('Aspirin', 'Warfarin', 'High', 'Increased risk of bleeding.');
    insertDrugInt.run('Lisinopril', 'Ibuprofen', 'Moderate', 'May decrease the effectiveness of Lisinopril and affect kidney function.');
    insertDrugInt.finalize();

    const insertFoodInt = db.prepare("INSERT OR IGNORE INTO food_interactions (drug, food, severity, description) VALUES (?, ?, ?, ?)");
    insertFoodInt.run('Simvastatin', 'Grapefruit', 'High', 'Grapefruit juice can increase the levels of Simvastatin in your blood.');
    insertFoodInt.run('Warfarin', 'Vitamin K (Leafy Greens)', 'Moderate', 'High intake of Vitamin K can make Warfarin less effective.');
    insertFoodInt.finalize();
});

module.exports = db;
