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
  title: "Thuế TNCN",
  description:
    "Công cụ dự tính hoàn thuế và số thuế phải nộp cho cá nhân có thu nhập từ Affiliate theo quy định hiện hành.",

     icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title: "DỰ TÍNH QUYẾT TOÁN THUẾ TNCN",
    description:
      "Công cụ dự tính hoàn thuế và số thuế phải nộp cho cá nhân có thu nhập từ Affiliate theo quy định hiện hành.",
    url: "https://du-tinh-tncn-2026.vercel.app",
    siteName: "DỰ TÍNH QUYẾT TOÁN THUẾ TNCN",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Dự Tính Quyết Toán Thuế TNCN",
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
