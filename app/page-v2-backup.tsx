 "use client";
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}
  import { useState, useRef } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";
import Image from "next/image";

  export default function Home() {
    const [salary, setSalary] = useState("");

    const [shopeeIncome, setShopeeIncome] = useState("");
    const [tiktokIncome, setTiktokIncome] = useState("");
    const [lazadaIncome, setLazadaIncome] = useState("");
    const [otherIncome, setOtherIncome] = useState("");

    const [shopeeTax, setShopeeTax] = useState("");
    const [tiktokTax, setTiktokTax] = useState("");
    const [lazadaTax, setLazadaTax] = useState("");
    const [otherTax, setOtherTax] = useState("");

    const [dependents, setDependents] = useState("0");
    const [taxYear, setTaxYear] = useState("2026");
    const [taxPayerType, setTaxPayerType] =
  useState("employee"); 
const [showDeductionDetail, setShowDeductionDetail] = useState(false);
const [insuranceAmount, setInsuranceAmount] =
  useState("");
    const [salaryTax, setSalaryTax] = useState("");
const [showZaloPopup, setShowZaloPopup] =
  useState(false);
const [showZaloBanner, setShowZaloBanner] =
  useState(false);  
const [isCalculating, setIsCalculating] =
  useState(false);  
    const [result, setResult] = useState({
  totalIncome: 0,
  deduction: 0,
  insuranceDeduction: 0,
  personalDeduction: 0,
  taxableIncome: 0,
  taxPayable: 0,
  taxPaid: 0,
  refundOrPayMore: 0,
});
const resultRef = useRef<HTMLDivElement>(null);
    const formatMoney = (value?: number) => {
  return (value ?? 0).toLocaleString("vi-VN") + " VNĐ";
};
  
const numberToVietnameseWords = (num: number): string => {
      num = Math.round(num);
  if (num === 0) return "Không đồng";

  const units = [
    "",
    "nghìn",
    "triệu",
    "tỷ",
    "nghìn tỷ",
    "triệu tỷ",
  ];

  const readTriple = (n: number): string => {
    const numbers = [
      "không",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];

    let result = "";

    const hundred = Math.floor(n / 100);
    const ten = Math.floor((n % 100) / 10);
    const unit = n % 10;

    if (hundred > 0) {
      result += numbers[hundred] + " trăm ";
    }

    if (ten > 1) {
      result += numbers[ten] + " mươi ";

      if (unit === 1) result += "mốt";
      else if (unit === 5) result += "lăm";
      else if (unit > 0) result += numbers[unit];
    } else if (ten === 1) {
      result += "mười ";

      if (unit === 5) result += "lăm";
      else if (unit > 0) result += numbers[unit];
    } else if (unit > 0) {
      if (hundred > 0) result += "lẻ ";
      result += numbers[unit];
    }

    return result.trim();
  };

  const parts: string[] = [];

  let unitIndex = 0;

  while (num > 0) {
    const block = num % 1000;

    if (block !== 0) {
      parts.unshift(
        `${readTriple(block)} ${units[unitIndex]}`.trim()
      );
    }

    num = Math.floor(num / 1000);
    unitIndex++;
  }

  const result = parts.join(" ");

  return (
    result.charAt(0).toUpperCase() +
    result.slice(1) +
    " đồng"
  );
};
  const formatInputNumber = (value: string) => {
    const number = value.replace(/\D/g, "");

    if (!number) return "";

    return Number(number).toLocaleString("vi-VN");
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, "")) || 0;
  };
    const calculateTax = (
  income: number,
  year: string
) => {
      let tax = 0;

      if (income <= 0) return 0;

    const levels =
  year === "2026"
    ? [
        { limit: 120000000, rate: 0.05 },
        { limit: 360000000, rate: 0.10 },
        { limit: 720000000, rate: 0.20 },
        { limit: 1200000000, rate: 0.30 },
        { limit: Infinity, rate: 0.35 },
      ]
    : [
        { limit: 60000000, rate: 0.05 },
        { limit: 120000000, rate: 0.10 },
        { limit: 216000000, rate: 0.15 },
        { limit: 384000000, rate: 0.20 },
        { limit: 624000000, rate: 0.25 },
        { limit: 960000000, rate: 0.30 },
        { limit: Infinity, rate: 0.35 },
      ];

      let previous = 0;

      for (const level of levels) {
        if (income > level.limit) {
          tax += (level.limit - previous) * level.rate;
          previous = level.limit;
        } else {
          tax += (income - previous) * level.rate;
          break;
        }
      }

      return tax;
    };

    const handleCalculate = async () => {
      setIsCalculating(true);
      const salaryIncome = parseNumber(salary);
const insuranceDeduction =
  parseNumber(insuranceAmount);
      const affiliateIncome =
    parseNumber(shopeeIncome) +
    parseNumber(tiktokIncome) +
    parseNumber(lazadaIncome) +
    parseNumber(otherIncome);

      const totalIncome = salaryIncome + affiliateIncome;

      const personalDeduction =
  taxYear === "2026"
    ? 186000000 +
      Number(dependents) * 74400000
    : 132000000 +
      Number(dependents) * 52800000;

const deduction =
  personalDeduction +
  insuranceDeduction;

      const taxableIncome = Math.max(
        0,
        totalIncome - deduction
      );

  const taxPayable = Math.round(
  calculateTax(
    taxableIncome,
    taxYear
  )
);

const taxPaid =
  parseNumber(shopeeTax) +
  parseNumber(tiktokTax) +
  parseNumber(lazadaTax) +
  parseNumber(otherTax) +
  parseNumber(salaryTax);
      const refundOrPayMore = Math.round(
  taxPaid - taxPayable
);
await new Promise(resolve =>
  setTimeout(resolve, 800)
);
setResult({
  totalIncome,
  deduction,
  insuranceDeduction,
  personalDeduction,
  taxableIncome,
  taxPayable,
  taxPaid,
  refundOrPayMore,
});
setIsCalculating(false);
    };
    const handleContinueToResult = () => {
  localStorage.setItem(
    "zalo-popup",
    "true"
  );

  setShowZaloPopup(false);
  setShowZaloBanner(true);
   window.gtag?.("event", "calculate_tax", {
    tax_year: taxYear,
  });
  handleCalculate();
};

