export const gejalaList = [
  "Demam",
  "Bau Mulut",
  "Rasa sakit yang berdenyut pada gigi atau gusi",
  "Rasa sakit yang menjalar ke telinga, rahang, dan leher",
  "Rasa sakit yang lebih parah saat berbaring",
  "Gusi bengkak, merah, dan mengilap",
  "Ngilu saat mengonsumsi makanan dan minuman",
  "Pembengkakan kelenjar getah bening (bawah rahang)",
  "Wajah membengkak",
  "Pembengkakan pada area sekitar gigi yang terinfeksi",
  "Sesak Nafas",
  "Keluar nanah dari benjolan pada gusi",
  "Gigi Goyang",
  "Gusi Berdarah Ketika disentuh",
  "Terdapat Plak Pada Gigi (Karang gigi)",
  "Merokok",
  "Suka Mengonsumsi Makanan dan Minuman Yang Manis",
];

export const bobotAbses: Record<string, number[]> = {
  "Abses Periodental": [5, 9, 8, 6, 4, 9, 5, 6, 5, 8, 3, 8, 8, 7, 8, 4, 5],
  "Abses Periapikal": [4, 7, 8, 7, 5, 5, 4, 5, 4, 8, 3, 7, 6, 5, 6, 3, 6],
  "Abses Gingiva": [4, 7, 6, 5, 3, 8, 4, 4, 3, 6, 2, 8, 4, 8, 8, 4, 4],
};

export const solusiAbses: Record<string, string> = {
  "Abses Periodental":
    "Membersihkan area gigi, scaling, pemberian antibiotik, dan kunjungan ke dokter gigi.",
  "Abses Periapikal":
    "Perawatan saluran akar atau pencabutan gigi. Segera konsultasi ke dokter gigi.",
  "Abses Gingiva":
    "Bersihkan area abses, gunakan antiseptik, dan konsultasikan pada dokter untuk evaluasi lebih lanjut.",
};
