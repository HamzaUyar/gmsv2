"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/"
      });

      if (result?.error) {
        console.error("SignIn error:", result.error);
        setError("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        // Get the user role from the username to redirect to the appropriate dashboard
        let redirectPath = "/";
        
        if (username.includes("std")) {
          redirectPath = "/student";
        } else if (username.includes("adv")) {
          redirectPath = "/advisor";
        } else if (username.includes("dep")) {
          redirectPath = "/department";
        } else if (username.includes("fac")) {
          redirectPath = "/faculty";
        } else if (username.includes("aff")) {
          redirectPath = "/student-affairs";
        }
        
        // Redirect to role-specific dashboard
        router.push(redirectPath);
        router.refresh();
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-8">
      <Card className="w-full max-w-lg p-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-[rgb(var(--iyte-red))]">
          Sign In to GMS
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-800 font-semibold mb-2">
              UBYS ID
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your UBYS ID (e.g., ubys_std_001)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(var(--iyte-red))] focus:border-transparent transition-shadow duration-200"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Demo IDs: ubys_std_001, ubys_adv_001, ubys_dep_001, ubys_fac_001, ubys_aff_001
            </p>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-800 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Any password works for this demo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(var(--iyte-red))] focus:border-transparent transition-shadow duration-200"
              required
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
            className={isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p>This is a demonstration system. For testing purposes, any password will work with the provided demo UBYS IDs.</p>
        </div>
      </Card>
    </div>
  );
} 