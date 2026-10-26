const https = require("https");
const fs = require("fs");
const path = require("path");

const urls = {
  d7: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  d8: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  d9: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  d10: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  d11: "https://images.pexels.com/photos/6235006/pexels-photo-6235006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  d12: "https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
};

async function download(key, url) {
  return new Promise((resolve, reject) => {
    const dest = path.join(__dirname, "../public/images", `doctor-${key}.jpg`);
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode === 200) {
          res.pipe(file);
          file.on("finish", () => {
            file.close();
            const size = fs.statSync(dest).size;
            console.log(`[OK] doctor-${key}.jpg (${size} bytes)`);
            resolve();
          });
        } else {
          console.error(`[FAIL] doctor-${key}.jpg returned status ${res.statusCode}`);
          reject(new Error(`Status ${res.statusCode}`));
        }
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        console.error(`[ERR] doctor-${key}.jpg:`, err.message);
        reject(err);
      });
  });
}

async function main() {
  for (const [key, url] of Object.entries(urls)) {
    try {
      await download(key, url);
    } catch (e) {
      console.error(e.message);
    }
  }
}

main();
