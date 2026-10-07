# MEDCARE Node.js Backend

This is the backend for the MEDCARE Drug Interaction Checker, built with Node.js and Express.

## Features Included
- **REST APIs**: Endpoints for uploading prescriptions (with mock OCR), checking drug-drug interactions, and checking drug-food interactions.
- **SQLite Database**: Automatically creates and seeds tables with sample medical data (Aspirin, Warfarin, Simvastatin, etc.).
- **Swagger Documentation**: Interactive API documentation.
- **Error Handling & Validation**: Returns proper JSON error messages.

## Setup Instructions

1. Open your terminal and navigate to this `backend` directory.
   ```bash
   cd "c:\Users\ankit\Hack qubit2.0\backend"
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

4. View the interactive API documentation at:
   [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

**Disclaimer**: This API returns sample data and should not be used for actual medical advice without integrating a verified medical database (like FDA or RxNorm).
