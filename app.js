const VG_ROUTES = ['dashboard','struktur','tentang','kontak','peraturan','faq','prestasi'];

function vgFmtRupiah(n){ return 'Rp' + Number(n||0).toLocaleString('id-ID'); }
function vgFmtTanggal(iso){
  if(!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
}

function vgRender(){
  const data = vgLoad();
  const hash = (location.hash || '#dashboard').replace('#','');
  const route = VG_ROUTES.includes(hash) ? hash : 'dashboard';

  document.querySelectorAll('.drawer a').forEach(a=>a.classList.toggle('active', a.dataset.route === route));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.id === 'view-'+route));

  document.getElementById('brand-name').textContent = data.brand.name + ' ' + data.brand.kelas;
  document.getElementById('brand-sub').textContent = data.brand.sekolah;

  const renderers = {
    dashboard: vgRenderDashboard, struktur: vgRenderStruktur, tentang: vgRenderTentang,
    kontak: vgRenderKontak, peraturan: vgRenderPeraturan, faq: vgRenderFaq, prestasi: vgRenderPrestasi
  };
  renderers[route](data);
  window.scrollTo(0,0);
}

function vgRenderDashboard(data){
  const el = document.getElementById('view-dashboard');
  el.innerHTML = `
    <div class="hero">
      <div>
        <span class="eyebrow">${data.brand.sekolah}</span>
        <h1>${data.brand.name} ${data.brand.kelas}</h1>
        <p class="lead">${data.brand.tagline}</p>
      </div>
      <div class="hero-card notebook">
        <div class="tape"></div>
        <div class="hero-stats">
          <div class="hero-stat"><b>${data.siswa.length || '—'}</b><span>Siswa terdata</span></div>
          <div class="hero-stat"><b>${data.prestasi.length}</b><span>Prestasi</span></div>
          <div class="hero-stat"><b>${data.struktur.length}</b><span>Jabatan pengurus</span></div>
          <div class="hero-stat"><b>${data.stats.kunjungan}</b><span>Kunjungan</span></div>
        </div>
      </div>
    </div>

    <section>
      <div class="section-head"><span class="eyebrow">Kata sambutan</span></div>
      <div class="notebook"><div class="tape"></div><p style="font-size:1.05rem;margin:0">${data.sambutan}</p></div>
    </section>

    <section>
      <div class="section-head"><span class="eyebrow">Struktur organisasi</span></div>
      <div class="pinboard"><div class="pin-grid">${data.struktur.map(vgPinCard).join('')}</div></div>
      <div style="margin-top:16px"><a class="btn ghost" href="#struktur">Lihat jadwal & piket →</a></div>
    </section>
  `;
}

function vgPinCard(s){
  const kosong = !s.nama || /belum diisi/i.test(s.nama);
  return `<div class="pin-card">
    <div class="jabatan">${s.jabatan}</div>
    <div class="nama ${kosong?'kosong':''}">${kosong ? 'Belum diisi' : s.nama}</div>
  </div>`;
}