const handleJoinZalo = () => {
  localStorage.setItem(
    "zalo-popup",
    "true"
  );

  window.open(
    "https://zalo.me/g/zsmp0htnkspnutapjjyt",
    "_blank"
  );

  setShowZaloPopup(false);
  setShowZaloBanner(true);
  window.gtag?.("event", "calculate_tax", {
  tax_year: taxYear,
});
  handleCalculate();
};
  const handleReset = () => {
    setSalary("");

    setShopeeIncome("");
    setTiktokIncome("");
    setLazadaIncome("");
    setOtherIncome("");

    setShopeeTax("");
    setTiktokTax("");
    setLazadaTax("");
    setOtherTax("");

    setDependents("0");
    setInsuranceAmount("");
    setSalaryTax("");

    setResult({
  totalIncome: 0,
  deduction: 0,
  insuranceDeduction: 0,
  personalDeduction: 0,
  taxableIncome: 0,
  taxPayable: 0,
  taxPaid: 0,
  refundOrPayMore: 0,
});
setShowZaloBanner(false);
  };
const handleShare = async () => {
  if (!resultRef.current) return;
const isMobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );
  try {
    const shareHeader =
  document.getElementById("share-header");

const webBanner =
  document.getElementById("web-banner");

if (isMobile) {
  if (shareHeader)
    shareHeader.classList.remove("hidden");

  if (webBanner)
    webBanner.classList.add("hidden");

  await new Promise(resolve =>
    setTimeout(resolve, 500)
  );
}
    const dataUrl = await toPng(
      resultRef.current,
      {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      }
    );
if (isMobile) {
  if (shareHeader)
    shareHeader.classList.add("hidden");

  if (webBanner)
    webBanner.classList.remove("hidden");
}
    const blob = await (
      await fetch(dataUrl)
    ).blob();

    const file = new File(
      [blob],
      "ket-qua-thue.png",
      {
        type: "image/png",
      }
    );

  if (
  isMobile &&
  navigator.share &&
  navigator.canShare?.({
    files: [file],
  })
) {
  await navigator.share({
    title: "Kết quả dự tính thuế TNCN",
    files: [file],
  });

  return;
}

    const shareText = `
📊 ${
  taxYear === "2025"
    ? "KẾT QUẢ QUYẾT TOÁN THUẾ TNCN 2025"
    : "KẾT QUẢ DỰ TÍNH THUẾ TNCN 2026"
}

💰 Tổng thu nhập: ${result.totalIncome.toLocaleString("vi-VN")} VNĐ
📈 Thu nhập tính thuế: ${result.taxableIncome.toLocaleString("vi-VN")} VNĐ
🏛️ Tổng thuế phải nộp: ${result.taxPayable.toLocaleString("vi-VN")} VNĐ
✅ Thuế đã khấu trừ: ${result.taxPaid.toLocaleString("vi-VN")} VNĐ

${
  result.refundOrPayMore >= 0
    ? `🎉 Dự kiến được hoàn: ${result.refundOrPayMore.toLocaleString("vi-VN")} VNĐ`
    : `⚠️ Dự kiến phải nộp thêm: ${Math.abs(result.refundOrPayMore).toLocaleString("vi-VN")} VNĐ`
}

🔗 https://du-tinh-tncn-2026.vercel.app

Thủy Bách Khoa | Zalo 0932-171-685
`;

await navigator.clipboard.writeText(
  shareText
);

alert(
  "Đã sao chép kết quả. Hãy dán vào Zalo hoặc Facebook."
);

  } catch (error) {
    console.error(error);
  }
};
  const handleExportPDF = async () => {
    const pdfHeader =
  document.getElementById("pdf-header");

const webBanner =
  document.getElementById("web-banner");

if (pdfHeader)
  pdfHeader.classList.remove("hidden");

if (webBanner)
  webBanner.classList.add("hidden");
  if (!resultRef.current) return;
const isMobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );
  try {
    await new Promise(resolve =>
  setTimeout(resolve, 1500)
);
    const dataUrl = await toPng(
  resultRef.current,
  {
    pixelRatio: 4,
    backgroundColor: "#ffffff",
  }
);
const today = new Date()
  .toLocaleDateString("vi-VN")
  .replace(/\//g, "-");

if (isMobile) {
  const link = document.createElement("a");

  link.download = `thue-tncn-${today}.png`;
  link.href = dataUrl;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
if (pdfHeader)
  pdfHeader.classList.add("hidden");

if (webBanner)
  webBanner.classList.remove("hidden");
  return;
}
   const pdf = new jsPDF();

const imgProps =
  pdf.getImageProperties(dataUrl);

const pdfWidth =
  pdf.internal.pageSize.getWidth();

const pdfHeight =
  (imgProps.height * pdfWidth) /
  imgProps.width;

const pageHeight =
  pdf.internal.pageSize.getHeight();

let heightLeft = pdfHeight;
let position = 0;

pdf.addImage(
  dataUrl,
  "PNG",
  0,
  position,
  pdfWidth,
  pdfHeight
);

heightLeft -= pageHeight;

while (heightLeft > 0) {
  position = heightLeft - pdfHeight;

  pdf.addPage();

  pdf.addImage(
    dataUrl,
    "PNG",
    0,
    position,
    pdfWidth,
    pdfHeight
  );

  heightLeft -= pageHeight;
}

pdf.save(`thue-tncn-${today}.pdf`);
if (pdfHeader)
  pdfHeader.classList.add("hidden");

if (webBanner)
  webBanner.classList.remove("hidden");
  } catch (error) {

  if (pdfHeader)
    pdfHeader.classList.add("hidden");

  if (webBanner)
    webBanner.classList.remove("hidden");

  console.error(error);
  alert(String(error));
}
};
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[1800px] bg-white rounded-2xl shadow-lg p-8">
        <form
  onSubmit={(e) => {
    e.preventDefault();

    const popupSeen =
      localStorage.getItem(
        "zalo-popup"
      );
if (popupSeen) {
  window.gtag?.("event", "calculate_tax", {
    tax_year: taxYear,
  });

  handleCalculate();
  setShowZaloBanner(true);
  return;
}
    setShowZaloPopup(true);
  }}
