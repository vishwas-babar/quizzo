import { config } from "@/config";

export const API_BASE_URL = config.backendUrl + "/api"; // Adjust if deployed

// Fetch all quizzes
export async function getQuizzes() {
    const res = await fetch(`${API_BASE_URL}/quizzes`);
    return res.json();
}

// Create a new quiz
export async function createQuiz(data: { title: string; description: string }) {
    const res = await fetch(`${API_BASE_URL}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: localStorage.getItem("id") }),
    });
    return res.json();
}

// Update a quiz
export async function updateQuiz(
    id: number,
    data: { title: string; description: string }
) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

// Delete a quiz
export async function deleteQuiz(id: number) {
    await fetch(`${API_BASE_URL}/quizzes/${id}`, { method: "DELETE" });
}
