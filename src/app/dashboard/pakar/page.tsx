"use client";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import TambahKasusModal from "@/components/TambahKasusModal";
import EditKasusModal from "@/components/EditKasusModal";
import Header from "@/components/header";

interface Kasus {
  id: string;
  diagnosis: string;
  solusi: string;
  gejala: Record<string, boolean>;
}

export default function DashboardPakar() {
  const [kasusList, setKasusList] = useState<Kasus[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedKasus, setSelectedKasus] = useState<Kasus | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "kasus"), orderBy("created_at", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Kasus[];
      setKasusList(data);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus kasus ini?")) {
      await deleteDoc(doc(db, "kasus", id));
    }
  };

  return (
    <div className="space-y-6">
      <Header />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-800">
            🦷 Dashboard Pakar
          </h1>
          <p className="text-gray-600 text-sm">
            Manajemen data kasus diagnosis abses gigi
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-md transition"
        >
          + Tambah Kasus
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {kasusList.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg shadow border border-gray-200 transition hover:shadow-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold text-green-700">
                📌 {item.diagnosis}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedKasus(item);
                    setIsEditing(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Solusi:</span> {item.solusi}
            </p>
            <div>
              <p className="font-medium text-gray-800 mb-1">Gejala:</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(item.gejala).map(([gejala, status]) => (
                  <span
                    key={gejala}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {status ? "✅" : "❌"} {gejala}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && <TambahKasusModal onClose={() => setShowModal(false)} />}
      {isEditing && selectedKasus && (
        <EditKasusModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          kasusId={selectedKasus.id}
          kasus={selectedKasus}
        />
      )}
    </div>
  );
}
