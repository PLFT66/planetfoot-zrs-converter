const express = require("express");
const multer = require("multer");
const { fromBuffer } = require("pdf2pic");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("PlanetFoot ZRS Converter OK");
});

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

const convert = fromBuffer(req.file.buffer, {
  density: 300,
  format: "png",
  width: 2480,
  height: 3508,
  quality: 100
});

    const page = await convert(1, { responseType: "buffer" });

    res.setHeader("Content-Type", "image/png");
    return res.send(page.buffer);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log("Server running on port " + port);
});
