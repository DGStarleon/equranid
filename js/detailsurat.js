$(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const surahId = urlParams.get("surah");

  if (!surahId || isNaN(surahId)) {
    window.location.href = "index.html";
  }

  $.get(`https://equran.id/api/v2/surat/${surahId}`, function (data) {
    const surat = data.data;
    $("#judul-surat").text(`${surat.namaLatin} (${surat.nama})`);

    let ayatHtml = "";
    surat.ayat.forEach((ayat) => {
      ayatHtml += `
  <div class="card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge bg-primary">Ayat ${ayat.nomorAyat}</span>
      </div>
      <p class="arabic-text fs-4 text-end mb-2">${ayat.teksArab}</p>
      <p class="text-muted small">${ayat.teksLatin}</p>
      <p class="mb-2">${ayat.teksIndonesia}</p>
      <a href="detailtafsir.html?surah=${surahId}&ayat=${ayat.nomorAyat}" 
         class="btn btn-sm btn-outline-info w-100">Lihat Tafsir</a>
    </div>
  </div>
`;
    });
    $("#ayat-list").html(ayatHtml);
  }).fail(function () {
    $("#ayat-list").html('<div class="alert alert-danger">Gagal memuat surat.</div>');
  });
});