>

 <h1 className="text-5xl font-bold text-center text-[#177D96]">
  {taxYear === "2025"
    ? "QUYẾT TOÁN THUẾ 2025"
    : "DỰ TÍNH THUẾ 2026"}
</h1>
<div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-2 mb-2">

  <div className="flex items-center gap-3">
    <span className="text-base font-semibold text-slate-800">
      Năm tính thuế
    </span>

    <select
      value={taxYear}
      onChange={(e) => setTaxYear(e.target.value)}
      className="rounded-xl border border-[#177D96] bg-white px-4 py-2 text-[#C26A1B] font-semibold shadow-sm"
    >
      <option value="2026">2026</option>
      <option value="2025">2025</option>
    </select>
  </div>

  <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 items-center">
    <span className="text-base font-semibold text-slate-800">
      Đối tượng quyết toán
    </span>

    <select
  value={taxPayerType}
  onChange={(e) =>
    setTaxPayerType(e.target.value)
  }
  className="rounded-xl border border-[#177D96] bg-white px-4 py-2 text-[#C26A1B] text-center font-semibold"
>
  <option value="employee">
    Người lao động
  </option>

  <option value="director">
    Giám đốc không hưởng lương
  </option>
</select>

  </div>
</div>
    <p className="text-center text-green-600 text-base font-semibold mt-1">
  {taxYear === "2026"
    ? "Áp dụng biểu thuế TNCN 5 bậc năm 2026"
    : "Áp dụng biểu thuế TNCN 7 bậc năm 2025"}
