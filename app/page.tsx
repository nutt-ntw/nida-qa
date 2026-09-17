"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faBookOpen,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faFlask,
  faLightbulb,
  faPlay,
  faRotateRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

type Lesson = {
  number: string;
  short: string;
  title: string;
  question: string;
  plain: string;
  takeaway: string;
  color: string;
};

const lessons: Lesson[] = [
  { number: "01", short: "จุดคุ้มทุน", title: "ขายเท่าไรถึงจะไม่ขาดทุน?", question: "ร้านต้องขายกี่ชิ้น ถึงจะเริ่มมีกำไร", plain: "รายรับต้องวิ่งทันต้นทุนคงที่และต้นทุนต่อชิ้นก่อน จุดที่เสมอกันพอดีเรียกว่า จุดคุ้มทุน", takeaway: "กำไรเริ่มหลังเส้นรายรับตัดเส้นต้นทุน", color: "#ff6b4a" },
  { number: "02", short: "เล่าเรื่องด้วยข้อมูล", title: "ค่าเฉลี่ยเล่าเรื่องทั้งหมดจริงไหม?", question: "ทำไมรายได้เฉลี่ยอาจทำให้เราเข้าใจผิด", plain: "Mean มองทุกค่า แต่ Median มองคนตรงกลาง เมื่อมีค่าที่สูงหรือต่ำผิดปกติ สองคำตอบนี้จะเล่าเรื่องต่างกัน", takeaway: "ดูทั้งค่ากลางและการกระจาย อย่าดูเลขเดียว", color: "#6c5ce7" },
  { number: "03", short: "ความน่าจะเป็น", title: "ความไม่แน่นอนคิดเป็นตัวเลขได้", question: "เกมนี้ควรเล่นไหม ถ้าเราอาจได้หรือเสีย", plain: "ความน่าจะเป็นไม่ได้ทำนายครั้งต่อไป แต่ช่วยบอกภาพระยะยาวผ่านค่าเฉลี่ยถ่วงน้ำหนักของทุกผลลัพธ์", takeaway: "โอกาส × ผลลัพธ์ = ภาพระยะยาว", color: "#00a884" },
  { number: "04", short: "ทดสอบสมมติฐาน", title: "หลักฐานแค่ไหนถึงเรียกว่า ‘ต่าง’", question: "ค่าเฉลี่ยที่เห็น ต่างจริงหรือเกิดจากความบังเอิญ", plain: "เราเริ่มจากสมมติว่า ‘ยังไม่ต่าง’ แล้วถามว่าข้อมูลที่เห็นเกิดยากแค่ไหน ถ้ายากมากจึงค่อยเปลี่ยนใจ", takeaway: "p-value เล็ก = ข้อมูลขัดกับสมมติฐานเดิมมาก", color: "#e84393" },
  { number: "05", short: "เปรียบเทียบหลายกลุ่ม", title: "สามกลุ่มต่างกันจริงหรือเปล่า?", question: "ยอดขายสามแบรนด์ต่างกัน หรือแค่แกว่งตามปกติ", plain: "ANOVA เปรียบเทียบ ‘ระยะห่างระหว่างกลุ่ม’ กับ ‘ความแกว่งภายในกลุ่ม’ ในครั้งเดียว", takeaway: "กลุ่มห่างกันมาก และภายในนิ่ง = มีแนวโน้มต่างจริง", color: "#d97706" },
  { number: "06", short: "พยากรณ์", title: "ใช้สิ่งที่รู้ ทำนายสิ่งที่ยังไม่รู้", question: "ระยะทางช่วยทำนายเวลาส่งพิซซ่าได้แค่ไหน", plain: "Regression วางเส้นที่ใกล้ข้อมูลโดยรวมที่สุด แล้วใช้ตำแหน่งบนเส้นเป็นค่าพยากรณ์ ไม่ใช่คำรับประกัน", takeaway: "ความสัมพันธ์ช่วยพยากรณ์ แต่ไม่ได้ยืนยันเหตุและผล", color: "#087ea4" },
  { number: "07", short: "การตัดสินใจ", title: "เลือกอย่างไร เมื่ออนาคตไม่แน่นอน", question: "ลงทุนมากหรือน้อย เมื่ออุปสงค์ยังไม่เกิด", plain: "นำผลตอบแทนของแต่ละสถานการณ์คูณโอกาส แล้วรวมเป็น Expected Payoff เพื่อเปรียบเทียบทางเลือกอย่างมีหลัก", takeaway: "ทางเลือกที่ดีที่สุด เปลี่ยนได้เมื่อความเชื่อเรื่องอนาคตเปลี่ยน", color: "#2d3436" },
];

