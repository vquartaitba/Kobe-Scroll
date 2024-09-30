const express = require("express");
const { processInput } = require("./main");
const cors = require("cors");
const { deployToAvax, deployToZkEVM } = require("../solidityBranch/deployer"); // Asegúrate de que la ruta sea correcta
const { deployToSolana } = require("../rustBranch/deployer");
const { deployToScroll } = require("../solidityBranch/deployer"); // Asegúrate de que la ruta sea correcta

const app = express();

app.use(cors());
app.use(express.json());

// Ruta para manejar el input del usuario
app.post("/api/process", async (req, res) => {
  try {
    // console.log("Solicitud recibida en el backend:", req.body);

    const { userTask } = req.body;
    const result = await processInput(userTask);

    // console.log("Respuesta generada:", result);

    if (result) {
      res.json(result);
    } else {
      console.error("Error: Respuesta vacía o nula.");
      res
        .status(500)
        .json({ error: "Error en la generación de la respuesta." });
    }
  } catch (error) {
    console.error("Error en el backend:", error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para manejar el despliegue a AVAX
app.post("/api/deploy/avax", async (req, res) => {
  try {
    const deployedAddress = await deployToAvax();
    if (deployedAddress) {
      res.json({ deployedAddress });
    } else {
      res.status(500).json({ error: "Failed to deploy contract on AVAX" });
    }
  } catch (error) {
    console.error("Error en el despliegue en AVAX:", error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para manejar el despliegue a zkEVM
app.post("/api/deploy/zkEVM", async (req, res) => {
  try {
    const deployedAddress = await deployToZkEVM();
    if (deployedAddress) {
      res.json({ deployedAddress });
    } else {
      res.status(500).json({ error: "Failed to deploy contract on zkEVM" });
    }
  } catch (error) {
    console.error("Error en el despliegue en zkEVM:", error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para manejar el despliegue a solana
app.post("/api/deploy/solana", async (req, res) => {
  try {
    const deployedAddress = await deployToSolana();
    if (deployedAddress) {
      res.json({ deployedAddress });
    } else {
      res.status(500).json({ error: "Failed to deploy contract on solana" });
    }
  } catch (error) {
    console.error("Error en el despliegue en solana:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/deploy/scroll", async (req, res) => {
  try {
    const deployedAddress = await deployToScroll();
    if (deployedAddress) {
      res.json({ deployedAddress });
    } else {
      res.status(500).json({ error: "Failed to deploy to Scroll" });
    }
  } catch (error) {
    console.error("Error deploying to Scroll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Configuración del puerto
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
