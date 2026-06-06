/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser with sufficient limit for receipt/slip base64 images
app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI safely
const geminiApiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  console.log("Google Gemini API Client Initialized Successfully!");
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI features will fallback to rule-based simulations.");
}

// 1. API Endpoint: Chatbot Advisor with Tailored Thai Context
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history, userType } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      // Fallback response for missing API Key
      return res.json({
        text: `[โหมดจำลอง - ไม่พบคีย์ Gemini API] สวัสดีครับในฐานะโค้ชการเงินสำหรับสัญชาติผู้ใช้: **${userType || 'ทั่วไป'}** ผมแนะนำให้คุณลองบันทึกรายรับของตนเองเพื่อดูรายงาน สำหรับคำถามเรื่อง: "${message}" นั้น วิธีที่ดีที่สุดในการจัดการเงินคือการลดรายจ่ายที่ไม่จำเป็นลง 10% และออมก่อนใช้อย่างสม่ำเสมอครับ!`
      });
    }

    // Set custom persona based on segment
    let systemPrompt = `คุณคือ "โค้ชการเงินอัจฉริยะ (AI Financial Coach)" ในแอปพลิเคชันผู้ช่วยจัดการการเงิน
หน้าหลักของคุณคือคอยให้คำแนะนำเกี่ยวกับเป้าหมายทางการเงินและการบริหารเงินให้กับผู้ใช้คนไทยอย่างเป็นกันเองเหมือนเพื่อนแท้ที่หวังดี
ผู้ใช้กลุ่มเป้าหมายปัจจุบันของคุณคือกลุ่ม:: [${userType || 'ทั่วไป'}]
- หากเป็น 'student': เน้นคำแนะนำออมเงินเพื่อซื้ออุปกรณ์การเรียน ค่าขนม พาร์ทไทม์ และลดค่าชอปปิ้ง ชาบู กิจการความบันเทิงในวัยเรียน
- หากเป็น 'worker': เน้นสร้างกองทุนสำรองฉุกเฉิน, ลงทุนลดหย่อนภาษี SSF/RMF, บริหารสัดส่วนเที่ยว/กิน/เก็บ
- หากเป็น 'family': เน้นงบครอบครัว การศึกษาลูกหนี้บ้าน และเงินกู้สำรองภัยพิบัติ
- หากเป็น 'sme': เน้น "การแยกเงินส่วนตัวกับเงินสำหรับธุรกิจออกจากกันเด็ดขาด" การประเมิน Cashflow และค่าโฆษณามืออาชีพ

วิธีการตอบ:
- ตอบด้วยภาษาไทยที่เป็นมิตร ชัดเจน เข้าใจง่าย นอบน้อมแต่ตรงประเด็น
- ใช้สัญลักษณ์ Bullet point หรือการวิเคราะห์สั้นๆ เพื่อให้อ่านง่ายขึ้น
- อย่าใช้ศัพท์เทคนิคระดับสูงที่ไม่มีคำอธิบาย และกรุณาพยายามเสริมแรงใจเชิงบวกเสมอ`;

    // Process chat request using model gemini-3.5-flash
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    // Add user type prefix to message context for model
    const fullMessage = `[กลุ่มผู้ใช้: ${userType}] คำถาม: ${message}`;

    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chatInstance.sendMessage({ message: fullMessage });
    res.json({ text: response.text });

  } catch (error: any) {
    console.error("Express Chat Route Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong in AI Chat engine" });
  }
});

