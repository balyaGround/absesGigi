export default function DashboardUser() {
  return (
    <div className="min-h-screen bg-white px-10 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Dashboard Pengguna
      </h1>
      <p className="text-gray-700 mb-4">
        Selamat datang! Silakan input gejala yang Anda rasakan untuk mendapatkan
        hasil diagnosis awal.
      </p>

      <div className="mt-8 p-6 bg-gray-50 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-600">
          🩺 Mulai Diagnosis
        </h2>
        <p className="text-gray-600">
          Form input gejala akan ditampilkan di sini nanti.
        </p>
      </div>
    </div>
  );
}
