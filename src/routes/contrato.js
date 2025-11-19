import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// POST /contrato
router.post("/", (req, res) => {
  const dadosContrato = req.body;

  if (!dadosContrato.nome || !dadosContrato.email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios." });
  }

  const filePath = path.join(process.cwd(), "contratos.json");

  let contratos = [];
  if (fs.existsSync(filePath)) {
    contratos = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  contratos.push({
    ...dadosContrato,
    dataAceite: new Date().toISOString(),
  });

  fs.writeFileSync(filePath, JSON.stringify(contratos, null, 2));

  res.json({ message: "Contrato salvo com sucesso!" });
});

export default router;
