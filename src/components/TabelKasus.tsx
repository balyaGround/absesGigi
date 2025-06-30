"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import EditKasusModal from "./EditKasusModal";

interface Kasus {
  id: string;
  diagnosis: string;
  solusi: string;
  gejala: Record<string, boolean>;
}

export default function TabelKasus() {
  const [kasusList, setKasusList] = useState<Kasus[]>([]);
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
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border text-sm">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3 text-left">Diagnosis</th>
            <th className="p-3 text-left">Solusi</th>
            <th className="p-3 text-left">Gejala</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kasusList.map((kasus) => (
            <tr key={kasus.id} className="border-b hover:bg-gray-100">
              <td className="p-3 font-medium text-green-800">
                {kasus.diagnosis}
              </td>
              <td className="p-3">{kasus.solusi}</td>
              <td className="p-3">
                {Object.entries(kasus.gejala)
                  .filter(([_, v]) => v)
                  .map(([k]) => k)
                  .join(", ")}
              </td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedKasus(kasus);
                    setIsEditing(true);
                  }}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(kasus.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Edit */}
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
