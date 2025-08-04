import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function seedKasus() {
  const kasusRef = collection(db, "kasus");

  const pakarInfo = {
    nama: "Hilda Ayu Tamara",
    email: "hildaayu@gmail.com",
    jenis_kelamin: "perempuan",
    umur: 29,
    role: "pakar",
  };

  const dataKasus = [
    {
      diagnosis: "Abses Periodental",
      bobot: [3, 10, 2, 0, 5, 1, 0, 0, 10],
      solusi:
        "Membersihkan plak dan karang gigi secara profesional, perawatan gusi, serta pemberian antibiotik.",
      created_at: serverTimestamp(),
      created_by: pakarInfo,
    },
    {
      diagnosis: "Abses Periapikal",
      bobot: [1, 6, 10, 8, 1, 5, 9, 10, 5],
      solusi:
        "Perawatan saluran akar gigi atau pencabutan gigi yang terinfeksi, disertai antibiotik dan pereda nyeri.",
      created_at: serverTimestamp(),
      created_by: pakarInfo,
    },
    {
      diagnosis: "Abses Gingiva",
      bobot: [6, 8, 4, 2, 8, 0, 0, 10, 3],
      solusi:
        "Membersihkan area gusi, mengeluarkan nanah, dan pemberian obat kumur antiseptik.",
      created_at: serverTimestamp(),
      created_by: pakarInfo,
    },
  ];

  for (const kasus of dataKasus) {
    await addDoc(kasusRef, kasus);
    console.log(`✅ Berhasil tambah kasus: ${kasus.diagnosis}`);
  }

  console.log("✅ Semua data kasus berhasil di-seed.");
}

seedKasus()
  .then(() => console.log("Selesai."))
  .catch((err) => console.error("Gagal seeding:", err));
