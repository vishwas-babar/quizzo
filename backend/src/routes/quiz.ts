import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

// Zod schema for validation
const quizSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});

// ✅ Create a new quiz (POST /quizzes)
router.post("/quizzes", async (req, res) => {
    try {
        const { title, description } = quizSchema.parse(req.body);

        // Hardcoded teacher ID (since there's no authentication session)
        // const teacherId = req.body.id; // Replace this with dynamic authentication later

        const quiz = await prisma.quiz.create({
            data: { title, description },
        });
        res.status(201).json(quiz);
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ error: error.errors || "Invalid input" });
    }
});

// ✅ Get all quizzes (GET /quizzes)
router.get("/quizzes", async (req, res) => {
    try {
        const quizzes = await prisma.quiz.findMany();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
});

// ✅ Get a single quiz by ID (GET /quizzes/:id)
router.get("/quizzes/:id", async (req, res) => {
    try {
        const quizId = (req.params.id);
        const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });

        if (!quiz) {

            res.status(404).json({ error: "Quiz not found" });
            return;
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quiz" });
    }
});

// ✅ Update a quiz (PUT /quizzes/:id)
router.put("/quizzes/:id", async (req, res) => {
    try {
        const quizId = (req.params.id);
        const { title, description } = quizSchema.parse(req.body);

        const quiz = await prisma.quiz.update({
            where: { id: quizId },
            data: { title, description },
        });

        res.json(quiz);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || "Invalid input" });
    }
});

// ✅ Delete a quiz (DELETE /quizzes/:id)
router.delete("/quizzes/:id", async (req, res) => {
    try {
        const quizId = (req.params.id);

        await prisma.quiz.delete({ where: { id: quizId } });

        res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete quiz" });
    }
});

export default router;
