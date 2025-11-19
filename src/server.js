import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Railway fornece a porta via ENV, não usar fixo
const PORT = process.env.PORT;

if (!PORT) {
  console.error("⚠️ Nenhuma porta detectada. O Railway precisa de process.env.PORT");
  process.exit(1);
}

// CORS seguro (liberando tudo por enquanto)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/**
 * Endpoint para gerar PDF do contrato
 */
app.get('/contrato/:id/gerar-pdf', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do contrato é obrigatório.' });
    }

    res.send(`Gerando PDF do contrato ${id}...`);
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    res.status(500).json({ error: 'Erro interno ao gerar PDF.' });
  }
});

/**
 * ROTA: Aceitar contrato
 */
app.post('/api/aceite-contrato', async (req, res) => {
  try {
    const { id, hashAceite } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID do contrato é obrigatório.' });
    }

    const contratoId = Number(id);

    const contrato = await prisma.contrato.findUnique({
      where: { id: contratoId }
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    const contratoAceito = await prisma.contrato.update({
      where: { id: contratoId },
      data: {
        aceito: true,
        aceite_data: new Date(),
        hashAceite: hashAceite || null
      }
    });

    return res.status(200).json({
      message: 'Contrato aceito com sucesso.',
      contratoId: contratoAceito.id,
      dataAceite: contratoAceito.aceite_data
    });

  } catch (err) {
    console.error('Erro ao registrar aceite do contrato:', err);
    return res.status(500).json({ error: 'Erro interno ao processar aceite.' });
  }
});

// rota raiz de teste
app.get('/', (req, res) => res.send('Servidor Ocyan-Tech rodando!'));

// iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
