import { API_BASE_URL } from '../utils/constants.js';

export async function submitScore(playerName, score) {
    try {
        const response = await fetch(`${API_BASE_URL}/submit-score/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: playerName, score: score }),
        });
        if (!response.ok) {
            throw new Error('Failed to submit score');
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting score:', error);
        throw error;
    }
}

export async function fetchLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard/`);
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw error;
    }
}