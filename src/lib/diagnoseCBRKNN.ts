import { db } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

interface DiagnosisResult {
  name: string;
  score: number;
  solusi?: string;
}

// Fungsi hitung cosine similarity
function cosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

export async function diagnoseCBRKNN(userId: string, gejala: boolean[]) {
  // 1️⃣ Ambil info user dari Firestore
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) throw new Error("User tidak ditemukan");

  const userInfo = userDoc.data();

  // 2️⃣ Cek caseBase dulu
  const caseBaseRef = collection(db, "caseBase");
  const q = query(caseBaseRef, where("gejala", "==", gejala));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const caseData = snapshot.docs[0].data();
    return {
      fromCaseBase: true,
      finalDiagnosis: caseData.finalDiagnosis,
      solusi: caseData.solusi,
      allScores: caseData.allScores,
    };
  }

  // 3️⃣ Ambil data bobot pakar dari koleksi `kasus`
  const kasusSnapshot = await getDocs(collection(db, "kasus"));
  const kasusList: { diagnosis: string; bobot: number[]; solusi: string }[] =
    [];
  kasusSnapshot.forEach((doc) => {
    const data = doc.data();
    kasusList.push({
      diagnosis: data.diagnosis,
      bobot: data.bobot,
      solusi: data.solusi,
    });
  });

  // 4️⃣ Ubah gejala user ke vector bobot (10 kalau dicentang, 0 kalau tidak)
  const userVector = gejala.map((checked) => (checked ? 10 : 0));

  // 5️⃣ Hitung similarity untuk semua kasus
  const rawResults: DiagnosisResult[] = kasusList.map((k) => ({
    name: k.diagnosis,
    score: parseFloat((cosineSimilarity(userVector, k.bobot) * 100).toFixed(1)),
    solusi: k.solusi,
  }));

  // 6️⃣ Gabungkan berdasarkan diagnosis → ambil rata-rata skor
  const groupedScores: Record<
    string,
    { total: number; count: number; solusi?: string }
  > = {};
  for (const r of rawResults) {
    if (!groupedScores[r.name]) {
      groupedScores[r.name] = { total: r.score, count: 1, solusi: r.solusi };
    } else {
      groupedScores[r.name].total += r.score;
      groupedScores[r.name].count += 1;
    }
  }

  const results: DiagnosisResult[] = Object.entries(groupedScores).map(
    ([name, data]) => ({
      name,
      score: parseFloat((data.total / data.count).toFixed(1)), // rata-rata
      solusi: data.solusi,
    })
  );

  // 7️⃣ Urutkan dari skor tertinggi
  results.sort((a, b) => b.score - a.score);

  const threshold = 85;
  const highest = results[0];

  if (highest && highest.score >= threshold) {
    // Simpan ke caseBase
    await addDoc(collection(db, "caseBase"), {
      gejala,
      finalDiagnosis: highest.name,
      solusi: highest.solusi,
      allScores: results,
      created_at: serverTimestamp(),
      created_by: {
        nama: "Hilda Ayu Tamara",
        email: "hildaayu@gmail.com",
        jenis_kelamin: "perempuan",
        umur: 29,
        role: "pakar",
      },
    });
    return {
      fromCaseBase: false,
      finalDiagnosis: highest.name,
      solusi: highest.solusi,
      allScores: results,
    };
  } else {
    // Simpan ke pendingCases
    await addDoc(collection(db, "pendingCases"), {
      gejala,
      user_id: userId,
      user_info: userInfo,
      allScores: results,
      status: "pending",
      created_at: serverTimestamp(),
    });
    return {
      fromCaseBase: false,
      finalDiagnosis: null,
      solusi: null,
      allScores: results,
    };
  }
}