</p>
<div className="mt-4 lg:grid lg:grid-cols-12 lg:gap-6">
  <div className="lg:col-span-7 pr-2">
    <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mt-2 mb-2">
    <span className="text-xl">📊</span>

    <h2 className="font-bold text-2xl text-[#C26A1B]">
      THÔNG TIN THU NHẬP
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

    <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center mb-4">

  <div>
  <h2 className="font-bold text-xl">
    {taxPayerType === "director"
    ? "1️⃣ THU NHẬP CHỊU THUẾ KHÁC"
    : "1️⃣ THU NHẬP TỪ LƯƠNG (THỰC NHẬN)"}
  </h2>

  <p className="text-ml text-gray-500 italic pl-8 mt-1">
  {taxPayerType === "director"
    ? "Thu nhập đầu tư, cổ tức, thu nhập khác..."
    : "Lũy kế từ đầu năm bao gồm thưởng, phụ cấp ..."}
</p>

</div>

  <div className="relative w-full md:w-auto">

  <input
    type="text"
    value={salary}
    onChange={(e) =>
      setSalary(
        formatInputNumber(e.target.value)
      )
    }
    placeholder={
    taxPayerType === "director"
      ? "Nhập số tiền"
      : "Nhập số lương"
  }
    className="border border-amber-200 rounded-xl px-3 py-3 h-14 w-full md:w-52 pr-14 text-center font-bold text-lg text-amber-700 bg-amber-50 placeholder:text-base placeholder:font-normal placeholder:italic placeholder:text-amber-700"
  />

  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 font-bold text-lg">
    VNĐ
  </span>

</div>

</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center">

  {/* Người phụ thuộc */}
  <div>
  <label className="font-semibold text-base block mb-2 text-center">
    👫 Người phụ thuộc
  </label>

