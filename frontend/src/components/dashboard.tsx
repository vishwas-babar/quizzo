"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { config } from "@/config";

type Quiz = {
    id: number;
    title: string;
    description: string;
};

export default function Dashboard() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(`${config.backendUrl}/api/quizzes`);
                setQuizzes(res.data);
            } catch (error) {
                console.error("Error fetching quizzes", error);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">My Quizzes</h1>
            <Button className="mb-4">+ Create Quiz</Button>

            {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                    <div key={quiz.id} className="border p-4 mb-3 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold">{quiz.title}</h2>
                        <p className="text-gray-600">{quiz.description}</p>
                        <div className="mt-2 flex gap-2">
                            <Button variant="outline">Edit</Button>
                            <Button variant="destructive">Delete</Button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No quizzes available</p>
            )}
        </div>
    );
}
