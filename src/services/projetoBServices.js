// projeto-a/src/services/projetoBService.js

const crypto = require('crypto');
const axios = require('axios');

/**
 * Gera assinatura do webhook
 */
function gerarAssinatura(payload) {
  const secret = process.env.WEBHOOK_SECRET; // Mesmo secret do Projeto B
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash;
}

/**
 * Cria usuário no Projeto B após pagamento confirmado
 */
async function criarUsuarioNoPainelB(dadosUsuario) {
  try {
    const payload = {
      email: dadosUsuario.email,
      plano: dadosUsuario.plano,
      mercadoPagoCustomerId: dadosUsuario.mercadoPagoCustomerId,
      mercadoPagoPaymentId: dadosUsuario.paymentId,
      dataVencimento: dadosUsuario.dataVencimento
    };

    const signature = gerarAssinatura(payload);

    const response = await axios.post(
      `${process.env.PROJETO_B_URL}/api/webhook/create-user`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature
        },
        timeout: 10000 // 10 segundos
      }
    );

    console.log('✅ Usuário criado no Painel B:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar usuário no Painel B:', error.message);
    throw error;
  }
}

/**
 * Atualiza status de pagamento no Projeto B
 */
async function atualizarStatusNoPainelB(email, status, dataVencimento) {
  try {
    const payload = {
      email,
      status, // 'ativo', 'pendente', 'cancelado'
      dataVencimento
    };

    const signature = gerarAssinatura(payload);

    const response = await axios.post(
      `${process.env.PROJETO_B_URL}/api/webhook/update-status`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature
        }
      }
    );

    console.log('✅ Status atualizado no Painel B');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar status no Painel B:', error.message);
    throw error;
  }
}

module.exports = {
  criarUsuarioNoPainelB,
  atualizarStatusNoPainelB
};