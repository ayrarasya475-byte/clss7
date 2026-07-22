/* VanGuard 7B — lapisan data
   Semua data disimpan di localStorage (per-browser, per-domain) supaya
   Website dan Admin Panel bisa dijalankan sebagai dua paket file terpisah
   tapi tetap saling membaca data selama di-deploy di domain yang sama.
   Kalau nanti mau pindah ke Firebase/Supabase, cukup ganti isi vgLoad()/vgSave(). */

const VG_KEY = 'vg7b_data_v2';

const VG_DEFAULT = {
  brand: {
    name: 'VanGuard',
    kelas: '7B',
    sekolah: 'SMP Negeri 1 Talang',
    tagline: 'Buku catatan digital Kelas 7B — jadwal, aturan, dan cerita kelas, disimpan rapi di satu tempat.'
  },
  sambutan: `Halo! Ini catatan digital Kelas 7B. Semua yang perlu diingat — jadwal, aturan, siapa piket hari ini — ada di sini biar nggak ada alasan lupa lagi. Kalau kamu anak 7B, ini punya kamu juga.`,
  struktur: [
    { jabatan: 'Ketua Kelas', nama: 'Dimas', rank: 1 },
    { jabatan: 'Wakil Ketua', nama: 'Abidzar', rank: 2 },
    { jabatan: 'Bendahara', nama: 'Belum diisi', rank: 3 },
    { jabatan: 'Sekretaris', nama: 'Belum diisi', rank: 3 },
    { jabatan: 'Sie Keamanan', nama: 'Belum diisi', rank: 4 },
    { jabatan: 'Sie K3', nama: 'Belum diisi', rank: 4 },
    { jabatan: 'Sie Kerohanian', nama: 'Belum diisi', rank: 4 }
  ],
  siswa: [],
  jadwal: {
    Senin: ['Matematika', 'Seni & Prakarya', 'Bahasa Inggris'],
    Selasa: ['Olahraga', 'Informatika', 'Bahasa Jawa'],
    Rabu: ['Agama', 'Bahasa Indonesia', 'IPA'],
    Kamis: ['IPA', 'PPKN', 'IPS'],
    "Jum'at": ['Kegiatan Jumat', 'Matematika'],
    Sabtu: ['Bahasa Indonesia', 'IPS', 'Bahasa Inggris']
  },
  piket: [
    { hari: 'Senin', anggota: [] },
    { hari: 'Selasa', anggota: [] },
    { hari: 'Rabu', anggota: [] },
    { hari: 'Kamis', anggota: [] },
    { hari: "Jum'at", anggota: [] },
    { hari: 'Sabtu', anggota: [] }
  ],
  peraturan: [
    'Dilarang berkata kasar',
    'Dilarang membully',
    'Dilarang bermain bola di dalam kelas',
    'Hormati guru yang sedang mengajar',
    'No SARA, kekerasan, seksualitas, dan membuang kertas sembarangan',
    'Dilarang membuang sampah di lorong',
    'Menjaga kebersihan dan keamanan kelas'
  ],
  denda: { pelanggaran: 2000, dansosHari: "Jum'at", dansos: 2000 },
  visi: 'Menjadi wadah digital yang menginspirasi, menghubungkan, dan membangun generasi pelopor dari Kelas 7B SMP Negeri 1 Talang menuju masa depan yang gemilang.',
  misi: [
    'Menyediakan informasi kelas yang akurat, cepat, dan transparan bagi siswa, guru, dan orang tua',
    'Membangun komunikasi dan kolaborasi yang aktif antar seluruh warga kelas 7B',
    'Mendokumentasikan setiap momen berharga dan prestasi kelas sebagai kenangan abadi',
    'Menumbuhkan semangat belajar dan berprestasi melalui konten-konten inspiratif',
    'Menjadi jembatan antara siswa, guru, dan orang tua dalam mendukung proses pembelajaran',
    'Mengembangkan kreativitas dan keterampilan digital siswa kelas 7B'
  ],
  tentang: 'Kelas 7B hadir sebagai sebuah entitas pembelajaran yang terstruktur. Dengan standar kerja yang tinggi dan kualitas pengetahuan yang terukur, kami fokus mengasah kompetensi dan membangun fondasi yang kokoh untuk meraih kesuksesan di masa depan.',
  kontributor: [
    { peran: 'Pembimbing', nama: 'Ibu Nur Handayati' },
    { peran: 'Koordinator Data', nama: 'M. Adit Maulana' },
    { peran: 'Pembuat', nama: 'Tubagus Khoiri Rasya' }
  ],
  credits: [
    { peran: 'Project Lead', nama: 'Rasya' },
    { peran: 'Web Developer', nama: 'Rasya' },
    { peran: 'Photographer', nama: 'OSIS 7B' },
    { peran: 'Content Writer', nama: 'Adit' },
    { peran: 'Supervisor', nama: 'Ibu Nur Handayati' }
  ],
  tim: { nama: 'Vanguard Studios', terimakasih: ['OSIS 7B', 'Supervisor', 'Photographer'] },
  kontak: {
    situs: 'www.smpn1talang.sch.id',
    alamat: 'Jln. Projosumarto II No. 11, Desa Pesayangan, Kec. Talang, Kab. Tegal, Jawa Tengah',
    status: 'Negeri',
    akreditasi: 'A'
  },
  prestasi: [],
  faq: [
    { q: 'Siapa yang bisa mengedit website ini?', a: 'Hanya pengurus yang memegang password admin panel yang bisa menambah atau mengubah data di website ini.' },
    { q: 'Bagaimana cara melapor kalau ada data yang salah?', a: 'Hubungi pengurus kelas melalui halaman Kontak.' }
  ],
  privasi: 'Website ini hanya menyimpan data yang berkaitan dengan kegiatan Kelas 7B (nama, jabatan, jadwal, dan dokumentasi prestasi). Data tidak dibagikan ke pihak luar tanpa izin, dan hanya bisa diubah oleh pengurus lewat admin panel.',
  stats: { kunjungan: 0, terakhirDilihat: null },
  config: { firebase: '', supabase: '', cloud: '', backupTerakhir: null }
};

function vgLoad() {
  try {
    const raw = localStorage.getItem(VG_KEY);
    if (!raw) {
      localStorage.setItem(VG_KEY, JSON.stringify(VG_DEFAULT));
      return JSON.parse(JSON.stringify(VG_DEFAULT));
    }
    return Object.assign({}, JSON.parse(JSON.stringify(VG_DEFAULT)), JSON.parse(raw));
  } catch (e) {
    console.error('Gagal memuat data, memakai default.', e);
    return JSON.parse(JSON.stringify(VG_DEFAULT));
  }
}
function vgSave(data) { localStorage.setItem(VG_KEY, JSON.stringify(data)); }
function vgLogVisit() {
  const data = vgLoad();
  data.stats.kunjungan = (data.stats.kunjungan || 0) + 1;
  data.stats.terakhirDilihat = new Date().toISOString();
  vgSave(data);
}
function vgReset() { localStorage.setItem(VG_KEY, JSON.stringify(VG_DEFAULT)); }
