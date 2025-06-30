"use client";
import { useState } from "react";

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

export default function DiagnosisForm({ onDiagnose }: any) {
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);

  const toggleGejala = (gejala: string) => {
    setSelectedGejala((prev) =>
      prev.includes(gejala)
        ? prev.filter((g) => g !== gejala)
        : [...prev, gejala]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDiagnose(selectedGejala);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Pilih Gejala yang Anda Alami:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {gejalaList.map((gejala) => (
          <label key={gejala} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedGejala.includes(gejala)}
              onChange={() => toggleGejala(gejala)}
              className="accent-green-600"
            />
            {gejala.replace(/_/g, " ")}
          </label>
        ))}
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Diagnosa Sekarang
      </button>
    </form>
  );
}
