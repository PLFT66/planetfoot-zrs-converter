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
    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ error: "No PDF uploaded or empty file" });
    }

    const convert = fromBuffer(req.file.buffer, {
      density: 300,
      format: "png",
      width: 2480,
      height: 3508,
      savePath: "/tmp"
    });

    const page = await convert(1, { responseType: "base64" });

    if (!page || !page.base64) {
      return res.status(500).json({
        error: "PDF conversion failed: empty base64 output",
        raw: page
      });
    }

    const pngBuffer = Buffer.from(page.base64, "base64");

    if (!pngBuffer || pngBuffer.length < 1000) {
      return res.status(500).json({
        error: "PDF conversion failed: PNG too small",
        size: pngBuffer.length
      });
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", pngBuffer.length);
    return res.end(pngBuffer);

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
