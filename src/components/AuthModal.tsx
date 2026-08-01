"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleDashed, Lock, Mail, User, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

interface propType {
  open: boolean;
  onClose: () => void;
}
type stepType = "login" | "signup" | "otp";

function AuthModal({ open, onClose }: propType) {
  const [step, setStep] = useState<stepType>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { data } = useSession();
  console.log("data", data);
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const data = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log(data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErr(
        error.response.data.message
          ? error.response.data.message
          : "Something went wrong",
      );
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    console.log(res);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google");
    setLoading(false);
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" fixed inset-0 z-[90] bg-black/80  backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black">
                <div
                  className="absolute right-4 top-4 text-gray-500 hover:text-black transition"
                  onClick={onClose}
                >
                  <X size={20} />
                </div>
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-extrabold tracking-widest">
                    Ridex
                  </h1>
                  <div className="mt-1 text-xs text-gray-500">
                    Premium Vehicle Booking
                  </div>
                </div>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full h-11 rounded-xl border border-black/20 flex items-center justify-center gap-3 text-sm font-semibold hover:bg-black hover:text-white transition"
                >
                  <Image
                    src="/google.png"
                    alt="google"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </button>
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-black/10" />
                  <div className="text-xs text-gray-500">OR</div>
                  <div className="flex-1 h-px bg-black/10" />
                </div>
                <div>
                  {step == "login" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className=""
                    >
                      <h1 className="text-xl font-semibold">Welcome Back</h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={20} className="text-gray-500" />
                          <input
                            type="email"
                            placeholder="Email"
                            className="text-gray-500"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={20} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="text-gray-500"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          />
                        </div>
                        <button
                          onClick={handleLogin}
                          disabled={loading}
                          className="w-full h-11 flex justify-center items-center rounded-xl bg-black text-white font semibold hover:bg-gray-900 transition"
                        >
                          {loading ? (
                            <CircleDashed
                              size={18}
                              color="white"
                              className="animate-spin"
                            />
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>
                      <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <span
                          onClick={() => setStep("signup")}
                          className="text-black font-medium hover:underline"
                        >
                          Sign Up
                        </span>
                      </p>
                    </motion.div>
                  )}
                  {step == "signup" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className=""
                    >
                      <h1 className="text-xl font-semibold">Create Account</h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <User size={20} className="text-gray-500" />
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="text-gray-500"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                          />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={20} className="text-gray-500" />
                          <input
                            type="email"
                            placeholder="Email"
                            className="text-gray-500"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={20} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="text-gray-500"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          />
                        </div>

                        {err && (
                          <p className=" text-red-500 capitalize">{err}!</p>
                        )}
                        <button
                          onClick={handleSignUp}
                          disabled={loading}
                          className="w-full h-11 rounded-xl flex justify-center items-center bg-black text-white font semibold hover:bg-gray-900 transition"
                        >
                          {loading ? (
                            <CircleDashed
                              size={18}
                              color="white"
                              className="animate-spin"
                            />
                          ) : (
                            "Sign up"
                          )}
                        </button>
                      </div>
                      <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an Account?{" "}
                        <span
                          onClick={() => setStep("login")}
                          className="text-black font-medium hover:underline"
                        >
                          Login
                        </span>
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AuthModal;
