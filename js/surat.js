$(function () {
  let allSurah = [];

  function displaySurah(surahList) {
    const container = $("#daftar-surat");
    container.empty();

    if (surahList.length === 0) {
      container.html('<div class="col-12"><div class="alert alert-warning text-center">Surat tidak ditemukan.</div></div>');
      return;
    }

    surahList.forEach((s) => {
      const card = `
        <div class="col-12 col-md-6 col-lg-4 mb-3">
          <a href="detailsurat.html?surah=${s.nomor}" class="text-decoration-none">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${s.nama}</h5>
                <p class="text-muted small">${s.namaLatin}</p>
                <p class="arabic-text fs-5 mt-auto text-end">${s.arti || ""}</p>
                <div class="d-flex justify-content-between mt-2">
                  <small class="text-muted">Ayat: ${s.jumlahAyat}</small>
                  <small class="badge ${s.tempatTurun === "Mekah" ? "bg-danger" : "bg-success"}">
                    ${s.tempatTurun}
                  </small>
                </div>
              </div>
            </div>
          </a>
        </div>
      `;
      container.append(card);
    });
  }

  // Ambil data surat dari API
  $.get("https://equran.id/api/v2/surat", function (data) {
    allSurah = data.data;
    displaySurah(allSurah);
  });

  // Search
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.trim().toLowerCase();

      if (!keyword) {
        displaySurah(allSurah);
      } else {
        const filtered = allSurah.filter((surat) => {
          const namaArab = (surat.nama || "").toLowerCase();
          const namaLatin = (surat.namaLatin || "").toLowerCase();
          const arti = (surat.arti || "").toLowerCase();
          const nomor = surat.nomor.toString();

          return namaArab.includes(keyword) || namaLatin.includes(keyword) || arti.includes(keyword) || nomor === keyword;
        });
        displaySurah(filtered);
      }
    });
  }
});
