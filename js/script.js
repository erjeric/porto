
const SPREADSHEET_ID = "1wWW4RA9T4iNKQRttCHRbZYQZ-7IEQ-O6_Dc31EACaJI";
const SHEET_NAME = "Portofolio";
const API_URL = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_NAME}`;

const grid = document.getElementById('grid');
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

fetch(API_URL)
  .then(res => {
    if (!res.ok) throw new Error('Gagal mengambil data. Cek SPREADSHEET_ID dan akses public sheet.');
    return res.json();
  })
  .then(data => {
    // data adalah array objek; setiap kolom menjadi properti
    if (!Array.isArray(data) || data.length === 0) {
      grid.innerHTML = '<p>Tidak ada proyek di sheet.</p>';
      return;
    }

    data.forEach(item => {
      // expected fields (case-insensitive): nama_aplikasi, fitur_fungsi, teknologi, link_demo, link_gambar
      const name = item.nama_aplikasi || item.nama || "Untitled Project";
      const fitur = item.fitur_fungsi || item.fungsi || item.deskripsi || "-";
      const tech = item.teknologi || "-";
      const demo = item.link_demo || "";
      let img = item.link_gambar || "";

      // safety: if image empty, use placeholder data URI or gradient
      if (!img) {
        img = 'data:image/svg+xml;utf8,' + encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
            <rect width='100%' height='100%' fill='#eef6ff'/>
            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-size='22'>No Image</text>
          </svg>`
        );
      }

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${img}" alt="${name}" loading="lazy" />
        <h3>${name}</h3>
        <div class="meta">${fitur}</div>
        <div class="tags"><span class="tag">${tech}</span></div>
        <div class="actions">
          ${demo ? `<a class="btn" href="${demo}" target="_blank" rel="noopener">Lihat Demo</a>` : ''}
          <a class="btn primary" href="${demo || '#'}" onclick="event.preventDefault(); alert('Kamu bisa menaruh link demo atau file exe di kolom link_demo pada Google Sheet.');">Detail</a>
        </div>
      `;
      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    grid.innerHTML = `<p class="error">Terjadi error: ${err.message}</p>`;
  });
