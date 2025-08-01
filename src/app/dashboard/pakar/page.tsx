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
      query(collection(db, "kasus_pending"), orderBy("created_at", "desc")),
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

  const handleSubmit = async (permintaan_user: any) => {
    if (!diagnosa || !solusi) {
      alert("Harap lengkapi diagnosis dan solusi");
      return;
    }

    const bobot = getDefaultBobot(diagnosa);

    await addDoc(collection(db, "kasus"), {
      diagnosis: diagnosa,
      solusi,
      gejala: permintaan_user.gejala,
      bobot,
      created_at: new Date(),
    });

    await deleteDoc(doc(db, "permintaan_user", permintaan_user.id));
    setDiagnosa("");
    setSolusi("");
    setSelectedId(null);
  };

  const getDefaultBobot = (diagnosis: string) => {
    const defaultBobot: Record<string, number[]> = {
      "Abses Periodental": [3, 10, 2, 0, 5, 1, 0, 0, 10],
      "Abses Periapikal": [1, 6, 10, 8, 1, 5, 9, 10, 5],
      "Abses Gingiva": [6, 8, 4, 2, 8, 0, 0, 10, 3],
    };
    return defaultBobot[diagnosis] || Array(9).fill(1);
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

        {/* Kasus Baru */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kasusList.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <h2 className="text-xl font-bold text-green-700 mb-1">
                📌 {item.diagnosis}
              </h2>
              <p className="mb-2 text-sm text-gray-700">
                <strong>Solusi:</strong> {item.solusi}
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.gejala).map(([gejala, val]) => (
                  <span
                    key={gejala}
                    className={`px-2 py-1 rounded-full text-xs ${
                      val
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {val ? "✅" : "❌"} {gejala}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pending */}
        {pendingList.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              🔍 Kasus Pending Peninjauan
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {pendingList.map((permintaan_user) => (
                <div
                  key={permintaan_user.id}
                  className="bg-yellow-50 p-5 rounded shadow border border-yellow-200"
                >
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Kasus dari User (Perlu Diagnosis)
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(permintaan_user.gejala).map(([g, v]) => (
                      <span
                        key={g}
                        className={`px-2 py-1 rounded-full text-xs ${
                          v
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {v ? "✅" : "❌"} {g}
                      </span>
                    ))}
                  </div>

                  {/* Form Diagnosa */}
                  <div className="mb-2">
                    <label className="text-sm font-medium">Diagnosis:</label>
                    <select
                      className="border px-3 py-2 w-full mb-3"
                      value={selectedId === permintaan_user.id ? diagnosa : ""}
                      onChange={(e) => {
                        setSelectedId(permintaan_user.id);
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
                      value={selectedId === permintaan_user.id ? solusi : ""}
                      onChange={(e) => {
                        setSelectedId(permintaan_user.id);
                        setSolusi(e.target.value);
                      }}
                    />
                  </div>

                  <button
                    onClick={() => handleSubmit(permintaan_user)}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                  >
                    Simpan Kasus
                  </button>
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
