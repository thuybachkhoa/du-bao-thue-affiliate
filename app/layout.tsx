import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AffTax 2026",
  description:
    "Công cụ dự tính hoàn thuế và số thuế phải nộp cho Affiliate theo quy định năm 2026.",

     icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title: "DỰ TÍNH THUẾ TNCN 2026",
    description:
      "Công cụ dự tính hoàn thuế và số thuế phải nộp cho Affiliate theo quy định năm 2026.",
    url: "https://du-tinh-tncn-2026.vercel.app",
    siteName: "DỰ TÍNH THUẾ TNCN 2026",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Dự tính Thuế TNCN 2026",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  {children}

  <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-EVBWPNHT6V"
    strategy="afterInteractive"
  />

  <Script id="google-analytics" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-EVBWPNHT6V');
    `}
  </Script>
</body>
    </html>
  );
}
