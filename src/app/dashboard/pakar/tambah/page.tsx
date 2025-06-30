"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";

export default function TambahKasusPage() {
  const [diagnosis, setDiagnosis] = useState("");
  const [solusi, setSolusi] = useState("");
  const [gejala, setGejala] = useState({
    demam: false,
    bengkak: false,
    nyeri: false,
    gusi_bernanah: false,
    bau_mulut: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User belum login.");

      await addDoc(collection(db, "kasus"), {
        diagnosis,
        solusi,
        gejala,
        created_by: user.uid,
        created_at: serverTimestamp(),
      });

      alert("Kasus berhasil ditambahkan!");
      window.location.href = "/dashboard/pakar";
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  const handleCheckboxChange = (key: string) => {
    setGejala((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof gejala],
    }));
  };

  return (
    <div className="min-h-screen bg-white px-10 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Tambah Kasus Baru
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div>
          <label className="block font-medium mb-1">Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Solusi</label>
          <textarea
            value={solusi}
            onChange={(e) => setSolusi(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Gejala</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(gejala).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleCheckboxChange(key)}
                  className="accent-green-600"
                />
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
        >
          Simpan Kasus
        </button>
      </form>
    </div>
  );
}
