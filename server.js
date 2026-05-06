const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("PlanetFoot ZRS Converter OK");
});

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    // TEMPORAIRE TEST : renvoie erreur propre
    // Si tu vois cette erreur, la route /convert marche.
    return res.status(501).json({
      error: "Route /convert OK, conversion PDF -> PNG pas encore branchée"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
