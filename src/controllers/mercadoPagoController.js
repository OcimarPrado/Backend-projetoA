// projeto-a/src/controllers/mercadoPagoController.js

const { criarUsuarioNoPainelB } = require('../services/projetoBService');

exports.receberWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    // Responder imediatamente (requisito do Mercado Pago)
    res.status(200).send('OK');

    // Processar apenas pagamentos aprovados
    if (type === 'payment' && data && data.id) {
      // Buscar detalhes do pagamento no Mercado Pago
      const payment = await mercadopago.payment.findById(data.id);

      if (payment.body.status === 'approved') {
        console.log('✅ Pagamento aprovado:', payment.body.id);

        // Extrair dados do comprador
        const email = payment.body.payer.email;
        const plano = payment.body.metadata.plano || 'starter'; // Defina o plano nos metadados
        const customerId = payment.body.payer.id;
        const paymentId = payment.body.id;

        // Criar usuário no Projeto B
        try {
          await criarUsuarioNoPainelB({
            email,
            plano,
            mercadoPagoCustomerId: customerId,
            paymentId: paymentId,
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
          });

          console.log(`✅ Usuário ${email} criado no Painel B com sucesso!`);
        } catch (error) {
          console.error('❌ Falha ao criar usuário no Painel B:', error);
          // Aqui você pode implementar uma fila de retry
        }
      }
    }
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
  }
};