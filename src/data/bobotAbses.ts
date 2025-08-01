export const gejalaList = [
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

export const bobotAbses: Record<string, number[]> = {
  "Abses Periodental": [3, 10, 2, 0, 5, 1, 0, 0, 10],
  "Abses Periapikal": [1, 6, 10, 8, 1, 5, 9, 10, 5],
  "Abses Gingiva": [6, 8, 4, 2, 8, 0, 0, 10, 3],
};

export const solusiAbses: Record<string, string> = {
  "Abses Periodental":
    "Membersihkan area gigi, scaling, pemberian antibiotik, dan kunjungan ke dokter gigi.",
  "Abses Periapikal":
    "Perawatan saluran akar atau pencabutan gigi. Segera konsultasi ke dokter gigi.",
  "Abses Gingiva":
    "Bersihkan area abses, gunakan antiseptik, dan konsultasikan pada dokter untuk evaluasi lebih lanjut.",
};
