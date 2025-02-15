"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const signupSchema = z.object({
    username: z.string().min(3, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
    const router = useRouter();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup`, data);
            if (res.status === 201) {
                // Redirect to login page after successful signup
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("id", res.data.user.id);
                window.location.href = "/dashboard";
            }
        } catch (err) {
            console.error(err);
            setError("Signup failed, please try again");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input
                            {...register("username")}
                            placeholder="Username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message as string}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            {...register("password")}
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
                        )}
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                            >
                                <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full" />
                            </motion.div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <button
                            onClick={() => router.push("/login")}
                            className="font-medium text-indigo-600 hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
