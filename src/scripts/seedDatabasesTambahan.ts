import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function seedFirestoreGejalaFull() {
  // Urutan gejala sesuai daftar lo (9 gejala)
  const gejalaCaseBase = [
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
  ];
  const gejalaPending = [
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
  ];
  const gejalaRequest = [
    true,
    true,
    false,
    false,
    true,
    false,
    true,
    false,
    false,
  ];

  // Info user dari database (user_id yang udah ada)
  const userId = "kNZqgD5DTqW398KimbZbiqwLPKr2";
  const userInfo = {
    nama: "Balya",
    email: "balya@gmail.com",
    jenis_kelamin: "laki-laki",
    umur: 29,
    role: "user",
  };

  // Info pakar untuk caseBase
  const pakarInfo = {
    nama: "Hilda Ayu Tamara",
    email: "hildaayu@gmail.com",
    jenis_kelamin: "perempuan",
    umur: 29,
    role: "pakar",
  };

  // 🔹 caseBase (kasus final)
  await addDoc(collection(db, "caseBase"), {
    gejala: gejalaCaseBase,
    finalDiagnosis: "Abses Gingiva",
    solusi:
      "Membersihkan area gusi, mengeluarkan nanah, dan pemberian obat kumur antiseptik.",
    allScores: [
      { name: "Abses Gingiva", score: 92.5 },
      { name: "Abses Periodental", score: 75.3 },
      { name: "Abses Periapikal", score: 68.1 },
    ],
    created_at: serverTimestamp(),
    created_by: pakarInfo,
  });

  // 🔹 pendingCases (menunggu penilaian pakar)
  await addDoc(collection(db, "pendingCases"), {
    gejala: gejalaPending,
    user_id: userId,
    user_info: userInfo,
    allScores: [
      { name: "Abses Gingiva", score: 84.9 },
      { name: "Abses Periapikal", score: 79.8 },
      { name: "Abses Periodental", score: 70.2 },
    ],
    status: "pending",
    created_at: serverTimestamp(),
  });

  // 🔹 permintaan_user (riwayat permintaan diagnosis)
  await addDoc(collection(db, "permintaan_user"), {
    user_id: userId,
    user_info: userInfo,
    gejala: gejalaRequest,
    status: "processed",
    created_at: serverTimestamp(),
  });

  console.log(
    "✅ Seed Firestore lengkap dengan gejala & user_info berhasil dibuat."
  );
}

seedFirestoreGejalaFull()
  .then(() => console.log("Selesai."))
  .catch((err) => console.error("Gagal seeding:", err));
