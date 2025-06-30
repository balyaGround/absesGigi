export default function HasilDiagnosis({ hasil }: any) {
  if (!hasil) return null;

  return (
    <div className="bg-white mt-6 p-4 rounded shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-2">
        🧠 Hasil Diagnosis
      </h2>
      <p>
        <strong>Diagnosis:</strong> {hasil.diagnosis}
      </p>
      <p>
        <strong>Solusi:</strong> {hasil.solusi}
      </p>
      <p>
        <strong>Kecocokan Gejala:</strong> {hasil.match}%
      </p>
    </div>
  );
}
