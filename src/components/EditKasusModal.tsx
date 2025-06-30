"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface EditKasusModalProps {
  isOpen: boolean;
  onClose: () => void;
  kasusId: string;
  kasus: {
    diagnosis: string;
    solusi: string;
    gejala: Record<string, boolean>;
  };
}

const semuaGejala = [
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

export default function EditKasusModal({
  isOpen,
  onClose,
  kasusId,
  kasus,
}: EditKasusModalProps) {
  const [diagnosis, setDiagnosis] = useState(kasus.diagnosis);
  const [solusi, setSolusi] = useState(kasus.solusi);
  const [gejala, setGejala] = useState<Record<string, boolean>>(kasus.gejala);

  const toggleGejala = (nama: string) => {
    setGejala((prev) => ({ ...prev, [nama]: !prev[nama] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const docRef = doc(db, "kasus", kasusId);
    await updateDoc(docRef, {
      diagnosis,
      solusi,
      gejala,
      updated_at: new Date(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md w-full max-w-lg shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold text-green-700 mb-2">
          Edit Kasus Abses Gigi
        </h2>

        <input
          type="text"
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <textarea
          placeholder="Solusi"
          value={solusi}
          onChange={(e) => setSolusi(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <div>
          <p className="font-medium text-sm mb-2">Pilih Gejala:</p>
          <div className="grid grid-cols-2 gap-2">
            {semuaGejala.map((nama) => (
              <label key={nama} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!gejala[nama]}
                  onChange={() => toggleGejala(nama)}
                />
                {nama}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
