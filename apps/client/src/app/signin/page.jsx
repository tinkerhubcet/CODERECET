'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/authProvider";
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
import { Mail, Lock, Heart, ArrowLeft } from "lucide-react";
import api from "@/services/api";
import { jwtDecode } from "jwt-decode";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
      const router = useRouter();
  const { login } = useUser();

  const extractInfo = (token) => {
    const decoded = jwtDecode(token);
    const userId = decoded.id;
   
    return {
      token: token,
      userId: userId,
    
    };
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/user/login", { email, password });

      if (response.status === 200) {
        const userData = response.data.data;
        login(userData.accessToken);
        router.push('/home')
       
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
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
              <span className="text-2xl font-bold text-gray-900">Vitalis</span>
            </div>
            <button 
              onClick={() => router.push('/')}
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
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg">
              Sign in to access your wellness dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
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
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Sign in
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
            <div className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Sign up
              </a>
            </div>
            <div className="text-sm text-center">
              <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;

