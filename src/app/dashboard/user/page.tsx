"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Header from "@/components/header";

export default function DashboardUser() {
  const [semuaKasus, setSemuaKasus] = useState<any[]>([]);
  const [inputGejala, setInputGejala] = useState<string[]>([]);
  const [hasilDiagnosis, setHasilDiagnosis] = useState<{
    diagnosis: string;
    solusi: string;
    match: number;
  } | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "kasus"));
      const data = snapshot.docs.map((doc) => doc.data());
      setSemuaKasus(data);
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (gejala: string) => {
    setInputGejala((prev) =>
      prev.includes(gejala)
        ? prev.filter((g) => g !== gejala)
        : [...prev, gejala]
    );
  };

  const handleDiagnose = () => {
    let kasusTerbaik: any = null;
    let skorTertinggi = 0;

    for (const kasus of semuaKasus) {
      const gejalaKasus = kasus.gejala || {};
      const cocok = inputGejala.filter((g) => gejalaKasus[g]);
      const skor = (cocok.length / Object.keys(gejalaKasus).length) * 100;

      if (skor > skorTertinggi) {
        skorTertinggi = skor;
        kasusTerbaik = kasus;
      }
    }

    setHasilDiagnosis({
      diagnosis: kasusTerbaik?.diagnosis || "Tidak ditemukan",
      solusi: kasusTerbaik?.solusi || "Silakan konsultasi lebih lanjut.",
      match: parseFloat(skorTertinggi.toFixed(1)),
    });
  };

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold text-green-800 mb-4">
        🧑‍⚕️ Form Diagnosa Gejala
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {gejalaList.map((gejala) => (
          <label key={gejala} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={inputGejala.includes(gejala)}
              onChange={() => handleCheckboxChange(gejala)}
              className="accent-green-600"
            />
            {gejala}
          </label>
        ))}
      </div>

      <button
        onClick={handleDiagnose}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Diagnosa Sekarang
      </button>

      {hasilDiagnosis && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Hasil Diagnosis
          </h2>
          <p>
            <strong>Diagnosis:</strong> {hasilDiagnosis.diagnosis}
          </p>
          <p>
            <strong>Solusi:</strong> {hasilDiagnosis.solusi}
          </p>
          <p>
            <strong>Kecocokan:</strong> {hasilDiagnosis.match}%
          </p>
        </div>
      )}
    </div>
  );
}
