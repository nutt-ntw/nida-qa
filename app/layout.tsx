import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nutt-ntw.github.io/nida-qa/"),
  title: "Stat Start | เข้าใจสถิติแบบไม่ต้องเก่งเลข",
  description: "บทเรียน Quantitative Analysis แบบโต้ตอบ จากเนื้อหา BA5500 สำหรับผู้เริ่มต้น",
  openGraph: {
    title: "Stat Start | เข้าใจสถิติแบบไม่ต้องเก่งเลข",
    description: "ลองปรับตัวเลข เห็นผลทันที แล้วค่อยเข้าใจสูตร",
    type: "website",
    images: [{ url: "https://nutt-ntw.github.io/nida-qa/og.png", width: 1200, height: 630, alt: "Stat Start เข้าใจสถิติแบบไม่ต้องเก่งเลข" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stat Start | เข้าใจสถิติแบบไม่ต้องเก่งเลข",
    description: "ลองปรับตัวเลข เห็นผลทันที แล้วค่อยเข้าใจสูตร",
    images: ["https://nutt-ntw.github.io/nida-qa/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
