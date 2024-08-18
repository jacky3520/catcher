# Catch Game Web Application

This project is a catch game web application with a leaderboard feature. The game involves catching items falling from the top of the screen and displays a real-time leaderboard of top players.

## Features

1. Catch game:
   - Start menu with options to Start Game and view Leaderboard
   - 60-second gameplay duration
   - Player-controlled catcher that moves left and right
   - Items drop from top to bottom
   - Catching good items (p1-p4) adds 50 points
   - Catching bad items (e1-e2) deducts 100 points
   - Post-game name input and ranking display

2. Leaderboard:
   - Displays top 100 players in real-time
   - Shows player name and score for each rank

## API Documentation

The backend provides the following APIs:

1. Submit Score
   - Endpoint: `POST /api/submit-score/`
   - Description: Submits a player's score after the game ends
   - Request body:
     ```json
     {
       "name": "Player Name",
       "score": 1000
     }
     ```
   - Response: 201 Created with the submitted score data

2. Fetch Leaderboard
   - Endpoint: `GET /api/leaderboard/`
   - Description: Retrieves the top 100 players sorted by score
   - Query parameters:
     - `limit`: Number of results to return (default: 100)
     - `offset`: Number of results to skip (for pagination)
   - Response: 200 OK with an array of player data:
     ```json
     {
       "count": 100,
       "next": null,
       "previous": null,
       "results": [
         {
           "name": "Player 1",
           "score": 5000
         },
         {
           "name": "Player 2",
           "score": 4500
         },
         ...
       ]
     }
     ```

## Setup Guide

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm 6+

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS and Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Apply database migrations:
   ```
   python manage.py migrate
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

The backend server will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend application will be available at `http://localhost:5173`.

## Usage

1. Open the frontend application in a web browser.
2. Click "Start Game" to begin playing.
3. Use the left and right arrow keys to move the catcher.
4. After the game ends, enter your name to submit your score.
5. View the leaderboard to see top players.

## Support for Multiple Screen Sizes

The application is designed to be responsive and support multiple screen sizes. The game canvas and UI elements adjust automatically to fit different screen dimensions while maintaining the aspect ratio of game objects.

## Technologies Used

- Backend: Django, Django REST Framework
- Frontend: HTML5, CSS3, JavaScript, Three.js
- Build Tool: Vite