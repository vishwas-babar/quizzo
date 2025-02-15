"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

interface Quiz {
    id: number;
    title: string;
    description: string;
    createdAt: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ title?: string }>({});

    // Authentication check
    useEffect(() => {
        if (!localStorage.getItem("isLoggedIn")) {
            router.push("/login");
        }
    }, [router]);

    // Fetch quizzes
    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const data = await getQuizzes();
                setQuizzes(data);
            } finally {
                setLoading(false);
            }
        };
        loadQuizzes();
    }, []);

    // Form validation
    const validateForm = () => {
        const newErrors: { title?: string } = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            if (editingQuiz) {
                await updateQuiz(editingQuiz.id, formData);
            } else {
                await createQuiz(formData);
            }
            setQuizzes(await getQuizzes());
            resetForm();
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete confirmation
    const handleDelete = async (id: number) => {
        await deleteQuiz(id);
        setQuizzes(await getQuizzes());
    };

    // Reset form state
    const resetForm = () => {
        setFormData({ title: "", description: "" });
        setEditingQuiz(null);
        setIsDialogOpen(false);
        setErrors({});
    };

    // Card animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 bg-clip-text">
                        Quiz Dashboard
                    </h1>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="gap-2 shadow-lg hover:shadow-md transition-shadow"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Quiz
                    </Button>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-40 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {quizzes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {quizzes.map((quiz) => (
                                    <motion.div
                                        key={quiz.id}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                    >
                                        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="truncate">{quiz.title}</CardTitle>
                                                <CardDescription className="line-clamp-3">
                                                    {quiz.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <div className="flex-1 px-6 pb-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <CardFooter className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingQuiz(quiz);
                                                        setFormData({
                                                            title: quiz.title,
                                                            description: quiz.description
                                                        });
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Confirm Deletion
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this quiz? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(quiz.id)}
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Confirm Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-96 text-center"
                            >
                                <div className="text-muted-foreground space-y-4">
                                    <div className="text-6xl">📭</div>
                                    <h2 className="text-xl font-semibold">No quizzes found</h2>
                                    <p>Get started by creating your first quiz</p>
                                    <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                                        Create Quiz
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={errors.title ? "border-destructive" : ""}
                                placeholder="Enter quiz title"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter quiz description"
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="gap-2"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : editingQuiz ? (
                                "Update Quiz"
                            ) : (
                                "Create Quiz"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}