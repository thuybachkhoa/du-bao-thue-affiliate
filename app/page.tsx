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
const [insuranceMode, setInsuranceMode] =
  useState("");
const [showDeductionDetail, setShowDeductionDetail] = useState(false);
const [insuranceAmount, setInsuranceAmount] =
  useState("");
    const [knowSalaryTax, setKnowSalaryTax] = useState("");
    const [salaryTax, setSalaryTax] = useState("");
const [showZaloPopup, setShowZaloPopup] =
  useState(false);
const [showZaloBanner, setShowZaloBanner] =
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

    const handleCalculate = () => {
      const salaryIncome = parseNumber(salary);
const insuranceDeduction =
  insuranceMode === "manual"
    ? Math.min(parseNumber(insuranceAmount), 561600000) * 0.105
    : Math.min(salaryIncome, 561600000) * 0.105;
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
        (knowSalaryTax === "yes"
          ? parseNumber(salaryTax)
          : 0);

      const refundOrPayMore = Math.round(
  taxPaid - taxPayable
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
setInsuranceMode("");
setInsuranceAmount("");
    setKnowSalaryTax("");
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
    const dataUrl = await toPng(
      resultRef.current,
      {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      }
    );

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

   const isMobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
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

  <div className="flex items-center gap-3">
    <span className="text-base font-semibold text-slate-800">
      Đối tượng quyết toán
    </span>

    <select
      className="rounded-xl border border-[#177D96] bg-white px-4 py-2 text-[#C26A1B] font-semibold"
    >
      <option>Người lao động</option>
      <option>Giám đốc không hưởng lương</option>
    </select>
  </div>
</div>
    <p className="text-center text-green-600 text-base font-semibold mt-1">
  {taxYear === "2026"
    ? "Áp dụng biểu thuế TNCN 5 bậc năm 2026"
    : "Áp dụng biểu thuế TNCN 7 bậc năm 2025"}
</p>
<div className="lg:grid lg:grid-cols-12 lg:gap-6">
  <div className="lg:col-span-7 lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto lg:pr-2">
          <div className="flex items-center gap-2 mt-4 mb-3">
    <span className="text-xl">📊</span>

    <h2 className="font-bold text-2xl text-[#C26A1B]">
      THÔNG TIN THU NHẬP
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

    <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center mb-4">

  <div>
  <h2 className="font-bold text-xl">
    1️⃣ THU NHẬP TỪ LƯƠNG (THỰC NHẬN)
  </h2>

  <p className="text-ml text-gray-500 italic pl-8 mt-1">
        Lũy kế từ đầu năm bao gồm thưởng, phụ cấp ...
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
    placeholder="Nhập số lương"
    className="border border-amber-200 rounded-xl px-3 py-3 h-14 w-full md:w-52 pr-14 text-center font-bold text-lg text-amber-700 bg-amber-50 placeholder:italic placeholder:font-normal placeholder:text-amber-700"
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
    Gồm con, cha mẹ, vợ chồng... đã đăng ký với BHXH
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
<div className="flex flex-col">

  <div className="flex items-center gap-2 mb-2">
    <span>🛡️</span>
    <span className="font-semibold text-base">
      Bảo hiểm bắt buộc
    </span>
  </div>

  <p className="text-sm text-[#177D96] italic mb-3">
    Bạn biết lương đóng BHXH?
  </p>

  <div className="grid grid-cols-2 gap-2 mb-3">

    <button
      type="button"
      onClick={() => setInsuranceMode("manual")}
      className={`rounded-lg border py-1 px-3 text-sm font-medium transition-all ${
        insuranceMode === "manual"
          ? "border-[#177D96] bg-[#177D96]/10 text-[#177D96]"
          : "border-[#177D96] bg-white"
      }`}
    >
      ✓ Có
    </button>

    <button
      type="button"
      onClick={() => setInsuranceMode("auto")}
      className={`rounded-lg border py-1 px-3 text-sm font-medium transition-all ${
        insuranceMode === "auto"
          ? "border-[#177D96] bg-[#177D96]/10 text-[#EF4444]"
          : "border-[#177D96] bg-white"
      }`}
    >
      ✕ Không
    </button>

  </div>

  {insuranceMode === "manual" && (
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
          placeholder="Tổng lương BHXH năm nay"
          className="w-full border rounded-xl text-center text-base font-medium px-3 py-2 bg-white placeholder:text-sm placeholder:italic placeholder:font-normal placeholder:text-slate-400"
        />
      </div>
      </>
  )}
{insuranceMode === "auto" && (
  <div className="mt-1 text-sm text-green-600 italic text-center">
    ⚠️ Không tham gia BHXH: 
    <br />
    chọn ✓ Có và nhập 0.
    <br />
<div className="mt-1 text-sm text-amber-700 italic text-center">
Không biết lương đóng BHXH: 
<br />
chọn ✕ Không để hệ thống ước tính
  </div>
  </div>
)}
</div>

  <div className="flex flex-col">

  <div className="flex items-center gap-2 mb-2">
    <span>💰</span>
    <span className="font-semibold text-base">
      Thuế đã khấu trừ
    </span>
  </div>

  <p className="text-sm text-[#177D96] italic mb-3">
    Tại công ty từ đầu năm
  </p>

  <div className="grid grid-cols-2 gap-2 mb-3">

    <button
      type="button"
      onClick={() => setKnowSalaryTax("yes")}
      className={`rounded-lg border py-1 px-3 text-sm font-medium transition-all ${
        knowSalaryTax === "yes"
          ? "border-[#177D96] bg-[#177D96]/10 text-[#177D96]"
          : "border-[#177D96] bg-white"
      }`}
    >
      ✓ Có
    </button>

    <button
      type="button"
      onClick={() => setKnowSalaryTax("no")}
      className={`rounded-lg border py-1 px-3 text-sm font-medium transition-all ${
        knowSalaryTax === "no"
          ? "border-[#177D96] bg-[#177D96]/10 text-[#EF4444]"
          : "border-[#177D96] bg-white"
      }`}
    >
      ✕ Không
    </button>

  </div>

  {knowSalaryTax === "yes" && (
    <input
      type="text"
      value={salaryTax}
      onChange={(e) =>
        setSalaryTax(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Nhập số thuế chính xác"
      className="w-full border rounded-xl text-center text-base font-medium px-3 py-2 bg-white placeholder:text-sm placeholder:italic placeholder:font-normal placeholder:text-slate-400"
    />
  )}
 </div>
</div>
{insuranceMode === "" && knowSalaryTax === "" && (
  <div className="grid md:grid-cols-3 gap-8 -mt-2">
    <div></div>

    <div className="md:col-span-2">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1">
        <p className="text-sm text-amber-700 italic text-center">
          ⚠️ Lựa chọn này ảnh hưởng trực tiếp đến kết quả thuế
        </p>
      </div>
    </div>
  </div>
)}
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
  className="w-full bg-[#177D96] hover:bg-[#146F85] text-white rounded-xl px-5 py-2 shadow-md transition-all"
>
  <div className="relative flex items-center justify-center">

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

  </div>
</button>

</div>
<div className="lg:col-span-5 lg:sticky lg:top-4 lg:self-start">
<div
  ref={resultRef}
  className="mt-4 lg:mt-0 bg-slate-50 rounded-xl p-4"
>
  {showZaloBanner && (
  <div
    id="web-banner"
    className="border border-pink-100 rounded-xl p-4 mb-5 bg-[#FFF9FB]"
  >
    <div className="flex items-center gap-3">

  <img
  src="/community-icon.png"
  alt="Cộng đồng Zalo"
  className="w-26 h-26 rounded-full shrink-0"
/>

      <div className="flex-1">

        <div className="font-bold text-lg text-[#177D96]">
          💖 Duy trì công cụ miễn phí
        </div>

        <div className="text-sm text-slate-600 mt-1">
          Nhóm Zalo chia sẻ deal, mã giảm giá
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
          className="mt-3 bg-[#177D96] text-white px-4 py-2 font-bold rounded-lg text-sm"
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
  className="hidden bg-white border border-[#177D96]/20 rounded-xl p-3 mb-4"
>
  <div className="flex items-center gap-3">

    <Image
      src="/icon.png"
      alt="App Icon"
      width={48}
      height={48}
      unoptimized
    />

    <div>

      <div className="font-bold text-[#177D96]">
        APP DỰ TÍNH THUẾ TNCN 2026
      </div>

      <div className="text-sm text-slate-500">
        👤 Thủy Bách Khoa • 📱 0932-171-685
      </div>

      <div className="text-xs text-slate-400">
        📅 {new Date()
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
    ? "🛡️ Kết quả quyết toán chỉ mang tính tham khảo."
    : "🛡️ Kết quả dự tính chỉ mang tính tham khảo, không phải căn cứ quyết toán thuế."}
</p>
  </div>

  {result.refundOrPayMore >= 0 ? (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">

    <img
  src="/wallet-green.png"
  alt="Hoàn thuế"
  width={80}
  height={80}
  className="shrink-0"
/>

    <div>
      <div className="text-green-600 text-base font-semibold uppercase">
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
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
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

  <div className="flex justify-between items-start gap-3 bg-white rounded-lg px-4 py-3 mb-2 shadow-sm">
  <span className="font-medium flex-1">
    💰 Tổng thu nhập
  </span>

  <span className="font-semibold text-right shrink-0">
    {formatMoney(result.totalIncome)}
  </span>
</div>

 <div className="bg-white rounded-lg px-4 py-3 mb-2 shadow-sm">

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

<div className="flex justify-between items-start gap-3 bg-orange-50 rounded-lg px-4 py-3 mb-2 shadow-sm">              
  <span className="font-bold text-orange-700 flex-1">
    📊 Thu nhập tính thuế
  </span>

  <span className="font-bold text-orange-700 text-right shrink-0">
    {formatMoney(result.taxableIncome)}
  </span>
</div>

  <div className="flex justify-between items-start gap-3 bg-[#208AA2]/5 rounded-lg px-4 py-3 mb-2 border border-teal-200 shadow-sm">
  <span className="font-bold text-[#177D96] flex-1">
    🏛️ Tổng thuế phải nộp
  </span>

  <span className="font-bold text-[#177D96] text-right shrink-0">
    {formatMoney(result.taxPayable)}
  </span>
</div>

  <div className="flex justify-between items-start gap-3 bg-purple-50 rounded-lg px-4 py-3 mb-2 border border-purple-200 shadow-sm">
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
    className="hidden md:block border-2 border-red-400 rounded-2xl py-2 px-4 bg-white hover:bg-red-50 transition-all"
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
    className="border-2 border-green-500 rounded-2xl py-2 px-4 bg-white hover:bg-green-50 transition-all"
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