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
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Data bukan array:", data);
      return;
    }

    if (data.length !== lastCount) {
      container.innerHTML = "";

      data.forEach(item => {
        const kategori = item.kategori?.toLowerCase() || "web";

        const card = document.createElement("div");
        card.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${kategori}`;

        card.innerHTML = `
          <div class="portfolio-card">
            <div class="image-container">
              <img src="${item.link_gambar}" class="img-fluid" alt="${item.nama_aplikasi}" loading="lazy">
              <div class="overlay">
                <div class="overlay-content">
                  <a href="${item.link_gambar}" class="glightbox zoom-link">
                    <i class="bi bi-zoom-in"></i>
                  </a>
                  <a href="${item.link_demo || '#'}" class="details-link">
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

      // refresh UI
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
    console.error("❌ Gagal memuat data:", error.message);
  }
}

// === AUTO REFRESH TIAP 30 DETIK ===
loadPortfolio();
setInterval(loadPortfolio, 30000);
