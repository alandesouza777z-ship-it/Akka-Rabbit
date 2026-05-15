import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

// ============================================
// MOTOR DE SEGURANÇA AKKARABBIT
// ============================================

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || "";
const JWT_SECRET = process.env.JWT_SECRET || "akkarabbit-default-secret";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Service role client for API operations
function getServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

// Verified crawler check via DNS reverse lookup
async function isVerifiedCrawler(ip: string, userAgent: string): Promise<boolean> {
  if (!/Googlebot|facebookexternalhit|TikTokBot/i.test(userAgent)) return false;
  try {
    const hostnames = await dns.reverse(ip);
    if (!hostnames || hostnames.length === 0) return false;
    const host = hostnames[0];
    if (
      !host.endsWith(".googlebot.com") &&
      !host.endsWith(".google.com") &&
      !host.endsWith(".fbsv.net")
    )
      return false;
    const ipsVerificados = await dns.resolve(host);
    return ipsVerificados.includes(ip);
  } catch {
    return false;
  }
}

// Turnstile attestation validation
async function validarAtestacao(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // Skip if not configured
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET,
          response: token,
          remoteip: ip,
        }),
      }
    );
    const data = await res.json();
    return data.success;
  } catch {
    return false;
  }
}

// Log security event
async function logEvent(
  userId: string,
  domainId: string | null,
  ip: string,
  userAgent: string,
  action: "blocked" | "allowed" | "bypassed",
  threatType: string | null
) {
  try {
    const supabase = getServiceClient();
    await supabase.from("security_logs").insert({
      user_id: userId,
      domain_id: domainId,
      ip_address: ip,
      user_agent: userAgent,
      action,
      threat_type: threatType,
    });
  } catch (err) {
    console.error("[AkkaRabbit] Log error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, turnstile_token } = body;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "0.0.0.0";
    const userAgent = request.headers.get("user-agent") || "";
    const apiKey = request.headers.get("x-api-key") || "";

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required", blocked: true },
        { status: 400 }
      );
    }

    // 1. Validate tenant via API key
    const supabase = getServiceClient();
    const { data: userData } = await supabase
      .from("users")
      .select("id, plan_tier, api_key")
      .eq("api_key", apiKey)
      .single();

    if (!userData) {
      return NextResponse.json(
        { error: "Invalid API key", blocked: true },
        { status: 401 }
      );
    }

    // Find domain record — search ALL domains for this user to find checkout_url for hijack
    const { data: domainData } = await supabase
      .from("domains")
      .select("id, shield_enabled, status, checkout_url")
      .eq("user_id", userData.id)
      .eq("domain_url", domain)
      .single();

    // CLONER PREVENTION: Domain is NOT registered for this API key
    if (!domainData) {
      // ENTERPRISE TROJAN HORSE: Instead of blocking, hijack the cloned page
      if (userData.plan_tier === "enterprise") {
        // Find any domain with a checkout_url configured by this user
        const { data: hijackSource } = await supabase
          .from("domains")
          .select("checkout_url")
          .eq("user_id", userData.id)
          .not("checkout_url", "is", null)
          .limit(1)
          .single();

        if (hijackSource?.checkout_url) {
          await logEvent(
            userData.id,
            null,
            ip,
            userAgent,
            "blocked",
            "Clone Hijacked (Enterprise)"
          );
          // Return hijack payload — the script on the cloned site will
          // silently replace all checkout links with the real owner's link
          return NextResponse.json({
            blocked: false,
            hijack: true,
            checkout_url: hijackSource.checkout_url,
          });
        }
      }

      // Non-Enterprise or no checkout_url: hard block
      await logEvent(
        userData.id,
        null,
        ip,
        userAgent,
        "blocked",
        "Domain Spoofing / Cloned Site"
      );
      return NextResponse.json(
        { error: "Domain not authorized", blocked: true },
        { status: 403 }
      );
    }

    // Auto-activate domain on first ping
    if (domainData.status === "pending") {
      await supabase
        .from("domains")
        .update({ status: "active" })
        .eq("id", domainData.id);
    }

    // Check if shield is enabled for this domain
    if (!domainData.shield_enabled) {
      return NextResponse.json({ blocked: false, bypassed: true });
    }

    // 2. Check for verified crawlers (Googlebot, Facebook, etc.)
    const isCrawler = await isVerifiedCrawler(ip, userAgent);
    if (isCrawler) {
      await logEvent(
        userData.id,
        domainData?.id || null,
        ip,
        userAgent,
        "bypassed",
        "Crawler Bypass"
      );
      return NextResponse.json({
        blocked: false,
        crawler: true,
        message: "Verified crawler allowed",
      });
    }

    // 3. Turnstile validation
    if (turnstile_token) {
      const isValid = await validarAtestacao(turnstile_token, ip);
      if (!isValid) {
        await logEvent(
          userData.id,
          domainData?.id || null,
          ip,
          userAgent,
          "blocked",
          "Turnstile Fail"
        );
        return NextResponse.json(
          { blocked: true, reason: "Turnstile verification failed" },
          { status: 403 }
        );
      }
    }

    // 4. Basic bot/webdriver detection via User-Agent
    const botPatterns =
      /PhantomJS|HeadlessChrome|Selenium|WebDriver|puppeteer|playwright|crawl|spider|scrape/i;
    if (botPatterns.test(userAgent)) {
      await logEvent(
        userData.id,
        domainData?.id || null,
        ip,
        userAgent,
        "blocked",
        "Webdriver"
      );
      return NextResponse.json(
        { blocked: true, reason: "Automated browser detected" },
        { status: 403 }
      );
    }

    // 5. Spy tool detection via referrer/UA patterns
    const spyPatterns = /adspy|bigspy|similarweb|semrush|ahrefs|spyfu/i;
    const referer = request.headers.get("referer") || "";
    if (spyPatterns.test(userAgent) || spyPatterns.test(referer)) {
      await logEvent(
        userData.id,
        domainData?.id || null,
        ip,
        userAgent,
        "blocked",
        "Spy Tool"
      );
      return NextResponse.json(
        { blocked: true, reason: "Spy tool detected" },
        { status: 403 }
      );
    }

    // 6. All checks passed - generate JWT
    const token = jwt.sign(
      {
        userId: userData.id,
        domain,
        ip,
        tier: userData.plan_tier,
      },
      JWT_SECRET,
      { expiresIn: "15s" }
    );

    await logEvent(
      userData.id,
      domainData?.id || null,
      ip,
      userAgent,
      "allowed",
      null
    );

    // Build response
    const response: Record<string, unknown> = {
      blocked: false,
      token,
      expiresIn: 15,
    };

    // Enterprise: deliver checkout_url so the script can inject links into "dead buttons"
    if (userData.plan_tier === "enterprise" && domainData.checkout_url) {
      response.inject_checkout = true;
      response.checkout_url = domainData.checkout_url;
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("[AkkaRabbit Shield] Error:", err);
    return NextResponse.json(
      { error: "Internal server error", blocked: false },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "AkkaRabbit Shield API",
    version: "2.0.0",
    status: "operational",
    timestamp: new Date().toISOString(),
  });
}
