// Fungsi KNN berbobot untuk basis kasus Firestore
import { gejalaList } from "@/data/bobotAbses";

export interface BaseCase {
  diagnosis: string;
  solusi: string;
  gejala: Record<string, boolean>; // 0/1 di Firestore
  bobot: number[]; // array 9 angka (dari pakar)
}

export function diagnoseCBRKNN(
  inputGejala: Record<string, boolean>,
  baseCases: BaseCase[]
) {
  const inputVector = gejalaList.map((g) => (inputGejala[g] ? 1 : 0));

  const results = baseCases.map((kasus) => {
    const kasusVector = gejalaList.map((g) => (kasus.gejala[g] ? 1 : 0));
    const bobot = kasus.bobot; // bobot 9 angka

    let sum = 0;
    for (let i = 0; i < gejalaList.length; i++) {
      const diff = inputVector[i] - kasusVector[i];
      sum += Math.pow(diff * bobot[i], 2);
    }

    const distance = Math.sqrt(sum);
    const skor = Math.max(0, 100 - distance); // skala 0‑100 %

    return {
      diagnosis: kasus.diagnosis,
      solusi: kasus.solusi,
      skor: parseFloat(skor.toFixed(1)),
    };
  });

  return results.sort((a, b) => b.skor - a.skor).slice(0, 3); // Top‑3
}
