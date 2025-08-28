const fs = require("fs");
const path = require("path");

const places = require("./data/places.json");

const imagesDir = "D:/arlocation-assets/images";
const repoUrl =
  "https://raw.githubusercontent.com/omerkilincoglu/arlocation-assets/main/images";

const updated = places.map((place) => {
  // önce base name belirle
  let base = null;

  if (place.images && place.images.length > 0) {
    // örn: .../square_gar-2.jpg → square_gar
    base = path.basename(place.images[0], ".jpg").split("-")[0];
  } else if (place.image) {
    base = path.basename(place.image, ".jpg");
  }

  if (!base) return place;

  // klasördeki tüm dosyaları tara
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => f.startsWith(base) && f.endsWith(".jpg"))
    .sort();

  // yeni urls listesi
  const urls = files.map((f) => `${repoUrl}/${f}?v=${Date.now()}`);

  // image alanını kaldır, images[] güncelle
  delete place.image;
  place.images = urls;

  return place;
});

fs.writeFileSync(
  "./data/places.json",
  JSON.stringify(updated, null, 2),
  "utf-8"
);

console.log("✅ places.json güncellendi!");
