# Personal Activity Tracker App

A cross-platform mobile app that helps users track their daily activities such as reading, workouts, meals, and more — with weekly and monthly statistics, and AI-powered insights (in development).

## ✨ Features

- 📚 Log daily habits (pages read, gym sets, meals)
- 📊 View weekly and monthly activity statistics
- 🧠 AI-based suggestions (planned)
- 🌐 FastAPI backend with SQLite / MySQL
- 📱 Flutter frontend for Android & iOS
- 🔐 User authentication system (coming soon)

## 🛠️ Tech Stack

- **Frontend:** Flutter (Dart)
- **Backend:** FastAPI (Python)
- **Database:** SQLite (dev), MySQL (planned)
- **API:** RESTful JSON
- **ML/AI:** Future integration using scikit-learn or custom logic

## 🚀 Getting Started

### Backend (FastAPI)

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
