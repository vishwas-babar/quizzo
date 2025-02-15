"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Quiz {
    id: number;
    title: string;
    description: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Check if the user is logged in; if not, redirect to login page.
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [router]);

    // Load quizzes once the component is mounted.
    useEffect(() => {
        async function fetchQuizzes() {
            setLoading(true);
            const data = await getQuizzes();
            setQuizzes(data);
            setLoading(false);
        }
        fetchQuizzes();
    }, []);

    // Handle quiz submission (create or update)
    async function handleSubmit() {
        setSubmitting(true);
        if (editingQuiz) {
            await updateQuiz(editingQuiz.id, newQuiz);
        } else {
            await createQuiz(newQuiz);
        }
        setSubmitting(false);
        setIsOpen(false);
        setNewQuiz({ title: "", description: "" });
        setEditingQuiz(null);
        setQuizzes(await getQuizzes());
    }

    // Handle quiz edit
    function handleEdit(quiz: Quiz) {
        setEditingQuiz(quiz);
        setNewQuiz({ title: quiz.title, description: quiz.description });
        setIsOpen(true);
    }

    // Handle delete
    async function handleDelete(id: number) {
        await deleteQuiz(id);
        setQuizzes(await getQuizzes());
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
                        Quiz Management
                    </h1>
                    <Button onClick={() => setIsOpen(true)} className="px-6 py-2">
                        Add Quiz
                    </Button>
                </div>

                {/* Loading Animation */}
                {loading ? (
                    <div className="flex justify-center items-center mt-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            <Loader2 className="w-12 h-12 text-gray-500" />
                        </motion.div>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {Array.isArray(quizzes) && quizzes.map((quiz) => (
                            <motion.div
                                key={quiz.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow"
                            >
                                <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
                                    {quiz.title}
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base">{quiz.description}</p>
                                <div className="mt-4 flex justify-between">
                                    <Button
                                        onClick={() => handleEdit(quiz)}
                                        variant="outline"
                                        className="flex-1 mr-2 text-xs sm:text-sm"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(quiz.id)}
                                        variant="destructive"
                                        className="flex-1 text-xs sm:text-sm"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Quiz Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl p-6">
                        <DialogTitle className="text-2xl font-bold mb-4">
                            {editingQuiz ? "Edit Quiz" : "Add Quiz"}
                        </DialogTitle>
                        <div className="space-y-4">
                            <Input
                                placeholder="Title"
                                value={newQuiz.title}
                                onChange={(e) =>
                                    setNewQuiz({ ...newQuiz, title: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <Input
                                placeholder="Description"
                                value={newQuiz.description}
                                onChange={(e) =>
                                    setNewQuiz({ ...newQuiz, description: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSubmit} disabled={submitting} className="px-6 py-2">
                                {submitting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                    >
                                        <Loader2 className="w-5 h-5" />
                                    </motion.div>
                                ) : editingQuiz ? (
                                    "Update"
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
