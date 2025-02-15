"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { config } from "@/config";

type Quiz = {
    id: number;
    title: string;
    description: string;
    createdAt: string;
};

export default function Dashboard() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(`${config.backendUrl}/api/quizzes`);
                setQuizzes(res.data);
            } catch (error) {
                console.error("Error fetching quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    My Quizzes
                </h1>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Quiz
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                </div>
            ) : quizzes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg line-clamp-1">
                                    {quiz.title}
                                </CardTitle>
                                <CardDescription className="text-sm line-clamp-2">
                                    {quiz.description}
                                </CardDescription> 
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                    <div className="text-muted-foreground">
                        <span className="text-4xl">📚</span>
                        <h2 className="mt-2 text-xl font-semibold">No quizzes found</h2>
                        <p className="mt-1 text-sm">Get started by creating a new quiz</p>
                    </div>
                </div>
            )}
        </div>
    );
}