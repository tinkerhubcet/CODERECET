"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, UserPlus, Heart, ArrowLeft } from "lucide-react";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/register", { email, password });
            alert("Signup successful! Redirecting to signin ...");
            router.push("/signin");
        } catch (error) {
            console.error(error);
            alert("Signup failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                Vitalis
                            </span>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Home
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <UserPlus className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-center text-gray-900">
                            Join Vitalis
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600 text-lg">
                            Create your account to start your wellness journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8">
                        <form onSubmit={handleSignUp} className="space-y-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-gray-700 font-medium"
                                >
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-gray-700 font-medium"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a password"
                                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                Create Account
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center px-8 pb-8">
                        <div className="text-sm text-center text-gray-500">
                            Already have an account?{" "}
                            <a
                                href="/signin"
                                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                            >
                                Sign in
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SignUp;
