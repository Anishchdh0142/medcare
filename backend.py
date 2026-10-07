from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI(title="MEDCARE Platform - Powered by BOAT AI")

# Serve static files (HTML, CSS, JS) from the current directory
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    print("MEDCARE Server starting on http://localhost:8000")
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
