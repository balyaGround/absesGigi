"use client";

import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [umur, setUmur] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        nama: nama,
        jenis_kelamin: jenisKelamin,
        umur: parseInt(umur), // ubah ke number agar konsisten di Firestore
        created_at: serverTimestamp(),
      });

      setSuccess("Berhasil daftar! Silakan login.");
      setError("");

      // Reset form field
      setNama("");
      setJenisKelamin("");
      setUmur("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err: any) {
      setError("Registrasi gagal: " + err.message);
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Bagian gambar kiri */}
      <div className="relative hidden md:block w-full h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/tes.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center text-white p-10 z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Buat Akun</h1>
            <p className="text-lg">
              Bergabunglah untuk menggunakan sistem diagnosis abses gigi
              berbasis CBR.
            </p>
          </div>
        </div>
      </div>

      {/* Form Register */}
      <div className="flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Daftar Sekarang
          </h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}
          <form onSubmit={handleRegister} className="space-y-5">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <select
              value={jenisKelamin}
              onChange={(e) => setJenisKelamin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>

            <input
              type="number"
              placeholder="Umur"
              value={umur}
              onChange={(e) => setUmur(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

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

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 hidden"
              required
            >
              <option value="user">User</option>
              <option value="pakar">Pakar</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
            >
              Daftar
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-green-600 font-medium hover:underline"
            >
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
