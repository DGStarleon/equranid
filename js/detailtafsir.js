$(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const surahId = urlParams.get("surah");
  const ayatNum = urlParams.get("ayat");

  if (!surahId || !ayatNum) {
    $("#ayat-ref").text("Data tidak lengkap");
    $("#tafsir-content").html('<div class="alert alert-danger">Nomor surat atau ayat tidak diberikan.</div>');
    return;
  }

  const surahInt = parseInt(surahId, 10);
  const ayatInt = parseInt(ayatNum, 10);

  if (isNaN(surahInt) || isNaN(ayatInt)) {
    $("#tafsir-content").html('<div class="alert alert-danger">Data tidak valid.</div>');
    return;
  }

  $("#ayat-ref").text(`Surat ${surahInt}, Ayat ${ayatInt}`);

  $.get(`https://equran.id/api/v2/surat/${surahInt}`)
    .done(function (dataSurat) {
      const ayat = dataSurat.data.ayat.find((a) => a.nomorAyat === ayatInt);
      if (ayat) {
        $("#arabic-text").text(ayat.teksArab);
        $("#translation").html(`<em>${ayat.teksLatin}</em><br>${ayat.teksIndonesia}`);
      } else {
        $("#arabic-text").text("Ayat tidak ditemukan.");
      }
    })
    .fail(function () {
      $("#arabic-text").text("Gagal memuat ayat.");
    });

  $.get(`https://equran.id/api/v2/tafsir/${surahInt}`)
    .done(function (dataTafsir) {
      const tafsirList = dataTafsir.data?.tafsir || [];
      const tafsirAyat = tafsirList.find((t) => t.ayat === ayatInt);

      if (tafsirAyat && tafsirAyat.teks) {
        $("#tafsir-content").html(tafsirAyat.teks.replace(/\n/g, "<br>"));
      } else {
        $("#tafsir-content").html('<div class="alert alert-warning">Tafsir untuk ayat ini belum tersedia.</div>');
      }
    })
    .fail(function () {
      $("#tafsir-content").html('<div class="alert alert-danger">Gagal memuat tafsir dari server.</div>');
    });
});
