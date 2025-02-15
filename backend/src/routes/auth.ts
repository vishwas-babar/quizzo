import express from "express";

import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../prisma";

const router = express.Router();;

// Zod schema for validation
const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

// POST /login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = loginSchema.parse(req.body);

        // Find user in DB
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
             res.status(401).json({ error: "Invalid credentials" });
            return
        }

        // Success response
        res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || "Invalid input" });
    }
});


router.post("/signup", async (req, res) => {
    try {
        // Validate request data using Zod
        const { username, password } = loginSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "Signup successful",
            user: { id: newUser.id, username: newUser.username },
        });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
});

export default router;
