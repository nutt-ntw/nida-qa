# NIDA QA — Stat Start

เว็บไซต์เรียนรู้ Quantitative Analysis แบบ interactive สำหรับผู้เริ่มต้น สร้างด้วย Next.js และ export เป็น static site สำหรับ GitHub Pages

เว็บไซต์: https://nutt-ntw.github.io/nida-qa/

## ใช้งานในเครื่อง

```bash
npm install
npm run dev
```

## สร้างไฟล์สำหรับเผยแพร่

```bash
npm run build
```

เมื่อ push ไปที่ `main` ระบบ GitHub Actions จะ deploy โฟลเดอร์ `out` ไปยัง GitHub Pages อัตโนมัติ
