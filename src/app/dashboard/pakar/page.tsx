"use client";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { gejalaList } from "@/data/bobotAbses";

export default function DashboardPakar() {
  const [kasusList, setKasusList] = useState<any[]>([]);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [diagnosa, setDiagnosa] = useState("");
  const [solusi, setSolusi] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Ambil data kasus & pending dari Firestore
  useEffect(() => {
    const unsub1 = onSnapshot(
      query(collection(db, "kasus"), orderBy("created_at", "desc")),
      (snapshot) => {
        setKasusList(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );

    const unsub2 = onSnapshot(
      query(collection(db, "pendingCases"), orderBy("created_at", "desc")),
      (snapshot) => {
        setPendingList(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Simpan kasus dari pending ke koleksi kasus
  const handleSubmit = async (pendingCase: any) => {
    if (!diagnosa || !solusi) {
      alert("Harap lengkapi diagnosis dan solusi");
      return;
    }

    const bobot = getDefaultBobot(diagnosa);

    await addDoc(collection(db, "kasus"), {
      diagnosis: diagnosa,
      solusi,
      gejala: pendingCase.gejala,
      bobot,
      created_at: serverTimestamp(),
    });

    await deleteDoc(doc(db, "pendingCases", pendingCase.id));
    setDiagnosa("");
    setSolusi("");
    setSelectedId(null);
  };

  // Bobot default untuk tiap diagnosis
  const getDefaultBobot = (diagnosis: string) => {
    const defaultBobot: Record<string, number[]> = {
      "Abses Periodental": [3, 10, 2, 0, 5, 1, 0, 0, 10],
      "Abses Periapikal": [1, 6, 10, 8, 1, 5, 9, 10, 5],
      "Abses Gingiva": [6, 8, 4, 2, 8, 0, 0, 10, 3],
    };
    return defaultBobot[diagnosis] || Array(gejalaList.length).fill(0);
  };

  return (
    <div className="space-y-8">
      <Header />

      <div className="px-6">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          🦷 Dashboard Pakar
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Manajemen Kasus & Peninjauan Diagnosa User
        </p>

        {/* Kasus Final */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kasusList.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow border"
            >
              <h2 className="text-xl font-bold text-green-700 mb-1">
                📌 {item.diagnosis}
              </h2>
              <p className="mb-2 text-sm text-gray-700">
                <strong>Solusi:</strong> {item.solusi}
              </p>

              <div className="flex flex-wrap gap-2">
                {Array.isArray(item.bobot) &&
                  item.bobot.map((b: number, idx: number) => {
                    if (b > 0) {
                      return (
                        <span
                          key={gejalaList[idx]}
                          className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                        >
                          ✅ {gejalaList[idx]}{" "}
                          <span className="font-semibold">({b})</span>
                        </span>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Cases */}
        {pendingList.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              🔍 Kasus Pending Peninjauan
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {pendingList.map((pendingCase) => (
                <div
                  key={pendingCase.id}
                  className="bg-yellow-50 p-5 rounded shadow border border-yellow-200"
                >
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Kasus dari {pendingCase.user_info?.nama || "User"} (
                    {pendingCase.user_info?.email || "Tidak ada email"})
                  </h3>

                  {/* Gejala */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {gejalaList.map((g, idx) => (
                      <span
                        key={g}
                        className={`px-2 py-1 rounded-full text-xs ${
                          pendingCase.gejala?.[idx]
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pendingCase.gejala?.[idx] ? "✅" : "❌"} {g}
                      </span>
                    ))}
                  </div>

                  {/* Form Diagnosa */}
                  <div className="mb-2">
                    <label className="text-sm font-medium">Diagnosis:</label>
                    <select
                      className="border px-3 py-2 w-full mb-3"
                      value={selectedId === pendingCase.id ? diagnosa : ""}
                      onChange={(e) => {
                        setSelectedId(pendingCase.id);
                        setDiagnosa(e.target.value);
                      }}
                    >
                      <option value="">-- Pilih Diagnosa --</option>
                      <option value="Abses Periodental">
                        Abses Periodental
                      </option>
                      <option value="Abses Periapikal">Abses Periapikal</option>
                      <option value="Abses Gingiva">Abses Gingiva</option>
                    </select>

                    <textarea
                      placeholder="Tulis solusi..."
                      className="border px-3 py-2 w-full"
                      value={selectedId === pendingCase.id ? solusi : ""}
                      onChange={(e) => {
                        setSelectedId(pendingCase.id);
                        setSolusi(e.target.value);
                      }}
                    />
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmit(pendingCase)}
                      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                    >
                      Simpan Kasus
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Yakin mau hapus kasus ini?")) {
                          await deleteDoc(
                            doc(db, "pendingCases", pendingCase.id)
                          );
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
