import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AkkaRabbit — Enterprise Funnel Shield",
  description:
    "Blindagem de nível Enterprise para funis de vendas. Proteja suas Landing Pages, VSLs e ofertas contra espiões, clonadores e tráfego fraudulento.",
  keywords: ["funnel protection", "anti-spy", "cloaking", "landing page security", "VSL protection"],
  openGraph: {
    title: "AkkaRabbit — Enterprise Funnel Shield",
    description: "Proteja seus funis de vendas contra espionagem e fraude.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
