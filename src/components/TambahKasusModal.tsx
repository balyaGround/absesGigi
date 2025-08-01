"use client";
import { useState } from "react";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const gejalaListCBR = [
  "Demam",
  "Bau Mulut",
  "Rasa sakit yang berdenyut pada gusi atau gigi",
  "Rasa sakit yang menjalar ke telinga, rahang, dan leher",
  "Gusi bengkak, merah dan mengilap",
  "Pembengkakan kelenjar getah bening",
  "Pembengkakan area di gigi yang terinfeksi",
  "Keluar nanah dari benjolan pada gusi",
  "Gigi goyang",
];

const diagnosisOptions = [
  "Abses Periodental",
  "Abses Periapikal",
  "Abses Gingiva",
];

export default function TambahKasusModal({ onClose }: { onClose: () => void }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [solusi, setSolusi] = useState("");
  const [gejala, setGejala] = useState<Record<string, boolean>>({});
  const [bobot, setBobot] = useState<number[]>(
    Array(gejalaListCBR.length).fill(0)
  );

  const handleGejalaChange = (nama: string) => {
    setGejala((prev) => ({ ...prev, [nama]: !prev[nama] }));
  };

  const handleBobotChange = (index: number, val: string) => {
    const newBobot = [...bobot];
    newBobot[index] = parseInt(val) || 0;
    setBobot(newBobot);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis || !solusi || bobot.length !== 9) return;

    await addDoc(collection(db, "kasus"), {
      diagnosis,
      solusi,
      gejala,
      bobot,
      created_at: serverTimestamp(),
      created_by: "pakar",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Tambah Kasus Abses
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Pilih Diagnosis</option>
            {diagnosisOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Solusi..."
            value={solusi}
            onChange={(e) => setSolusi(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div>
            <p className="font-medium mb-2">Gejala & Bobot:</p>
            <div className="space-y-2">
              {gejalaListCBR.map((nama, i) => (
                <div key={i} className="flex items-center gap-3">
                  <label className="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={gejala[nama] || false}
                      onChange={() => handleGejalaChange(nama)}
                    />
                    <span>{nama}</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={bobot[i]}
                    onChange={(e) => handleBobotChange(i, e.target.value)}
                    className="w-16 border rounded px-2 py-1 text-center"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
