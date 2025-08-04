"use client";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { gejalaList } from "@/data/bobotAbses";
import { diagnoseCBRKNN } from "@/lib/diagnoseCBRKNN";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardUser() {
  const [inputGejala, setInputGejala] = useState<Record<string, boolean>>({});
  const [hasil, setHasil] = useState<any>(null);
  const [threshold] = useState(85);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Ambil userId dari Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("✅ Login sebagai:", user.email, "UID:", user.uid);
      } else {
        console.warn("⚠️ Belum login, redirect atau tampilkan pesan.");
      }
    });
    return () => unsub();
  }, []);

  // Toggle checkbox gejala
  const toggleGejala = (nama: string) => {
    setInputGejala((prev) => ({ ...prev, [nama]: !prev[nama] }));
  };

  // Fungsi diagnosa
  const handleDiagnose = async () => {
    if (!userId) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    setLoading(true);
    setHasil(null);

    // Convert inputGejala ke array boolean sesuai urutan gejalaList
    const gejalaArray = gejalaList.map((g) => inputGejala[g] || false);
    console.log("📝 Gejala Array:", gejalaArray);

    try {
      const hasilDiagnosis = await diagnoseCBRKNN(userId, gejalaArray);
      console.log("📊 Hasil Diagnosis:", hasilDiagnosis);
      setHasil(hasilDiagnosis);
    } catch (error) {
      console.error("❌ Error diagnosa:", error);
      alert("Terjadi kesalahan saat proses diagnosa.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-4 text-green-800">
        🧑‍⚕️ Form Diagnosa Gejala
      </h1>

      {/* Form gejala */}
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

      {/* Tombol diagnosa */}
      <button
        onClick={handleDiagnose}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Diagnosa Sekarang"}
      </button>

      {/* Hasil diagnosa */}
      {hasil && (
        <div className="mt-6 p-4 bg-white rounded shadow border">
          {hasil.finalDiagnosis ? (
            <div className="bg-green-100 p-4 rounded">
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                ✅ Hasil Diagnosis
              </h2>
              <p>
                <strong>Diagnosis:</strong> {hasil.finalDiagnosis}
              </p>
              <p>
                <strong>Solusi:</strong> {hasil.solusi}
              </p>
              <p>Kecocokan di atas {threshold}%, diagnosis berhasil.</p>
            </div>
          ) : (
            <div className="bg-yellow-100 p-4 rounded">
              <h2 className="text-xl font-semibold text-yellow-700 mb-2">
                ⚠️ Perlu Peninjauan Pakar
              </h2>
              <p>
                Skor tertinggi kurang dari {threshold}%. Kasus dikirim ke pakar.
              </p>
            </div>
          )}

          {/* Tabel skor */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">📋 Semua Skor</h3>
            <ul className="list-disc ml-6">
              {hasil.allScores.map((item: any, i: number) => (
                <li key={i}>
                  {item.name}: {item.score}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
