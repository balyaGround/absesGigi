"use client";

import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Ambil data user dari Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;

        // Arahkan berdasarkan role
        if (role === "pakar") {
          window.location.href = "/dashboard/pakar";
        } else if (role === "user") {
          window.location.href = "/dashboard/user";
        } else {
          setError("Role tidak dikenali.");
        }
      } else {
        setError("Akun tidak ditemukan di database.");
      }
    } catch (err: any) {
      setError("Login gagal: " + err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Background Image Section */}
      <div className="relative w-full h-[100vh] block md:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/tes.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center text-white p-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Diagnosis Abses Gigi</h1>
            <p className="text-lg">
              Bantu diagnosa gejala penyakit abses gigi lebih awal menggunakan
              sistem pakar berbasis CBR (Case-Based Reasoning).
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Selamat Datang
          </h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
            >
              Login
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-green-600 font-medium hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
