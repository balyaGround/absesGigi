"use client";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { diagnoseCBRKNN, BaseCase } from "@/lib/diagnoseCBRKNN";
import { gejalaList } from "@/data/bobotAbses";

export default function DashboardUser() {
  const [inputGejala, setInputGejala] = useState<Record<string, boolean>>({});
  const [hasil, setHasil] = useState<{ diagnosis: string; skor: number }[]>([]);
  const [threshold] = useState(85);
  const [berhasilKirim, setBerhasilKirim] = useState(false);
  const [baseCases, setBaseCases] = useState<BaseCase[]>([]);

  type FinalDiagnosis = {
    diagnosis: string;
    solusi: string;
    skor: number;
  };

  const [final, setFinal] = useState<FinalDiagnosis | null>(null);

  // ✅ Ambil basecase dari firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "kasus"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          diagnosis: d.diagnosis,
          solusi: d.solusi,
          gejala: d.gejala,
          bobot: d.bobot || [],
        };
      });
      setBaseCases(data);
    });
    return () => unsub();
  }, []);

  // ⬅️ Toggle checkbox
  const toggleGejala = (nama: string) => {
    setInputGejala((prev) => ({ ...prev, [nama]: !prev[nama] }));
  };

  // 🔍 Diagnosa
  const handleDiagnose = async () => {
    setBerhasilKirim(false);
    const hasilDiagnosis = diagnoseCBRKNN(inputGejala, baseCases);
    setHasil(hasilDiagnosis);

    const diAtasThreshold = hasilDiagnosis.filter((d) => d.skor >= threshold);
    if (diAtasThreshold.length > 0) {
      setFinal(diAtasThreshold[0]);
    } else {
      setFinal(null);
      // ⏫ Kirim permintaan ke pakar
      await addDoc(collection(db, "permintaan_user"), {
        gejala: inputGejala,
        skorDiagnosis: hasilDiagnosis,
        created_at: serverTimestamp(),
      });
      setBerhasilKirim(true);
    }
  };

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-4 text-green-800">
        🧑‍⚕️ Form Diagnosa Gejala
      </h1>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {gejalaList.map((item) => (
          <label key={item} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inputGejala[item] || false}
              onChange={() => toggleGejala(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleDiagnose}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Diagnosa Sekarang
      </button>

      {/* Hasil Diagnosa */}
      {final && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded shadow">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Hasil Diagnosis
          </h2>
          <p>
            <strong>Diagnosis:</strong> {final.diagnosis}
          </p>
          <p>
            <strong>Keterangan:</strong> Kecocokan di atas {threshold}%, sistem
            berhasil menentukan diagnosis.
          </p>
          <p>
            <strong>Solusi:</strong> {final.solusi}
          </p>
        </div>
      )}

      {/* Jika Tidak Ada yang lolos threshold */}
      {!final && hasil.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded shadow">
          <p className="font-bold mb-2">Perlu Peninjauan Pakar</p>
          <p>
            Skor tertinggi kurang dari {threshold}%. Kasus dikirim ke pakar
            untuk revisi.
          </p>
          <ul className="list-disc ml-6 mt-2">
            {hasil.map((item) => (
              <li key={item.diagnosis}>
                {item.diagnosis}: {item.skor.toFixed(1)}%
              </li>
            ))}
          </ul>
          {berhasilKirim && (
            <p className="mt-2 text-green-700">
              ✅ Permintaan berhasil dikirim ke pakar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