// 2. API Endpoint: Structured Spending Behavior & Unnecessary Expense Spotter
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { transactions, userType, monthlyBudget } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "Transactions array is required" });
    }

    if (!ai) {
      // Fallback analytical response when API key is not present
      const mockSummary = userType === 'sme' 
        ? "วิเคราะห์พฤติกรรม (โหมดจำลอง): คุณควรระวังเป็นพิเศษเรื่องการโอนหรือชำระอาหารเย็น และค่าของใช้ส่วนตัวด้วยบัญชีธนาคารร้านค้า เพราะจะทำให้ระบบบัญชีกำไรสับสน แนะนำให้โอนเงินเดือนคงที่ให้ตนเองเพื่อคุมงบ"
        : "วิเคราะห์พฤติกรรม (โหมดจำลอง): มีการใช้จ่ายในหมวดชอปปิ้ง ท่องเที่ยว และชาร้านโปรดเป็นอันดับต้นๆ แนะนำให้พยายามลดการชาร์จบัตรเครดิตก่อนนอน เพื่อไม่ให้เกินความสามารถในการชำระหนี้";
        
      return res.json({
        summary: mockSummary,
        topCategories: [
          { category: "ความบันเทิง/ช้อปปิ้ง", amount: 1500, percentage: 38 },
          { category: "เครื่องดื่ม/กาแฟ", amount: 480, percentage: 12 },
          { category: "สังสรรค์/จัดเต็ม", amount: 1980, percentage: 50 }
        ],
        unnecessaryExpenses: [
          {
            id: "un_1",
            name: "สลีปชิมกาแฟสตาร์บัคส์ / ขนมบ่อยครั้ง",
            category: "เครื่องดื่ม/กาแฟ",
            amount: 700,
            potentialSaving: "ลดความถี่ลงครึ่งหนึ่ง สลับดื่มกาแฟดริปเอง ออมเงินได้ 350 บาท/เดือน"
          },
          {
            id: "un_2",
            name: "ช้อปปิ้งแพลตฟอร์มออนไลน์ช่วงกลางคืน",
            category: "ช้อปปิ้ง",
            amount: 1100,
            potentialSaving: "ลบแอปช่วงมีโปรโมชั่น ลังเลก่อนคลิกโอน ออมเงินได้ 800 บาท/เดือน"
          }
        ],
        costReductionAdvice: [
          "ใช้สูตรออมเงิน 50-30-20 (จำเป็น 50%, ความสุข 30%, เก็บออม 20%)",
          "สำหรับการสังสรรค์ชาบู ให้ตั้งวงเงินงบส่วนตัวแยกเป็นซองย่อย และงดซื้อบัตรเครดิตหากผ่อนสะสมเยอะ",
          "ฝึกโอนเงินเข้าเป้าหมายเก็บสะสมเหรียญในแอปทันทีเมื่อสิ้นสุดการรับเงินรอบสัปดาห์"
        ]
      });
    }

    // Convert transactions to string summary for the prompts
    const transactionSummary = transactions.map(t => 
      `- วันที่: ${t.date} | ประเภท: ${t.type} | หมวดหมู่: ${t.category} | จำนวนเงิน: ${t.amount} บาท | บันทึก: ${t.note} | ตรวจสอบผ่าน: ${t.paymentMethod}`
    ).join("\n");

    const prompt = `วิเคราะห์ข้อมูลธุรกรรมการรับเงินและใช้เงินของผู้ใช้ดังต่อไปนี้:
กลุ่มผู้ใช้ปัจจุบัน: ${userType || 'ทั่วไป'}
งบประมาณค่าใช้ต่อเดือนที่กำหนดไว้: ${monthlyBudget || 30000} บาท

รายการธุรกรรมสรุปแบบสังเขป:
${transactionSummary}

หน้าที่ของคุณคือทำการประเมินพฤติกรรมการเงินอย่างเข้มงวดแต่วิเคราะห์อย่างสร้างสรรค์:
1. เขียนสรุปวิเคราะห์พฤติกรรมการใช้เงินเป็นภาษาไทย โดยชี้จุดอ่อน เช่น นิสัยชอบสอยของเซลล์ตอนกลางคืน, การแยกเงินธุรกิจ ปัญหาชานม, งบกินบุฟเฟต์หนาหู
2. ค้นหาสิ่งที่เป็น “รายจ่ายที่ไม่จำเป็นหรือสามารถลดได้ (Unnecessary Expenses)” เช่น การเข้าคาเฟ่บ่อย บัตรสมาชิกชิ้นซ้ำ ช้อปฉุกเฉิน ยอดถอนเงินสดแบบฟุ่มเฟือย ให้วิเคราะห์เป็นอาร์เรย์ของแต่ละรายจ่ายพร้อมจำนวนเงินและคำแนะนำช่องว่างเงินออม
3. ให้คำแนะนำ 3 ข้อการปฏิบัติในการลดรายจ่ายที่เหมาะสมกับกลุ่มเฉพาะของผู้คนนั้นๆ

คุณต้องตอบกลับมาในรูปแบบ JSON ตรงตามโครงสร้าง Schema เท่านั้น!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "บทวิเคราะห์พฤติกรรมการใช้เงินอย่างละเอียด ชี้คุณและโทษอย่างสุภาพ"
            },
            unnecessaryExpenses: {
              type: Type.ARRAY,
              description: "รายการรายจ่ายที่ไม่จำเป็นหรือลดได้ และปริมาณความคุ้มค่าของการออมกลับคืนมา",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING, description: "ชื่อรายชื่อเหตุผลการจ่ายฟุ่มเฟือย เช่น กาแฟพรีเมียมแบรนด์บ่อยวัน, ช้อปโปร 6.6 แก้เครียด" },
                  category: { type: Type.STRING, description: "หมวดหมู่รายการ" },
                  amount: { type: Type.NUMBER, description: "จำนวนเงินที่น่าจะใช้ฟุ่มเฟือยรวมกันต่อเดือนโดยประเมิน" },
                  potentialSaving: { type: Type.STRING, description: "ไอเดียประหยัดเงินและความคิดสร้างสรรค์ในเงินออม" }
                },
                required: ["id", "name", "category", "amount", "potentialSaving"]
              }
            },
            costReductionAdvice: {
              type: Type.ARRAY,
              description: "ขั้นตอนหรือคำแนะนำกลยุทธ์การลดรายจ่ายแบบปฏิบัติได้จริง 3-4 ข้อสั้นๆ",
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "unnecessaryExpenses", "costReductionAdvice"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);

  } catch (error: any) {
    console.error("Express Analyze Route Error:", error);
    res.status(500).json({ error: error.message || "Error analyzing financial history" });
  }
});

// 3. API Endpoint: Receipt / E-Slip OCR and Auto-Categorizer
app.post("/api/gemini/ocr", async (req, res) => {
  try {
    const { imageBase64, simulatedSlipText } = req.body;

    if (!imageBase64 && !simulatedSlipText) {
      return res.status(400).json({ error: "Missing slip data or image" });
    }

    if (!ai) {
      // Fallback simulating receipt parser if API Key is not set
      const slipKeyword = (simulatedSlipText || "").toLowerCase();
      let merchantName = "ร้านค้าทั่วไป";
      let amount = 100;
      let category = "อาหาร";
      let note = "บิลสลิปโอนสำรอง";

      if (slipKeyword.includes("คอฟฟี่") || slipKeyword.includes("coffee") || slipKeyword.includes("140")) {
        merchantName = "ร้านกาแฟหอมละมุน (คอฟฟี่ คาเฟ่)";
        amount = 140;
        category = "เครื่องดื่ม/กาแฟ";
        note = "วิเคราะห์ผ่านระบบสลิปจำลอง K-Bank";
      } else if (slipKeyword.includes("ชาบู") || slipKeyword.includes("shabu") || slipKeyword.includes("389")) {
        merchantName = "ชาบูชิ บิวตี้ฟูล (บจก.ชาบูกรุ๊ป)";
        amount = 389;
        category = "สังสรรค์/จัดเต็ม";
        note = "สแกนสลิป SCB ฉลองชาบูกลุ่มเพื่อน";
      } else if (slipKeyword.includes("แฟลช") || slipKeyword.includes("flash") || slipKeyword.includes("1550") || slipKeyword.includes("1,550")) {
        merchantName = "แฟลช เอ็กซ์เพรส สาทร (โคลส คูเรียร์)";
        amount = 1550;
        category = "ค่าจัดส่ง/ขนส่ง";
        note = "สลิปส่งพัสดุด่วน SME";
      }

      return res.json({
        merchantName,
        amount,
        category,
        note
      });
    }

    // AI is present, do real parsing!
    let prompt = `คุณคือระบบตรวจจับและถอดรหัสรูปสลิปและใบเสร็จรับเงินธนาคารของไทย (Interactive Thai Bank Slip Scan System)
