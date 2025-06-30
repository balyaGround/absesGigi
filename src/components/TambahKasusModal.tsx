// components/TambahKasusModal.tsx
"use client";

import { useState } from "react";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const gejalaList = [
  "nyeri",
  "nyeriBerdenyut",
  "demam",
  "bengkak",
  "nanah",
  "bauMulut",
  "bekasCabutGigi",
  "gusiBengkak",
  "gusiMembesar",
  "gusiNgilu",
  "gigiGoyang",
  "sulitMengunyah",
  "sulitMembukaMulut",
  "kelenjarBengkak",
  "pembengkakanBawahRahang",
  "kesulitanMenelan",
  "tidakAdaGigiYangSakit",
];

export default function TambahKasusModal({ onClose }: { onClose: () => void }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [solusi, setSolusi] = useState("");
  const [gejala, setGejala] = useState<{ [key: string]: boolean }>({});

  const handleGejalaChange = (name: string) => {
    setGejala((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || !solusi.trim()) return;

    await addDoc(collection(db, "kasus"), {
      diagnosis,
      solusi,
      gejala,
      created_at: serverTimestamp(),
      created_by: "pakar",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Tambah Kasus Abses
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Solusi"
            value={solusi}
            onChange={(e) => setSolusi(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <div>
            <p className="font-medium mb-2">Gejala:</p>
            <div className="grid grid-cols-2 gap-2">
              {gejalaList.map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={gejala[item] || false}
                    onChange={() => handleGejalaChange(item)}
                  />
                  <span className="capitalize">
                    {item.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