<p className="text-sm text-[#177D96] text-center italic mb-3">
    Đã đăng ký với BHXH
  </p>

  <div className="flex justify-center">
    <select
      value={dependents}
      onChange={(e) => setDependents(e.target.value)}
      className="w-24 border text-center rounded-lg border-[#177D96] bg-white px-3 py-2 bg-white pr-8"
    >
      {[...Array(11)].map((_, i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  </div>
</div>

{/* Bảo hiểm */}
<div className="flex flex-col  items-center">

  <div className="flex items-center gap-2 mb-2 text-center">
    <span>🛡️</span>
    <span className="font-semibold text-base">
      Bảo hiểm bắt buộc
    </span>
  </div>

  <p className="text-sm text-[#177D96] italic mb-3">
  BHXH đã đóng trong năm
</p>

<>
    <>
            <div className="relative">

        <input
          type="text"
          value={insuranceAmount}
          onChange={(e) =>
            setInsuranceAmount(
              formatInputNumber(e.target.value)
            )
          }
          placeholder="Nhập tổng BHXH đã đóng"
          className="w-full border border-[#177D96] rounded-xl text-center text-base font-medium px-3 py-2 bg-white placeholder:text-sm placeholder:italic placeholder:font-normal placeholder:text-slate-400"
        />
        </div>
      </>
  </>

</div>

  <div className="flex flex-col items-center">

  <div className="flex items-center gap-2 mb-2 text-center">
    <span>💰</span>
    <span className="font-semibold text-base">
      Thuế đã khấu trừ
    </span>
  </div>

  <p className="text-sm text-[#177D96] italic mb-3">
    Thuế TNCN đã nộp trong năm
  </p>

    <input
  type="text"
  value={salaryTax}
  onChange={(e) =>
    setSalaryTax(
      formatInputNumber(e.target.value)
    )
  }
  placeholder="Nhập tổng thuế đã nộp"
  className="w-full border border-[#177D96] rounded-xl text-center text-base font-medium px-3 py-2 bg-white placeholder:text-sm placeholder:italic placeholder:font-normal placeholder:text-slate-400"
/>
 </div>
</div>
<div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-1">
  <p className="text-base text-amber-700 italic text-center">
    ℹ️ Tra cứu VssID (BHXH) và eTax Mobile (Thuế TNCN) để nhập số liệu chính xác.
  </p>
  <p className="text-base text-amber-700 italic text-center mt-1">
    ⚠️ BHXH được giảm trừ tối đa theo mức đóng BHXH bắt buộc do pháp luật quy định.
  </p>
</div>
  </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-5 mb-5">

  <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center mb-4">

    <div>
  <h2 className="font-bold text-xl">
    2️⃣ THU NHẬP AFFILIATE THEO DASHBOARD
  </h2>

  <p className="text-ml text-gray-500 pl-8 italic mt-1">
    Lũy kế từ đầu năm
  </p>
</div>

    <div className="bg-green-50 border border-green-200 rounded-xl h-14 w-52 flex items-center justify-center font-bold text-lg text-green-700">
      {formatMoney(
        parseNumber(shopeeIncome) +
        parseNumber(tiktokIncome) +
        parseNumber(lazadaIncome) +
        parseNumber(otherIncome)
      )}
    </div>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

    <div>

  <div className="flex items-center justify-center gap-2 mb-2">

    <Image
      src="/logos/shopee.png"
      alt="Shopee"
      width={24}
      height={24}
    />

    <span className="font-semibold">
      Shopee
    </span>

  </div>

  <input
    type="text"
    value={shopeeIncome}
    placeholder="Shopee"
    onChange={(e) =>
      setShopeeIncome(
        formatInputNumber(e.target.value)
      )
    }
    className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
  />

</div>

    <div>

  <div className="flex items-center justify-center gap-2 mb-2">

    <Image
      src="/logos/tiktok.png"
      alt="TikTok"
      width={20}
      height={20}
    />

    <span className="font-semibold">
      TikTok
    </span>

  </div>

  <input
    type="text"
    value={tiktokIncome}
    placeholder="Tiktok"
    onChange={(e) =>
      setTiktokIncome(
        formatInputNumber(e.target.value)
      )
    }
    className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
  />

</div>

    <div>

  <div className="flex items-center justify-center gap-2 mb-2">

    <Image
      src="/logos/lazada.png"
      alt="Lazada"
      width={28}
      height={28}
    />

    <span className="font-semibold">
      Lazada
    </span>

  </div>

  <input
    type="text"
    value={lazadaIncome}
    placeholder="Lazada"
    onChange={(e) =>
      setLazadaIncome(
        formatInputNumber(e.target.value)
      )
    }
    className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
  />

</div>

    <div>

  <div className="flex items-center justify-center gap-2 mb-2">

    <Image
      src="/logos/other.png"
      alt="Khác"
      width={24}
      height={24}
    />

    <span className="font-semibold">
      Khác
    </span>

  </div>

  <input
    type="text"
    value={otherIncome}
    placeholder="Khác"
    onChange={(e) =>
      setOtherIncome(
        formatInputNumber(e.target.value)
      )
    }
    className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
  />

</div>

  </div>

</div>

    <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-5 mb-5">

  <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center mb-4">

    <div>
  <h2 className="font-bold text-xl">
    3️⃣ THUẾ AFFILIATE ĐÃ KHẤU TRỪ
  </h2>

  <p className="text-ml text-gray-500 pl-8 italic mt-1">
    Lũy kế từ đầu năm
  </p>
</div>

    <div className="bg-purple-50 border border-purple-200 rounded-xl h-14 w-52 flex items-center justify-center font-bold text-lg text-purple-700">

      {formatMoney(
        Number(shopeeTax.replace(/\./g, "")) +
        Number(tiktokTax.replace(/\./g, "")) +
        Number(lazadaTax.replace(/\./g, "")) +
        Number(otherTax.replace(/\./g, ""))
      )}

    </div>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

    {/* Shopee */}
    <div>

      <div className="flex items-center justify-center gap-2 mb-2">

        <Image
          src="/logos/shopee.png"
          alt="Shopee"
          width={24}
          height={24}
        />

        <span className="font-semibold">
          Shopee
        </span>

      </div>

      <input
        type="text"
        value={shopeeTax}
        placeholder="Thuế Shopee"
        onChange={(e) =>
          setShopeeTax(formatInputNumber(e.target.value))
        }
        className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
      />

    </div>

    {/* TikTok */}
    <div>

      <div className="flex items-center justify-center gap-2 mb-2">

        <Image
          src="/logos/tiktok.png"
          alt="TikTok"
          width={20}
          height={20}
        />

        <span className="font-semibold">
          TikTok
        </span>

      </div>

      <input
        type="text"
        value={tiktokTax}
        placeholder="Thuế Tiktok"
        onChange={(e) =>
          setTiktokTax(formatInputNumber(e.target.value))
        }
        className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
      />

    </div>

    {/* Lazada */}
    <div>

      <div className="flex items-center justify-center gap-2 mb-2">

        <Image
          src="/logos/lazada.png"
          alt="Lazada"
          width={28}
          height={28}
        />

        <span className="font-semibold">
          Lazada
        </span>

      </div>

      <input
        type="text"
        value={lazadaTax}
        placeholder="Thuế Lazada"
        onChange={(e) =>
          setLazadaTax(formatInputNumber(e.target.value))
        }
        className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
      />

    </div>

    {/* Khác */}
    <div>

      <div className="flex items-center justify-center gap-2 mb-2">

        <Image
          src="/logos/other.png"
          alt="Khác"
          width={24}
          height={24}
        />

        <span className="font-semibold">
          Khác
        </span>

      </div>

      <input
        type="text"
        value={otherTax}
        placeholder="Thuế Khác"
        onChange={(e) =>
          setOtherTax(formatInputNumber(e.target.value))
        }
        className="w-full border border-[#177D96] bg-white rounded-lg px-2 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
      />

    </div>

  </div>

</div>

          {/* Nút chính */}
<button
  type="submit"
  disabled={isCalculating}
  className="w-full bg-[#177D96] hover:bg-[#146F85] text-white rounded-xl px-5 py-2 shadow-md transition-all"
>
  <div className="relative flex items-center justify-center">

{isCalculating ? (
  <>
    <div className="w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />

    <div className="text-center">
      <div className="font-bold text-lg">
        ĐANG TÍNH...
      </div>

      <div className="text-sm opacity-90">
        Vui lòng chờ trong giây lát
      </div>
    </div>
  </>
) : (
  <>
    <span className="text-3xl mr-3">
      🧮
    </span>

    <div className="text-center">
      <div className="font-bold text-lg">
        TÍNH TOÁN NGAY
      </div>

      <div className="text-sm opacity-90">
        Tính thuế TNCN chỉ trong vài giây
      </div>
    </div>
  </>
)}

  </div>
</button>
</div>
</div>
<div className="lg:col-span-5 lg:sticky lg:top-4 lg:self-start">
<div
  ref={resultRef}
  className="mt-4 lg:mt-0 bg-slate-50 rounded-xl p-4"
>
  {showZaloBanner && (
  <div
    id="web-banner"
    className="border border-pink-100 rounded-xl p-4 mb-3 bg-[#FFF9FB]"
  >
    <div className="flex items-center gap-3">

  <img
  src="/community-icon.png"
  alt="Cộng đồng Zalo"
  className="w-24 h-24 rounded-full shrink-0"
/>

      <div className="flex-1">

        <div className="font-bold text-lg text-[#177D96]">
          💖 Duy trì công cụ miễn phí
        </div>

        <div className="text-base text-slate-600 mt-1">
          Nhóm chia sẻ deal, mã giảm giá
          và cơ hội kiếm thêm thu nhập Affiliate.
        </div>

        <button
          type="button"
          onClick={() =>
            window.open(
              "https://zalo.me/g/zsmp0htnkspnutapjjyt",
              "_blank"
            )
          }
          className="mt-2 bg-[#177D96] text-white px-4 py-2 font-bold rounded-lg text-base"
        >
          Tham gia nhóm Zalo →
        </button>

      </div>

    </div>
  </div>
)}
<div id="pdf-header" className="hidden bg-white border border-orange-200 rounded-xl p-4 mb-5">
  <div className="flex flex-col md:flex-row items-center gap-4">

    <img
  src="/icon.png"
  alt="App Icon"
  width={72}
  height={72}
  className="shrink-0"
/>

    <div className="border-t-2 md:border-t-0 md:border-l-2 border-orange-400 pt-4 md:pt-0 md:pl-4 w-full text-center md:text-left">
      <h2 className="font-bold text-xl md:text-2xl text-[#177D96]">
  {taxYear === "2025"
    ? "APP QUYẾT TOÁN THUẾ TNCN 2025"
    : "APP DỰ TÍNH THUẾ TNCN 2026"}
</h2>

      <p className="text-base italic text-slate-600 mt-1">
  📅 Ngày xuất: {new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}
</p>

      <p className="text-base italic text-slate-600">
        👤 Phát triển bởi Thủy Bách Khoa | Zalo 0932-171-685
      </p>
    </div>

  </div>
</div>
<div
  id="share-header"
  className="hidden bg-[#FFF9FB] border border-pink-200 rounded-xl p-3 mb-4"
>
  <div className="text-center py-1">

        <div>
      <div className="font-bold text-[#177D96] text-base leading-tight">
  {taxYear === "2025"
    ? "APP QUYẾT TOÁN THUẾ TNCN 2025"
    : "APP DỰ TÍNH THUẾ TNCN 2026"}
</div>

      <div className="text-xs text-slate-600 mt-1">
  <div>👤 Phát triển bởi Thủy Bách Khoa</div>
  <div>📱 Zalo: 0932-171-685</div>
</div>

      <div className="text-xs text-slate-600 mt-1">
        📅 Ngày xuất file: {new Date()
          .toLocaleDateString("vi-VN")
          .replace(/\//g, "-")}
      </div>

    </div>

  </div>
</div>

            <div className="text-left mb-4">
    <h2 className="font-bold text-2xl text-[#C26A1B]">
  📋 {taxYear === "2025"
      ? "KẾT QUẢ QUYẾT TOÁN THUẾ"
      : "KẾT QUẢ DỰ TÍNH THUẾ"}
</h2>

    <p className="text-[#177D96] text-base italic mt-1">
  {taxYear === "2025"
    ? "🛡️ Kết quả quyết toán chỉ mang tính tham khảo, không phải căn cứ quyết toán thuế."
    : "🛡️ Kết quả dự tính chỉ mang tính tham khảo, không phải căn cứ quyết toán thuế."}
</p>
  </div>

  {result.refundOrPayMore >= 0 ? (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mb-3">
  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center">

    <img
  src="/wallet-green.png"
  alt="Hoàn thuế"
  width={80}
  height={80}
  className="shrink-0"
/>

    <div>
      <div className="text-green-600 text-lg font-semibold uppercase">
        {taxYear === "2025"
  ? "ĐƯỢC HOÀN THUẾ"
  : "DỰ KIẾN ĐƯỢC HOÀN THUẾ"}
      </div>

      <div className="text-2xl md:text-4xl font-bold text-green-600 break-all">
        {formatMoney(result.refundOrPayMore).replace(" VNĐ", "")}
      
     <span className="text-2xl font-semibold text-green-600 ml-2">
    VNĐ
  </span>
      </div>
      <div className="text-sm italic text-green-600 mt-1">
    ({numberToVietnameseWords(
  Math.round(result.refundOrPayMore)
)})
  </div>
    </div>
  </div>
</div>
  ) : (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-5">
  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">

    <img
  src="/wallet-red.png"
  alt="Nộp thêm"
  width={80}
  height={80}
  className="shrink-0"
/>

    <div>
      <div className="text-red-600 text-base font-semibold uppercase">
        {taxYear === "2025"
  ? "PHẢI NỘP THÊM"
  : "DỰ KIẾN PHẢI NỘP THÊM"}
      </div>

      <div className="text-2xl md:text-4xl font-bold text-red-600 break-all">
        {formatMoney(
  Math.abs(result.refundOrPayMore)
).replace(" VNĐ", "")}

      <span className="text-xl font-semibold text-red-600 ml-2">
    VNĐ
  </span>
      </div>
      <div className="text-sm italic text-red-600 mt-1">
    ({numberToVietnameseWords(
    Math.abs(result.refundOrPayMore)
  )})
  </div>
    </div>

  </div>
</div>
  )}
            <div className="space-y-3 text-base">

  <div className="flex justify-between items-start gap-3 bg-white rounded-lg px-4 py-3 mb-2">
  <span className="font-medium flex-1">
    💰 Tổng thu nhập
  </span>

  <span className="font-semibold text-right shrink-0">
    {formatMoney(result.totalIncome)}
  </span>
</div>

 <div className="bg-white rounded-lg px-4 py-3 mb-2">

  <button
  type="button"
  onClick={() => setShowDeductionDetail(!showDeductionDetail)}
  className="w-full flex items-center justify-between"
>
  <span className="font-medium text-left">
    🟢 Tổng giảm trừ
  </span>

  <div className="flex items-center gap-2 shrink-0">
    <span className="font-semibold">
      {formatMoney(result.deduction)}
    </span>

    <span>
      {showDeductionDetail ? "▲" : "▼"}
    </span>
  </div>
</button>

{showDeductionDetail && (
  <div className="mt-2 border-t border-slate-100 pt-2">

    <div className="flex flex-col md:flex-row md:justify-between text-sm text-gray-500 italic mt-1 pl-4">
      <span>1️⃣ Bảo hiểm xã hội</span>

      <span className="text-right shrink-0">
  {formatMoney(result.insuranceDeduction)}
</span>
    </div>

    <div className="flex flex-col md:flex-row md:justify-between text-sm text-gray-500 italic mt-1 pl-4">
      <span>
        2️⃣  Giảm trừ gia cảnh
      </span>

      <span className="text-right shrink-0">
        {formatMoney(result.personalDeduction)}
      </span>
    </div>
</div>
)}
</div>
<hr className="my-3 border-slate-300" />

<div className="flex justify-between items-start gap-3 bg-orange-50 rounded-lg px-4 py-3 mb-2">              
  <span className="font-bold text-orange-700 flex-1">
    📊 Thu nhập tính thuế
  </span>

  <span className="font-bold text-orange-700 text-right shrink-0">
    {formatMoney(result.taxableIncome)}
  </span>
</div>

  <div className="flex justify-between items-start gap-3 bg-[#208AA2]/5 rounded-lg px-4 py-3 mb-2 border border-teal-200">
  <span className="font-bold text-[#177D96] flex-1">
    🏛️ Tổng thuế phải nộp
  </span>

  <span className="font-bold text-[#177D96] text-right shrink-0">
    {formatMoney(result.taxPayable)}
  </span>
</div>

  <div className="flex justify-between items-start gap-3 bg-purple-50 rounded-lg px-4 py-3 mb-2 border border-purple-200">
  <span className="font-bold text-purple-700 flex-1">
    ✅ Tổng thuế đã khấu trừ
  </span>

  <span className="font-bold text-purple-700 text-right shrink-0">
    {formatMoney(result.taxPaid)}
  </span>
</div>
{/* Nút phụ */}
{(
  result.totalIncome > 0 ||
  result.taxPayable > 0 ||
  result.taxPaid > 0
) && (

<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

  <button
    type="button"
  onClick={handleExportPDF}
    className="hidden md:block border-2 border-red-400 rounded-2xl py-1 px-4 bg-white hover:bg-red-50 transition-all"
  >
    <div className="flex items-center justify-center gap-2">
      <span className="text-xl">📄</span>

      <div className="text-left">
        <div className="font-bold text-red-500 text-lg">
          XUẤT PDF
        </div>

        <div className="text-sm text-gray-500">
          Lưu kết quả ra PDF
        </div>
      </div>
    </div>
  </button>

  <button
    type="button"
  onClick={handleShare}
    className="border-2 border-green-500 rounded-2xl py-1 px-4 bg-white hover:bg-green-50 transition-all"
  >
    <div className="flex items-center justify-center gap-2">
      <span className="text-xl">🔗</span>

      <div className="text-left">
        <div className="font-bold text-green-600 text-lg">
          CHIA SẺ KẾT QUẢ
        </div>

        <div className="text-sm text-gray-500">
          Chia sẻ qua Zalo, Facebook...
        </div>
      </div>
    </div>
  </button>

</div>

)}
                  </div>

            <div className="mt-5 text-sm text-gray-500 border-t pt-3">

              <p>
  • Giảm trừ bản thân:
  {taxYear === "2026"
    ? " 15.500.000 VNĐ/tháng = 186.000.000 VNĐ/năm."
    : " 11.000.000 VNĐ/tháng = 132.000.000 VNĐ/năm."}
</p>

<p>
  • Giảm trừ người phụ thuộc:
  {taxYear === "2026"
    ? " 6.200.000 VNĐ/tháng/người = 74.400.000 VNĐ/năm/người."
    : " 4.400.000 VNĐ/tháng/người = 52.800.000 VNĐ/năm/người."}
</p>
{taxYear === "2026" && (
              <p>
                • Giả định từ nay đến cuối năm 
                không phát sinh thêm thu nhập.
              </p>
 )}
            </div>
            </div>
</div>
</div>
</form>
{showZaloPopup && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">

      <div className="text-center">

        <div className="text-5xl mb-3">
          🎁
        </div>

        <h2 className="text-2xl font-bold text-[#177D96]">
          Cộng đồng Deal & Mã giảm giá
        </h2>

        <p className="mt-3 text-gray-600">
          Website được phát triển và duy trì miễn phí.
        </p>

        <p className="mt-2 text-gray-600">
          Nếu thấy hữu ích, hãy tham gia cộng đồng Deal &
          Mã giảm giá để ủng hộ chi phí
          vận hành website nhé 💖
        </p>

        <div className="bg-slate-50 rounded-xl p-4 mt-4 text-left space-y-4">

  <div className="flex gap-3">
    <span className="text-3xl">🔥</span>

    <div>
      <div className="font-bold text-slate-800">
        Deal hot mỗi ngày
      </div>

      <div className="text-sm text-slate-600">
        Cập nhật deal giá tốt từ Shopee,
        Lazada, TikTok và nhiều nền tảng khác.
      </div>
    </div>
  </div>

  <div className="flex gap-3">
    <span className="text-3xl">🎟️</span>

    <div>
      <div className="font-bold text-slate-800">
        Mã giảm giá mới nhất
      </div>

      <div className="text-sm text-slate-600">
        Mã giảm giá độc quyền, giúp bạn
        tiết kiệm chi phí mua sắm.
      </div>
    </div>
  </div>

  <div className="flex gap-3">
    <span className="text-3xl">💰</span>

    <div>
      <div className="font-bold text-slate-800">
        Chia sẻ kinh nghiệm Affiliate
      </div>

      <div className="text-sm text-slate-600">
        Kinh nghiệm kiếm tiền, tips tăng
        thu nhập và nhiều cơ hội hợp tác.
      </div>
    </div>
  </div>

</div>

        <button
          type="button"
          onClick={handleJoinZalo}
          className="w-full mt-5 bg-[#177D96] text-white py-3 rounded-xl font-bold"
        >
          Tham gia nhóm Zalo
        </button>

        <button
          type="button"
          onClick={handleContinueToResult}
          className="w-full mt-3 border border-[#177D96] text-[#177D96] py-2 rounded-xl"
        >
          Xem kết quả ngay
        </button>

      </div>

    </div>

  </div>
)}

        </div>
        </div>
    );
  }