const format = (value: number, digits = 0) => new Intl.NumberFormat("th-TH", { maximumFractionDigits: digits }).format(value);

function RangeControl({ label, value, min, max, step = 1, suffix = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return (
    <label className="control">
      <span><span>{label}</span><strong>{format(value, step < 1 ? 2 : 0)}{suffix}</strong></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function BreakEvenLab() {
  const [price, setPrice] = useState(30);
  const [variable, setVariable] = useState(10);
  const [fixed, setFixed] = useState(60000);
  const [quantity, setQuantity] = useState(3500);
  const margin = price - variable;
  const breakEven = margin > 0 ? Math.ceil(fixed / margin) : Infinity;
  const profit = quantity * margin - fixed;
  const maxQ = 6000;
  const x = (q: number) => 44 + (q / maxQ) * 500;
  const maxY = Math.max(price * maxQ, fixed + variable * maxQ, 1);
  const y = (v: number) => 230 - (v / maxY) * 185;
  return (
    <div className="lab-grid">
      <div className="controls-panel">
        <p className="eyebrow">ลองเป็นเจ้าของร้าน</p>
        <RangeControl label="ราคาขายต่อชิ้น" value={price} min={15} max={60} suffix=" บาท" onChange={setPrice} />
        <RangeControl label="ต้นทุนต่อชิ้น" value={variable} min={5} max={35} suffix=" บาท" onChange={setVariable} />
        <RangeControl label="ค่าใช้จ่ายคงที่" value={fixed} min={10000} max={100000} step={5000} suffix=" บาท" onChange={setFixed} />
        <RangeControl label="จำนวนที่คาดว่าจะขาย" value={quantity} min={0} max={6000} step={100} suffix=" ชิ้น" onChange={setQuantity} />
      </div>
      <div className="result-panel">
        <div className="result-head"><span>ภาพที่เกิดขึ้น</span><span className={profit >= 0 ? "status good" : "status warn"}>{profit >= 0 ? "มีกำไร" : "ยังขาดทุน"}</span></div>
        <svg className="line-chart" viewBox="0 0 580 260" role="img" aria-label="กราฟรายรับและต้นทุน">
          <line x1="44" y1="230" x2="554" y2="230" className="axis" />
          <line x1="44" y1="35" x2="44" y2="230" className="axis" />
          <line x1={x(0)} y1={y(0)} x2={x(maxQ)} y2={y(price * maxQ)} className="revenue-line" />
          <line x1={x(0)} y1={y(fixed)} x2={x(maxQ)} y2={y(fixed + variable * maxQ)} className="cost-line" />
          {Number.isFinite(breakEven) && breakEven <= maxQ && <><line x1={x(breakEven)} y1="230" x2={x(breakEven)} y2={y(price * breakEven)} className="guide" /><circle cx={x(breakEven)} cy={y(price * breakEven)} r="7" className="be-dot" /></>}
          <circle cx={x(quantity)} cy={y(price * quantity)} r="6" className="quantity-dot" />
          <text x="455" y={Math.max(25, y(price * maxQ) - 10)} className="chart-label revenue-text">รายรับ</text>
          <text x="430" y={y(fixed + variable * maxQ) + 22} className="chart-label cost-text">ต้นทุนรวม</text>
          <text x="44" y="250" className="tick">0</text><text x="510" y="250" className="tick">จำนวนขาย</text>
        </svg>
        <div className="metric-row"><div><small>จุดคุ้มทุน</small><strong>{Number.isFinite(breakEven) ? format(breakEven) : "เป็นไปไม่ได้"}</strong><span>ชิ้น</span></div><div><small>กำไรที่ยอดขายนี้</small><strong className={profit >= 0 ? "positive" : "negative"}>{profit >= 0 ? "+" : ""}{format(profit)}</strong><span>บาท</span></div></div>
        <p className="insight"><FontAwesomeIcon icon={faLightbulb} /> เพราะทุกชิ้นเหลือ {format(margin)} บาทไว้ช่วยจ่ายค่าใช้จ่ายคงที่ {format(fixed)} บาท</p>
      </div>
    </div>
  );
}

function CenterLab() {
  const [outlier, setOutlier] = useState(24000);
  const values = [5000, 5000, 7000, 9000, outlier];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const median = [...values].sort((a, b) => a - b)[2];
  return <div className="lab-grid"><div className="controls-panel"><p className="eyebrow">ลองขยับรายได้คนที่ 5</p><RangeControl label="รายได้คนที่ 5" value={outlier} min={9000} max={100000} step={1000} suffix=" บาท" onChange={setOutlier} /><div className="people-list">{values.map((v, i) => <div key={i}><span>คนที่ {i + 1}</span><div><i style={{ width: `${Math.max(6, (v / 100000) * 100)}%` }} /><b>{format(v)}</b></div></div>)}</div></div><div className="result-panel center-result"><div className="comparison"><div className="mean-card"><small>Mean · เฉลี่ยทุกคน</small><strong>{format(mean)}</strong><span>บาท</span></div><div className="median-card"><small>Median · คนตรงกลาง</small><strong>{format(median)}</strong><span>บาท</span></div></div><div className="balance"><span>Mean ถูกดึงไปทางค่าที่สูง</span><div><i style={{ left: `${Math.min(92, 8 + (mean / 100000) * 84)}%` }} data-label="Mean" /><i className="median-pin" style={{ left: `${8 + (median / 100000) * 84}%` }} data-label="Median" /></div></div><p className="insight"><FontAwesomeIcon icon={faLightbulb} /> ลองเลื่อนไป 100,000 บาท: Median ยังนิ่ง แต่ Mean กระโดดขึ้นทันที</p></div></div>;
}

function ProbabilityLab() {
  const outcomes = [{ label: "+1", value: 1, p: .3 }, { label: "+5", value: 5, p: .2 }, { label: "-3", value: -3, p: .5 }];
  const expected = outcomes.reduce((sum, item) => sum + item.value * item.p, 0);
  const [results, setResults] = useState<number[]>([]);
  const play = (count: number) => { const next = Array.from({ length: count }, () => { const r = Math.random(); return r < .3 ? 1 : r < .5 ? 5 : -3; }); setResults(next); };
  const average = results.length ? results.reduce((a, b) => a + b, 0) / results.length : 0;
  return <div className="lab-grid"><div className="controls-panel"><p className="eyebrow">เกมสุ่มจากบทเรียน</p><div className="outcome-cards">{outcomes.map((o) => <div key={o.label}><strong className={o.value > 0 ? "positive" : "negative"}>{o.label} บาท</strong><span>โอกาส {o.p * 100}%</span></div>)}</div><div className="button-row"><button className="primary-btn" onClick={() => play(10)}><FontAwesomeIcon icon={faPlay} /> เล่น 10 ครั้ง</button><button className="secondary-btn" onClick={() => play(100)}>เล่น 100 ครั้ง</button></div></div><div className="result-panel"><div className="result-head"><span>ผลการทดลอง</span><button className="icon-btn" onClick={() => setResults([])} aria-label="เริ่มใหม่"><FontAwesomeIcon icon={faRotateRight} /></button></div>{results.length ? <><div className="coin-grid">{results.slice(0, 100).map((r, i) => <span key={i} className={r > 0 ? "win" : "lose"}>{r > 0 ? "+" : ""}{r}</span>)}</div><div className="metric-row"><div><small>ค่าเฉลี่ยที่ทดลองได้</small><strong>{format(average, 2)}</strong><span>บาท/ครั้ง</span></div><div><small>ค่าที่คาดในระยะยาว</small><strong>{format(expected, 2)}</strong><span>บาท/ครั้ง</span></div></div></> : <div className="empty-state"><FontAwesomeIcon icon={faFlask} /><strong>กดเล่นเพื่อสุ่มผลลัพธ์</strong><span>ยิ่งทดลองมาก ค่าเฉลี่ยมักยิ่งเข้าใกล้ค่าคาดหวัง -0.20 บาท</span></div>}<p className="insight"><FontAwesomeIcon icon={faCircleInfo} /> เกมนี้อาจชนะบางครั้ง แต่โดยเฉลี่ยระยะยาวเสีย {Math.abs(expected).toFixed(2)} บาทต่อครั้ง</p></div></div>;
}

function erf(x: number) { const sign = x < 0 ? -1 : 1; const a = Math.abs(x); const t = 1 / (1 + .3275911 * a); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - .284496736) * t + .254829592) * t * Math.exp(-a * a); return sign * y; }
function HypothesisLab() {
  const [sampleMean, setSampleMean] = useState(11200); const [alpha, setAlpha] = useState(.05); const mu = 12000; const sigma = 2500; const n = 40; const z = (sampleMean - mu) / (sigma / Math.sqrt(n)); const p = 2 * (1 - .5 * (1 + erf(Math.abs(z) / Math.sqrt(2)))); const reject = p < alpha;
  return <div className="lab-grid"><div className="controls-panel"><p className="eyebrow">ตรวจคำกล่าว “รายได้เฉลี่ย 12,000”</p><RangeControl label="ค่าเฉลี่ยจากตัวอย่าง" value={sampleMean} min={10000} max={14000} step={100} suffix=" บาท" onChange={setSampleMean} /><div className="segmented"><span>ยอมผิดพลาดได้ (α)</span>{[.1, .05, .01].map((v) => <button key={v} className={alpha === v ? "active" : ""} onClick={() => setAlpha(v)}>{v}</button>)}</div><div className="givens"><span>ขนาดตัวอย่าง <b>{n} คน</b></span><span>ส่วนเบี่ยงเบนมาตรฐาน <b>{format(sigma)} บาท</b></span></div></div><div className="result-panel"><div className={`decision-card ${reject ? "reject" : "keep"}`}><span>คำตัดสินจากข้อมูล</span><strong>{reject ? "มีหลักฐานว่าแตกต่าง" : "หลักฐานยังไม่พอ"}</strong><p>{reject ? "ปฏิเสธ H₀" : "ยังไม่ปฏิเสธ H₀"}</p></div><div className="p-scale"><div><i style={{ left: `${Math.min(98, p * 500)}%` }} /><span className="threshold" style={{ left: `${alpha * 500}%` }} /></div><small>p-value = {p < .001 ? "< 0.001" : p.toFixed(3)} · เกณฑ์ α = {alpha}</small></div><p className="insight"><FontAwesomeIcon icon={faLightbulb} /> {reject ? "ผลที่เห็นเกิดได้ยากมาก หากค่าเฉลี่ยจริงยังเป็น 12,000 บาท" : "ความต่างเท่านี้ยังอาจเกิดจากความแกว่งของการสุ่มตัวอย่าง"}</p></div></div>;
}

function AnovaLab() {
  const [spread, setSpread] = useState(1); const groups = [[5 - spread, 6, 7 + spread], [9 - spread, 10, 11 + spread], [7 - spread, 8, 9 + spread]]; const means = groups.map((g) => g.reduce((a, b) => a + b) / g.length); const all = groups.flat(); const grand = all.reduce((a, b) => a + b) / all.length; const ssb = groups.reduce((sum, g, i) => sum + g.length * (means[i] - grand) ** 2, 0); const ssw = groups.reduce((sum, g, i) => sum + g.reduce((s, x) => s + (x - means[i]) ** 2, 0), 0); const f = (ssb / 2) / (ssw / 6 || .0001);
  return <div className="lab-grid"><div className="controls-panel"><p className="eyebrow">ยอดขายน้ำดื่ม 3 แบรนด์</p><RangeControl label="ความแกว่งภายในแต่ละแบรนด์" value={spread} min={0} max={5} step={.5} suffix=" หน่วย" onChange={setSpread} /><div className="group-dots">{groups.map((g, i) => <div key={i}><b>{["A", "B", "C"][i]}</b><span>{g.map((v, j) => <i key={j} style={{ left: `${(v / 16) * 100}%` }} />)}</span><em>เฉลี่ย {means[i]}</em></div>)}</div></div><div className="result-panel"><div className="anova-visual"><div><span>ระหว่างกลุ่ม</span><strong>{format(ssb, 1)}</strong></div><FontAwesomeIcon icon={faArrowRight} /><div><span>ภายในกลุ่ม</span><strong>{format(ssw, 1)}</strong></div></div><div className="ratio-card"><small>อัตราส่วน F</small><strong>{format(f, 2)}</strong><span>{f > 5.14 ? "กลุ่มห่างกันเด่นชัด" : "ความแกว่งกลบความต่าง"}</span></div><p className="insight"><FontAwesomeIcon icon={faLightbulb} /> เลื่อนความแกว่งให้สูงขึ้น แม้ค่าเฉลี่ยเท่าเดิม เราก็มั่นใจว่ากลุ่มต่างกันได้น้อยลง</p></div></div>;
}

function RegressionLab() {
  const [distance, setDistance] = useState(7); const predicted = 1.22 + 1.756 * distance; const points = [[1.8, 5], [2.4, 6], [3.4, 7], [4.1, 9], [5.8, 12], [8.4, 17]]; const sx = (x: number) => 45 + (x / 10) * 480; const sy = (y: number) => 225 - (y / 20) * 180;
  return <div className="lab-grid"><div className="controls-panel"><p className="eyebrow">ร้านพิซซ่า: ระยะทาง → เวลาส่ง</p><RangeControl label="ระยะทางจากร้าน" value={distance} min={0} max={10} step={.5} suffix=" กม." onChange={setDistance} /><div className="formula-card"><span>เส้นพยากรณ์จากบทเรียน</span><strong>เวลา = 1.22 + 1.756 × ระยะทาง</strong><small>ทุก 1 กม. ที่เพิ่ม เวลาส่งเพิ่มโดยเฉลี่ย 1.756 นาที</small></div></div><div className="result-panel"><svg className="scatter" viewBox="0 0 560 260" role="img" aria-label="กราฟความสัมพันธ์ระหว่างระยะทางและเวลาส่ง"><line x1="45" y1="225" x2="535" y2="225" className="axis" /><line x1="45" y1="35" x2="45" y2="225" className="axis" /><line x1={sx(0)} y1={sy(1.22)} x2={sx(10)} y2={sy(18.78)} className="reg-line" />{points.map(([xv, yv], i) => <circle key={i} cx={sx(xv)} cy={sy(yv)} r="6" className="data-dot" />)}<line x1={sx(distance)} y1="225" x2={sx(distance)} y2={sy(predicted)} className="guide" /><circle cx={sx(distance)} cy={sy(predicted)} r="8" className="predict-dot" /><text x={Math.min(450, sx(distance) + 10)} y={sy(predicted) - 12} className="chart-label">{format(predicted, 1)} นาที</text><text x="450" y="250" className="tick">ระยะทาง</text><text x="8" y="25" className="tick">เวลา</text></svg><div className="prediction"><span>คาดว่าจะใช้เวลา</span><strong>{format(predicted, 1)}</strong><b>นาที</b></div><p className="insight"><FontAwesomeIcon icon={faCircleInfo} /> จุดจริงไม่จำเป็นต้องอยู่บนเส้นพอดี เส้นนี้บอกแนวโน้มโดยรวม</p></div></div>;
}

function DecisionLab() {
  const [high, setHigh] = useState(30); const [medium, setMedium] = useState(50); const low = Math.max(0, 100 - high - medium); const valid = high + medium <= 100; const probs = [high / 100, medium / 100, low / 100]; const choices = [{ name: "ลงทุนมาก", values: [60, 40, -26] }, { name: "ลงทุนปานกลาง", values: [25, 50, -10] }, { name: "ลงทุนน้อย", values: [20, 15, 12] }]; const scores = choices.map((c) => c.values.reduce((sum, value, i) => sum + value * probs[i], 0)); const best = scores.indexOf(Math.max(...scores));
  return <div className="lab-grid"><div className="controls-panel"><p className="eyebrow">กำหนดภาพอนาคตของตลาด</p><RangeControl label="โอกาสอุปสงค์สูง" value={high} min={0} max={100} suffix="%" onChange={setHigh} /><RangeControl label="โอกาสอุปสงค์ปานกลาง" value={medium} min={0} max={100} suffix="%" onChange={setMedium} /><div className={`prob-total ${valid ? "valid" : "invalid"}`}><span>โอกาสอุปสงค์ต่ำ</span><strong>{low}%</strong><small>{valid ? "รวมครบ 100%" : "สูง + ปานกลาง ต้องไม่เกิน 100%"}</small></div></div><div className="result-panel"><div className="payoff-table"><div className="table-row table-head"><span>ทางเลือก</span><span>สูง</span><span>กลาง</span><span>ต่ำ</span><b>ค่าคาดหวัง</b></div>{choices.map((c, i) => <div className={`table-row ${valid && best === i ? "best" : ""}`} key={c.name}><span>{valid && best === i && <FontAwesomeIcon icon={faCheck} />} {c.name}</span>{c.values.map((v) => <span key={v}>{v}</span>)}<b>{valid ? scores[i].toFixed(1) : "—"}</b></div>)}</div><div className="decision-summary"><span>จากความเชื่อนี้ ควรเลือก</span><strong>{valid ? choices[best].name : "ปรับโอกาสก่อน"}</strong></div><p className="insight"><FontAwesomeIcon icon={faLightbulb} /> ค่าคาดหวังคือค่าเฉลี่ยระยะยาว ไม่ได้รับประกันผลของครั้งเดียว</p></div></div>;
}

const labs = [BreakEvenLab, CenterLab, ProbabilityLab, HypothesisLab, AnovaLab, RegressionLab, DecisionLab];

export default function Home() {
  const [active, setActive] = useState(0); const [menuOpen, setMenuOpen] = useState(false); const [completed, setCompleted] = useState<number[]>([]); const lesson = lessons[active]; const Lab = useMemo(() => labs[active], [active]);
  const selectLesson = (index: number) => { setActive(index); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const markDone = () => { setCompleted((items) => items.includes(active) ? items : [...items, active]); if (active < lessons.length - 1) setTimeout(() => selectLesson(active + 1), 350); };
  useEffect(() => {
    type Tool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown };
    type ModelDocument = Document & { modelContext?: { registerTool: (tool: Tool, options?: { signal: AbortSignal }) => void | Promise<void> } };
    const context = (document as ModelDocument).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const lessonNumber = (input: unknown) => {
      const value = typeof input === "object" && input !== null && "lessonNumber" in input ? Number((input as { lessonNumber: unknown }).lessonNumber) : NaN;
      if (!Number.isInteger(value) || value < 1 || value > lessons.length) throw new Error("lessonNumber must be an integer from 1 to 7");
      return value;
    };
    const schema = { type: "object", properties: { lessonNumber: { type: "integer", minimum: 1, maximum: 7 } }, required: ["lessonNumber"], additionalProperties: false };
    void Promise.resolve(context.registerTool({ name: "open_lesson", title: "เปิดบทเรียน", description: "Open one of the seven visible BA5500 lessons by its lesson number.", inputSchema: schema, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { const value = lessonNumber(input); setActive(value - 1); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); return { lessonNumber: value, title: lessons[value - 1].title }; } }, { signal: lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(context.registerTool({ name: "complete_lesson", title: "ทำบทเรียนให้เสร็จ", description: "Mark one visible BA5500 lesson as completed in the progress tracker.", inputSchema: schema, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { const value = lessonNumber(input); setCompleted((items) => items.includes(value - 1) ? items : [...items, value - 1]); return { lessonNumber: value, completed: true }; } }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  return <main style={{ "--accent": lesson.color } as React.CSSProperties}>
    <header className="topbar"><a className="brand" href="#top" aria-label="Stat Start หน้าแรก"><span>ST<span>Ʌ</span>T</span><b>START</b></a><div className="course-title"><span>BA5500</span><p>Quantitative Analysis for Business Decisions</p></div><div className="progress-top"><span>เรียนแล้ว {completed.length} / {lessons.length}</span><div><i style={{ width: `${(completed.length / lessons.length) * 100}%` }} /></div></div><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="เปิดเมนูบทเรียน"><FontAwesomeIcon icon={menuOpen ? faTimes : faBars} /></button></header>
    <div className="app-shell" id="top">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}><div className="sidebar-heading"><span>เส้นทางเรียนรู้</span><small>เริ่มจากเรื่องใกล้ตัว</small></div><nav>{lessons.map((item, index) => <button key={item.number} onClick={() => selectLesson(index)} className={active === index ? "active" : ""}><span className="lesson-number">{completed.includes(index) ? <FontAwesomeIcon icon={faCheck} /> : item.number}</span><span><b>{item.short}</b><small>{item.title}</small></span><FontAwesomeIcon icon={faChevronRight} /></button>)}</nav><div className="source-note"><FontAwesomeIcon icon={faBookOpen} /><span><b>เนื้อหาจากเอกสาร BA5500</b><small>เรียบเรียงใหม่เพื่อผู้เริ่มต้น</small></span></div></aside>
      <section className="content"><div className="lesson-hero"><div><p className="chapter-label">บทที่ {lesson.number} · {lesson.short}</p><h1>{lesson.title}</h1><p className="hero-question">{lesson.question}</p></div><div className="hero-mark" aria-hidden="true"><span>{lesson.number}</span><i /></div></div>
        <div className="plain-card"><span className="plain-icon"><FontAwesomeIcon icon={faLightbulb} /></span><div><small>เข้าใจใน 20 วินาที</small><p>{lesson.plain}</p></div></div>
        <section className="lab-section"><div className="section-heading"><div><p className="eyebrow"><FontAwesomeIcon icon={faFlask} /> ห้องทดลอง</p><h2>ลองขยับ แล้วดูว่าเกิดอะไรขึ้น</h2></div><span>ไม่ต้องจำสูตร</span></div><Lab /></section>
        <div className="takeaway"><span>จำแค่ประโยคนี้</span><strong>“{lesson.takeaway}”</strong></div>
        <div className="lesson-nav"><button className="secondary-btn" disabled={active === 0} onClick={() => selectLesson(active - 1)}><FontAwesomeIcon icon={faChevronLeft} /> บทก่อนหน้า</button><button className="complete-btn" onClick={markDone}>{completed.includes(active) ? "เรียนบทนี้แล้ว" : "เข้าใจแล้ว ไปบทต่อไป"}<FontAwesomeIcon icon={completed.includes(active) ? faCheck : faChevronRight} /></button></div>
        <footer><span>Stat Start · BA5500</span><p>สื่อประกอบการเรียนรู้ ไม่ใช้แทนคำแนะนำทางธุรกิจหรือการวิเคราะห์เชิงวิชาชีพ</p></footer>
      </section>
    </div>
  </main>;
}
