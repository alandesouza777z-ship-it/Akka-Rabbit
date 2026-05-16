import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { planTier, email, name, cpfCnpj } = await request.json();

    if (!planTier) {
      return NextResponse.json({ error: "Plano é obrigatório" }, { status: 400 });
    }

    // Definir valores baseados no plano
    const priceMap: Record<string, number> = {
      starter: 97.00,
      pro: 197.00,
      enterprise: 497.00
    };

    const priceValue = priceMap[planTier] || 197.00;

    const apiKey = process.env.ASAAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chave do Asaas não configurada" }, { status: 500 });
    }

    const headers = {
      "access_token": apiKey,
      "Content-Type": "application/json"
    };

    // 1. Criar um cliente genérico ou específico
    const customerReq = await fetch("https://api.asaas.com/v3/customers", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: name || "AkkaRabbit User",
        email: email || "usuario@akkarabbit.com",
        cpfCnpj: cpfCnpj || undefined
      })
    });
    
    const customerData = await customerReq.json();
    if (!customerReq.ok) {
      console.error("[Asaas Customer Error]:", customerData);
      return NextResponse.json({ error: `Asaas Cliente: ${customerData.errors?.[0]?.description || "Erro desconhecido"}` }, { status: 400 });
    }

    // 2. Criar a cobrança PIX
    const paymentReq = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers,
      body: JSON.stringify({
        customer: customerData.id,
        billingType: "PIX",
        value: priceValue,
        dueDate: new Date().toISOString().split("T")[0],
        description: `AkkaRabbit - Plano ${planTier.toUpperCase()}`,
        externalReference: `${email}|${planTier}`
      })
    });

    const paymentData = await paymentReq.json();
    if (!paymentReq.ok) {
      console.error("[Asaas Payment Error]:", paymentData);
      return NextResponse.json({ error: `Asaas PIX: ${paymentData.errors?.[0]?.description || "Erro desconhecido"}` }, { status: 400 });
    }

    // TRAVA DE SEGURANÇA: O Asaas converteu para Boleto?
    if (paymentData.billingType !== "PIX") {
       console.error("[Asaas Fallback Alert]: Asaas gerou como", paymentData.billingType);
       return NextResponse.json({ 
         error: `O Asaas bloqueou o PIX para sua conta e gerou um Boleto. Verifique a aprovação da sua conta no painel do Asaas.` 
       }, { status: 400 });
    }

    // 3. Pegar o Payload do QR Code
    const qrReq = await fetch(`https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`, {
      method: "GET",
      headers
    });

    const qrData = await qrReq.json();
    if (!qrReq.ok) {
      console.error("[Asaas QRCode Error]:", qrData);
      return NextResponse.json({ 
        error: `Asaas QR Code: ${qrData.errors?.[0]?.description || "Erro desconhecido"}`,
        debug_payment: paymentData 
      }, { status: 400 });
    }

    // Retorna os dados necessários para o frontend montar o modal
    return NextResponse.json({
      success: true,
      paymentId: paymentData.id,
      qrCodeImage: qrData.encodedImage,   // Base64
      qrCodePayload: qrData.payload,      // Copia e Cola
      value: priceValue
    });

  } catch (error) {
    const err = error as Error;
    console.error("[Asaas API Checkout]:", err.message);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
