// === CONFIGURASI API ===
const SPREADSHEET_ID = "1wWW4RA9T4iNKQRttCHRbZYQZ-7IEQ-O6_Dc31EACaJI";
const SHEET_NAME = "Portofolio";
const API_URL = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_NAME}`;

// === ELEMEN HTML ===
const container = document.querySelector(".portfolio-grid"); // ubah: id jadi class .portfolio-grid
let lastCount = 0;

// === LOAD PORTFOLIO ===
async function loadPortfolio() {
  try {
    const res = await fetch(API_URL + "?_=" + Date.now());
    const data = await res.json();

    if (data.length !== lastCount) {
      container.innerHTML = ""; // kosongkan isi lama

      data.forEach(item => {
        // ambil kategori dari kolom spreadsheet (misal kolom: kategori)
        const kategori = item.kategori?.toLowerCase() || "web";

        const card = document.createElement("div");
        card.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${kategori}`;

        card.innerHTML = `
          <div class="portfolio-card">
            <div class="image-container">
              <img src="${item.link_gambar}" class="img-fluid" alt="${item.nama_aplikasi}" loading="lazy">
              <div class="overlay">
                <div class="overlay-content">
                  <a href="${item.link_gambar}" class="glightbox zoom-link" title="${item.nama_aplikasi}">
                    <i class="bi bi-zoom-in"></i>
                  </a>
                  <a href="${item.link_demo || '#'}" class="details-link" title="View Project Details">
                    <i class="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="content">
              <h3>${item.nama_aplikasi}</h3>
              <p>${item.fitur_fungsi}</p>
            </div>
          </div>
        `;

        container.appendChild(card);
      });

      // === Refresh Isotope & Glightbox ===
      if (window.Isotope) {
        setTimeout(() => {
          const iso = new Isotope(".isotope-container", {
            itemSelector: ".isotope-item",
            layoutMode: "fitRows"
          });
          iso.layout();
        }, 500);
      }

      if (window.Glightbox) {
        GLightbox({ selector: ".glightbox" });
      }

      lastCount = data.length;
      console.log("✅ Data diperbarui:", new Date().toLocaleTimeString());
    }
  } catch (error) {
    console.error("❌ Gagal memuat data:", error);
  }
}

// === AUTO REFRESH TIAP 30 DETIK ===
loadPortfolio();
setInterval(loadPortfolio, 30000);
