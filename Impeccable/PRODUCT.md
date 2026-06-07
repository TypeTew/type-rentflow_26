# Product Specification & Design System: Cash Receipt System

## 1. Vision & Purpose
- **Product Name:** RentFlow - Cash Receipt Module
- **Core Mission:** ระบบออกใบเสร็จรับเงินสดที่รวดเร็ว ออกเอกสารได้ถูกต้องตามกฎหมาย และแสดงผลหน้าจอพิมพ์ใบเสร็จ (Print Preview) ที่จัดวางหน้ากระดาษได้อย่างเนี้ยบและเป็นมืออาชีพ
- **Target Audience:** เจ้าของธุรกิจหรือผู้บริหารจัดการที่ต้องรับเงินสดจากลูกค้า และต้องการออกหลักฐานการเงินทันที

## 2. Design Persona & Surface Type
- **Surface Type:** Product Surface (เน้นฟังก์ชัน การกรอกข้อมูลที่รวดเร็ว แผงควบคุมตัวเลข และตารางสรุปยอดเงิน ไม่เน้นกราฟิกตกแต่ง)
- **Tone & Mood:** High-Trust (น่าเชื่อถือ), Clean (สะอาดตา), Precise (แม่นยำ), Financial-Grade.
- **Visual Vibe:** ดูเป็นระบบงานการเงินที่ปลอดภัย จัดระเบียบข้อมูลเป็นสัดส่วนชัดเจน สบายตา

## 3. Core Features & Layout Structure (Shape)
- **Receipt Creator Form:** ฟอร์มกรอกข้อมูลการรับเงิน (ชื่อผู้รับเงิน, ชื่อผู้จ่ายเงิน, รายการสินค้า/บริการ, จำนวนเงิน, วันที่)
- **Dynamic Calculation Summary:** ส่วนคำนวณเงินสด ยอดรวม (Subtotal), ภาษี (VAT), และยอดสุทธิ (Total) ต้องแสดงผลตัวเลขขนาดใหญ่ ชัดเจน อ่านง่าย
- **Print-Ready Preview Component:** หน้าต่างจำลองใบเสร็จจริงก่อนพิมพ์ ที่ต้องซ่อนปุ่มและเมนูที่ไม่จำเป็นออกเมื่อผู้ใช้กดสั่งพิมพ์ (Print Media CSS)

## 4. Design Tokens & Constraints (Impeccable Rules)
*กฎเหล็กคุมดีไซน์ด้วย Tailwind CSS v4 และ Shadcn/ui*

### 🎨 Color Strategy (โทนสีสถาบันการเงินที่น่าเชื่อถือ)
- **No Pure Blacks/Whites:** ห้ามใช้สีดำสนิท `#000000` หรือขาวสนิท `#ffffff` ในส่วนของ UI หน้าจอ
- **Base Background:** ใช้สีเทาโทนอุ่น (เช่น `bg-slate-50` หรือ `bg-zinc-50`) เพื่อลดความล้าของสายตาตอนนั่งคีย์ข้อมูล
- **Primary Accent:** ใช้สีน้ำเงินเข้มหรือสีส้มอิฐเข้มเพื่อความน่าเชื่อถือ (`bg-slate-900` หรือ `bg-orange-600`)
- **Success/Money Color:** ตัวเลขยอดเงินที่ชำระแล้ว หรือสถานะ "จ่ายแล้ว" ให้ใช้โทนสีเขียวใบไม้เข้มที่ดูสุภาพ (`text-emerald-700`, `bg-emerald-50`) ห้ามใช้สีเขียวสะท้อนแสง

### 📐 Typography & Financial Hierarchy
- **Numbers Matter:** ตัวเลขแสดงจำนวนเงินและเลขที่ใบเสร็จ (Receipt No.) ต้องใช้ฟอนต์ที่มีความกว้างตัวเลขเท่ากัน (Tabular Figures เช่นคลาส `font-mono` หรือ `tabular-nums`) เพื่อให้หลักหน่วย หลักสิบ หลักร้อย ตรงกันเสมอในตาราง
- **Status Badges:** ป้ายสถานะ (เช่น "ต้นฉบับ", "สำเนา", "ชำระเงินแล้ว") ต้องเห็นชัดแต่ไม่ตะโกน

### 🚫 AI Anti-Patterns to Avoid (สิ่งที่มีสิทธิ์พังและห้ามทำ)
- **No Card-in-Card:** ห้ามทำกล่องกรอกเงินซ้อนในการ์ดสี่เหลี่ยมหลายๆ ชั้นเด็ดขาด ให้ใช้เส้นกริดหรือการเว้นระยะ (Gap) ช่วยแบ่งฝั่ง
- **No Invisible Text:** ห้ามใช้ตัวหนังสือสีเทาอ่อนเกินไปบนพื้นขาวสำหรับตัวเลขการเงิน (ต้องผ่านเกณฑ์ Accessibility WCAG AA เสมอ)
- **No Broken Prints:** ห้ามลืมเขียนคำสั่ง `@media print` สำหรับหน้าใบเสร็จจริง เวลาพิมพ์ออกกระดาษ A4 หรือกระดาษความร้อน ต้องไม่มีขอบปุ่มหรือพื้นหลังสีเทาติดไป

## 5. Tech Stack Context
- **Framework:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS v4 
- **Component Base:** Shadcn/ui (เช่นใช้ `Button`, `Input`, `Table`, `Dialog` จากโฟลเดอร์ `src/components/ui/`)