หน้าที่วิเคราะห์ข้อมูลรูปภาพสลิปที่แนบมา หรือรายละเอียดข้อความสลีป และดึงข้อมูลเหล่านี้ออกมารูปแบบ JSON:
1. merchantName: ชื่อร้านค้า / ผู้รับเงิน / ธนาคารที่ชำระ (เช่น ชาบูชิ, สตาร์บัคส์, บจก.คอฟฟี่, ป้าอ้วนแกงส้ม)
2. amount: ยอดเงินสุทธิ (หน่วยเป็นจำนวนเลขทศนิยม Baht ทับหลัก)
3. category: จัดกลุ่มให้อยู่ในหมวดหมู่นี้เท่านั้น:
   - 'ที่อยู่อาศัย'
   - 'อาหาร' (อาหารทั่วไปมื้อหลัก)
   - 'เครื่องดื่ม/กาแฟ' (ชาไข่มุก กาแฟ ของหวาน)
   - 'ความบันเทิง' (เติมเกมส์ เน็ต บัตรคอนเสิร์ต สมาชิกแชร์)
   - 'สังสรรค์/จัดเต็ม' (บุฟเฟต์ เบียร์ ปาร์ตี้ ส้มตำกรุ๊ปล่า)
   - 'การเดินทาง' (รถไฟฟ้า ขนส่งสาธารณะ ค่าน้ำมัน แท็กซี่)
   - 'ช้อปปิ้ง' (เสื้อผ้า เครื่องสำอาง อุปกรณ์แต่งรถ)
   - 'การเรียน/อุปกรณ์' (หนังสือ เครื่องเขียน งานสัมมนา)
   - 'สาธารณูปโภค' (ค่าน้ำ ค่าไฟ มือถือ อินเทอร์เน็ต)
   - 'สุขภาพ/โรงพยาบาล' (ยา หาหมอฟัน คลินิกสปา)
   - 'ค่าการตลาด' (ค่ายิงแอด FB/Tiktok)
   - 'ต้นทุนสินค้า' (ซื้อเสื้อผ้า ม้วนผ้ามาตุน อุปกรณ์ผลิต)
   - 'ค่าจัดส่ง/ขนส่ง' (เหมาพัสดุ flash J&T ไปรษณีย์)
   - 'ใช้จ่ายส่วนตัว'
4. note: รายละเอียดสั้นๆ ของสิ่งที่โอน เช่น "โอนชำระเงินค่าอาหารเย็นสะท้อนจากสลิป"

กรุณาวิเคราะห์อย่างละเอียดรอบคอบ หากตรวจจับตัวสลิปร้านค้าได้`;

    let response;

    if (imageBase64) {
      // Analyze base64 image
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64
        }
      };

      const textPart = {
        text: prompt
      };

      response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchantName: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ["merchantName", "amount", "category", "note"]
          }
        }
      });
    } else {
      // Analyze text metadata representing the slip
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${prompt}\n\nข้อความวิเคราะห์ดังนี้:\n${simulatedSlipText}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchantName: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ["merchantName", "amount", "category", "note"]
          }
        }
      });
    }

    const ocrResult = JSON.parse(response.text || "{}");
    res.json(ocrResult);

  } catch (error: any) {
    console.error("Express OCR Slip Route Error:", error);
    res.status(500).json({ error: error.message || "Error parsing bank slip image" });
  }
});

// Configure Vite middleware in development or serve static assets in production
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Development Server Middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build output middleware loaded.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started and routes listening on port http://localhost:${PORT}`);
  });
}

runServer();
