import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializa o cliente do Supabase com Service Role para poder atualizar os usuários com permissão de admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("[Asaas Webhook] Evento Recebido:", payload.event);

    // O Asaas envia PAYMENT_RECEIVED para PIX pago
    if (payload.event === "PAYMENT_RECEIVED" || payload.event === "PAYMENT_CONFIRMED") {
      const payment = payload.payment;
      
      if (!payment || !payment.externalReference) {
        console.error("[Asaas Webhook] Payment payload missing externalReference");
        return NextResponse.json({ received: true, error: "No external reference" });
      }

      // Desestruturar o externalReference (email|planTier)
      const parts = payment.externalReference.split("|");
      if (parts.length !== 2) {
         console.error("[Asaas Webhook] Formato de externalReference inválido:", payment.externalReference);
         return NextResponse.json({ received: true, error: "Invalid reference format" });
      }

      const email = parts[0];
      const planTier = parts[1];

      console.log(`[Asaas Webhook] Processando pagamento para email: ${email}, Plano: ${planTier}`);

      // Configurar os limites de acordo com o plano comprado
      let domainsLimit = 1;
      let requestsLimit = 5000;

      if (planTier === "pro") {
        domainsLimit = 5;
        requestsLimit = 50000;
      } else if (planTier === "enterprise") {
        domainsLimit = 999;
        requestsLimit = 9999999;
      }

      // Atualizar o banco de dados Supabase na tabela 'users'
      // O usuário pode não ter sido criado instantaneamente, 
      // mas geralmente o PIX demora alguns segundos, então a conta já existe.
      const { data, error } = await supabase
        .from("users")
        .update({
          plan_tier: planTier,
          domains_limit: domainsLimit,
          requests_limit: requestsLimit,
          updated_at: new Date().toISOString()
        })
        .eq("email", email);

      if (error) {
        console.error("[Asaas Webhook] Erro ao atualizar usuário no Supabase:", error);
        return NextResponse.json({ received: true, error: "DB Update Failed" }, { status: 500 });
      }

      console.log(`[Asaas Webhook] Usuário ${email} atualizado com sucesso para o plano ${planTier}!`);
      
      return NextResponse.json({ received: true, success: true });
    }

    // Retorna OK para eventos que não sejam pagamento confirmado (como criação do PIX)
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("[Asaas Webhook Error]:", error.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