function vgRenderStruktur(data){
  const el = document.getElementById('view-struktur');
  const hari = Object.keys(data.jadwal);
  el.innerHTML = `
    <span class="eyebrow">Struktur, jadwal & piket</span>
    <h2 style="margin-top:8px">Struktur Organisasi</h2>
    <div class="pinboard" style="margin-bottom:40px"><div class="pin-grid">${data.struktur.map(vgPinCard).join('')}</div></div>

    <h2>Jadwal Pelajaran</h2>
    <div class="timetable" style="margin-bottom:40px">
      ${hari.map(h=>`
        <div class="tt-row">
          <div class="tt-day">${h}</div>
          <div class="tt-subjects">${data.jadwal[h].map(m=>`<span class="pill">${m}</span>`).join('')}</div>
        </div>
      `).join('')}
    </div>

    <h2>Jadwal Piket</h2>
    <div class="grid grid-3">
      ${data.piket.map(p=>`
        <div class="piket-card">
          <div class="hari">${p.hari}</div>
          <div class="anggota ${!p.anggota.length ? 'kosong':''}">${p.anggota.length ? p.anggota.join(', ') : 'Belum diatur'}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function vgRenderTentang(data){
  const el = document.getElementById('view-tentang');
  el.innerHTML = `
    <span class="eyebrow">Tentang kami</span>
    <h2 style="margin-top:8px">${data.brand.name} ${data.brand.kelas}</h2>
    <p style="font-size:1.05rem;max-width:70ch">${data.tentang}</p>

    <div class="grid grid-2" style="margin-top:30px">
      <div class="notebook"><div class="tape"></div><div class="eyebrow" style="margin-bottom:8px">Visi</div><p style="margin:0">${data.visi}</p></div>
      <div class="notebook"><div class="tape"></div><div class="eyebrow" style="margin-bottom:8px">Misi</div>
        <ol style="margin:0;padding-left:18px">${data.misi.map(m=>`<li style="margin-bottom:8px">${m}</li>`).join('')}</ol>
      </div>
    </div>

    <section style="padding-top:40px">
      <div class="section-head"><span class="eyebrow">Kontributor</span></div>
      ${data.kontributor.map(c=>`<div class="credit-row"><span class="peran">${c.peran}</span><span>${c.nama}</span></div>`).join('')}
    </section>
    <section>
      <div class="section-head"><span class="eyebrow">Credits</span></div>
      ${data.credits.map(c=>`<div class="credit-row"><span class="peran">${c.peran}</span><span>${c.nama}</span></div>`).join('')}
      <p style="margin-top:18px">Dikerjakan oleh tim <b>${data.tim.nama}</b>. Terima kasih kepada ${data.tim.terimakasih.join(', ')}.</p>
    </section>
  `;
}

function vgRenderKontak(data){
  const el = document.getElementById('view-kontak');
  el.innerHTML = `
    <span class="eyebrow">Kontak & sekolah</span>
    <h2 style="margin-top:8px">${data.brand.sekolah}</h2>
    <div class="kontak-grid">
      <div>
        <div class="kontak-row"><span class="k">Situs</span><span class="v">${data.kontak.situs}</span></div>
        <div class="kontak-row"><span class="k">Status</span><span class="v">${data.kontak.status}</span></div>
        <div class="kontak-row"><span class="k">Akreditasi</span><span class="v">${data.kontak.akreditasi}</span></div>
        <div class="kontak-row"><span class="k">Alamat</span><span class="v">${data.kontak.alamat}</span></div>
      </div>
      <div class="card" style="display:flex;align-items:center;gap:16px">
        <div class="badge-akreditasi">${data.kontak.akreditasi}</div>
        <div><div class="eyebrow">Akreditasi</div><p style="margin:4px 0 0">Terakreditasi ${data.kontak.akreditasi} — sekolah ${data.kontak.status.toLowerCase()}.</p></div>
      </div>
    </div>
  `;
}

function vgRenderPeraturan(data){
  const el = document.getElementById('view-peraturan');
  el.innerHTML = `
    <span class="eyebrow">Peraturan kelas</span>
    <h2 style="margin-top:8px">Tata Tertib 7B</h2>
    <div class="rule-list">
      ${data.peraturan.map((r,i)=>`<div class="rule-item"><span class="no">${i+1}</span><span>${r}</span></div>`).join('')}
    </div>
    <div class="denda-box">
      <div class="denda-cell"><div class="eyebrow">Denda pelanggaran</div><b>${vgFmtRupiah(data.denda.pelanggaran)}</b></div>
      <div class="denda-cell"><div class="eyebrow">Dansos — tiap ${data.denda.dansosHari}</div><b>${vgFmtRupiah(data.denda.dansos)}</b></div>
    </div>
  `;
}

function vgRenderFaq(data){
  const el = document.getElementById('view-faq');
  el.innerHTML = `
    <span class="eyebrow">FAQ</span>
    <h2 style="margin-top:8px">Pertanyaan Umum</h2>
    <div style="margin-bottom:36px">
      ${data.faq.map(f=>`
        <div class="faq-item">
          <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">${f.q}<span class="arrow">+</span></button>
          <div class="faq-a">${f.a}</div>
        </div>
      `).join('')}
    </div>
    <span class="eyebrow">Kebijakan privasi</span>
    <div class="notebook" style="margin-top:12px"><div class="tape"></div><p style="margin:0">${data.privasi}</p></div>
  `;
}

function vgRenderPrestasi(data){
  const el = document.getElementById('view-prestasi');
  el.innerHTML = `
    <span class="eyebrow">Prestasi</span>
    <h2 style="margin-top:8px">Pencapaian Kelas 7B</h2>
    ${data.prestasi.length ? `
      <div style="display:flex;flex-direction:column;gap:12px">
        ${data.prestasi.map(p=>`
          <div class="prestasi-item">
            <div class="tgl">${vgFmtTanggal(p.tanggal)}</div>
            <div><h3 style="margin-bottom:4px">${p.judul}</h3><p style="margin:0;color:var(--slate)">${p.deskripsi}</p></div>
          </div>
        `).join('')}
      </div>
    ` : `<div class="empty">Belum ada prestasi tercatat — tambahkan lewat admin panel.</div>`}
  `;
}

function vgToggleDrawer(open){
  document.getElementById('drawer').classList.toggle('open', open);
  document.getElementById('drawer-overlay').classList.toggle('open', open);
}

window.addEventListener('hashchange', vgRender);
window.addEventListener('DOMContentLoaded', ()=>{
  vgLogVisit();
  vgRender();
  document.getElementById('menu-open').addEventListener('click', ()=>vgToggleDrawer(true));
  document.getElementById('menu-close').addEventListener('click', ()=>vgToggleDrawer(false));
  document.getElementById('drawer-overlay').addEventListener('click', ()=>vgToggleDrawer(false));
  document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click', ()=>vgToggleDrawer(false)));
});
