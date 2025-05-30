import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least of 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      <div className="h-screen grid lg:grid-cols-2 bg-gray-950 text-white">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8 glass-card border border-primary/10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-colors">
                  <img
                    src="../../public/lilycode-logo2.png"
                    alt="Logo"
                    className="w-8 h-8 object-contain" // Adjust width & height as needed
                  />
                </div>
                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                <p className="text-sm text-gray-400">Login to your account</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">
                    Email
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full pl-10 py-2 rounded-md border text-sm bg-white/5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-white placeholder-gray-400 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full pl-10 py-2 rounded-md border text-sm bg-white/5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066ff] text-white placeholder-gray-400 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="my-g-btns w-full py-2 rounded-md font-semibold flex items-center justify-center"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center text-sm text-gray-400 pt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#0066ff] underline hover:text-[#84b1ff]"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Pattern */}
        <AuthImagePattern
          title={"Welcome back!"}
          subtitle={
            "Sign in to continue your journey with us. Don't have an account? Create one now."
          }
        />
      </div>
    </>
  );
};

export default LoginPage;
