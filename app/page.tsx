  "use client";

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
const [insuranceMode, setInsuranceMode] =
  useState("auto");

const [insuranceAmount, setInsuranceAmount] =
  useState("");
    const [knowSalaryTax, setKnowSalaryTax] = useState("no");
    const [salaryTax, setSalaryTax] = useState("");

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
    const calculateTax = (income: number) => {
      let tax = 0;

      if (income <= 0) return 0;

    const levels = [
    { limit: 120000000, rate: 0.05 },
    { limit: 360000000, rate: 0.10 },
    { limit: 720000000, rate: 0.20 },
    { limit: 1200000000, rate: 0.30 },
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
    ? parseNumber(insuranceAmount)
    : Math.min(salaryIncome, 561600000) * 0.105;
      const affiliateIncome =
    parseNumber(shopeeIncome) +
    parseNumber(tiktokIncome) +
    parseNumber(lazadaIncome) +
    parseNumber(otherIncome);

      const totalIncome = salaryIncome + affiliateIncome;

      const personalDeduction =
  186000000 +
  Number(dependents) * 74400000;

const deduction =
  personalDeduction +
  insuranceDeduction;

      const taxableIncome = Math.max(
        0,
        totalIncome - deduction
      );

      const taxPayable = calculateTax(taxableIncome);

      const taxPaid =
    parseNumber(shopeeTax) +
    parseNumber(tiktokTax) +
    parseNumber(lazadaTax) +
    parseNumber(otherTax) +
        (knowSalaryTax === "yes"
          ? parseNumber(salaryTax)
          : 0);

      const refundOrPayMore =
        taxPaid - taxPayable;

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
setInsuranceMode("auto");
setInsuranceAmount("");
    setKnowSalaryTax("no");
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
  };
  const handleShare = async () => {
  const shareText = `
📊 KẾT QUẢ DỰ TÍNH THUẾ TNCN 2026

💰 Tổng thu nhập: ${result.totalIncome.toLocaleString("vi-VN")} VNĐ
📈 Thu nhập tính thuế: ${result.taxableIncome.toLocaleString("vi-VN")} VNĐ
🏛️ Tổng thuế phải nộp: ${result.taxPayable.toLocaleString("vi-VN")} VNĐ
✅ Thuế đã khấu trừ: ${result.taxPaid.toLocaleString("vi-VN")} VNĐ

${
  result.refundOrPayMore >= 0
    ? `🎉 Dự kiến được hoàn: ${result.refundOrPayMore.toLocaleString("vi-VN")} VNĐ`
    : `⚠️ Dự kiến phải nộp thêm: ${Math.abs(
        result.refundOrPayMore
      ).toLocaleString("vi-VN")} VNĐ`
}

🔗 https://du-tinh-tncn-2026.vercel.app

Thủy Bách Khoa | Zalo 0932 171 685
`;

  try {
  if (navigator.share) {
    await navigator.share({
      title: "DỰ TÍNH THUẾ TNCN 2026",
      text: shareText,
    });

    return;
  }

  await navigator.clipboard.writeText(shareText);

  alert(
    "Đã sao chép kết quả vào clipboard."
  );
} catch (error) {
  console.error(error);
}
};
  const handleExportPDF = async () => {
  if (!resultRef.current) return;

  try {
    await new Promise(resolve =>
  setTimeout(resolve, 500)
);
    const dataUrl = await toPng(
  resultRef.current,
  {
    pixelRatio: 4,
    backgroundColor: "#ffffff",
  }
);

   const pdf = new jsPDF();

const imgProps =
  pdf.getImageProperties(dataUrl);

const pdfWidth =
  pdf.internal.pageSize.getWidth();

const pdfHeight =
  (imgProps.height * pdfWidth) /
  imgProps.width;

pdf.addImage(
  dataUrl,
  "PNG",
  0,
  10,
  pdfWidth,
  pdfHeight
);

const today = new Date()
  .toLocaleDateString("vi-VN")
  .replace(/\//g, "-");

pdf.save(`thue-tncn-${today}.pdf`);
  } catch (error) {
    console.error(error);
    alert(String(error));
  }
};
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-5xl font-bold text-center text-[#177D96]">
            DỰ TÍNH THUẾ 2026
          </h1>

            <p className="text-center text-green-600 text-base mt-1">
    Áp dụng biểu thuế TNCN 5 bậc năm 2026
  </p>

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
    1️⃣ THU NHẬP TỪ LƯƠNG (THEO HĐLĐ)
  </h2>

  <p className="text-ml text-gray-500 italic pl-8 mt-1">
        Lũy kế từ đầu năm
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
    className="border border-amber-200 rounded-xl px-3 py-3 h-14 w-full md:w-52 pr-14 text-center font-bold text-lg text-amber-700 bg-amber-50 placeholder:italic placeholder:font-normal placeholder:text-amber-400"
  />

  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 font-bold text-lg">
    VNĐ
  </span>

</div>

</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

  {/* Người phụ thuộc */}
  <div>
  <label className="font-semibold text-base block mb-2 text-center">
    👫 Người phụ thuộc
  </label>

  <div className="flex justify-center">
    <select
      value={dependents}
      onChange={(e) => setDependents(e.target.value)}
      className="w-24 border text-center rounded-lg px-3 py-2 bg-white"
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
  <div>
    <label className="font-semibold text-base block mb-2">
      🛡️ Bảo hiểm bắt buộc
    </label>

    <div className="flex items-center gap-3 mb-3">
      <label className="flex items-center gap-1 text-ml">
        <input
          type="radio"
          value="auto"
          checked={insuranceMode === "auto"}
          onChange={(e) =>
            setInsuranceMode(e.target.value)
          }
        />
        Theo HĐLĐ
      </label>

      <label className="flex items-center gap-1 text-ml">
        <input
          type="radio"
          value="manual"
          checked={insuranceMode === "manual"}
          onChange={(e) =>
            setInsuranceMode(e.target.value)
          }
        />
        Nhập tay
      </label>
    </div>

    {insuranceMode === "manual" && (
      <input
        type="text"
        value={insuranceAmount}
        onChange={(e) =>
          setInsuranceAmount(
            formatInputNumber(e.target.value)
          )
        }
        placeholder="Nhập số tiền"
        className="w-40 border rounded-lg px-3 py-2 text-right"
      />
    )}

  </div>

  <div className="flex flex-col items-center">
    <label className="font-semibold text-base block mb-2">
      💰 Thuế đã khấu trừ
    </label>

    <div className="flex items-center gap-6 mb-3">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          value="yes"
          checked={knowSalaryTax === "yes"}
          onChange={(e) => setKnowSalaryTax(e.target.value)}
        />
        Có
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          value="no"
          checked={knowSalaryTax === "no"}
          onChange={(e) => setKnowSalaryTax(e.target.value)}
        />
        Không
      </label>
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
        placeholder="Nhập số tiền"
        className="w-40 border rounded-lg px-3 py-2 text-right bg-white"
      />
    )}
  </div>

</div>
  </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

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

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

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
    className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
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
    className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
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
    className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
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
    className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
  />

</div>

  </div>

</div>

    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

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

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

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
        className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
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
        className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
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
        className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
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
        className="w-full border rounded-lg px-3 py-2 text-center placeholder:text-slate-400 placeholder:italic placeholder:text-sm"
      />

    </div>

  </div>

</div>

          <button
            onClick={handleCalculate}
            className="w-full bg-[#177D96] hover:bg-[#13697F] text-white font-bold py-4 text-xl rounded-xl"
          >
            📝  TÍNH TOÁN NGAY
          </button>
<button
  onClick={handleExportPDF}
  className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-xl rounded-xl"
>
  📄 XUẤT PDF
</button>
<button
  onClick={handleShare}
  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl rounded-xl"
>
  📱 CHIA SẺ KẾT QUẢ
</button>
          <div
  ref={resultRef}
  className="mt-4 bg-slate-50 rounded-xl p-4"
>
<div className="bg-white border border-orange-200 rounded-xl p-4 mb-5">
  <div className="flex flex-col md:flex-row items-center gap-4">

    <Image
      src="/icon.png"
      alt="App Icon"
      width={72}
      height={72}
      className="shrink-0"
    />

    <div className="border-t-2 md:border-t-0 md:border-l-2 border-orange-400 pt-4 md:pt-0 md:pl-4 w-full">
      <h2 className="font-bold text-xl md:text-2xl text-slate-800">
        APP DỰ TÍNH THUẾ TNCN 2026
      </h2>

      <p className="text-base text-slate-600 mt-1">
        📅 Ngày xuất: {new Date().toLocaleString("vi-VN")}
      </p>

      <p className="text-base text-slate-600">
        👤 Phát triển bởi Thủy Bách Khoa | Zalo 0932 171 685
      </p>
    </div>

  </div>
</div>
            <div className="text-left mb-4">
    <h2 className="font-bold text-2xl text-[#C26A1B]">
      📋  KẾT QUẢ DỰ TÍNH QUYẾT TOÁN THUẾ
    </h2>

    <p className="text-[#177D96] text-base italic mt-1">
      🛡️ Kết quả dự tính chỉ mang tính tham khảo, không phải căn cứ quyết toán thuế.
    </p>
  </div>

  {result.refundOrPayMore >= 0 ? (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">

    <Image
      src="/wallet-green.png"
      alt="Hoàn thuế"
      width={80}
      height={80}
      className="shrink-0"
    />

    <div>
      <div className="text-green-600 text-base font-semibold uppercase">
        DỰ KIẾN ĐƯỢC HOÀN THUẾ
      </div>

      <div className="text-2xl md:text-4xl font-bold text-green-600 break-all">
        {formatMoney(result.refundOrPayMore).replace(" VNĐ", "")}
      
     <span className="text-2xl font-semibold text-green-600 ml-2">
    VNĐ
  </span>
      </div>
      <div className="text-sm italic text-gray-500 mt-1">
    ({numberToVietnameseWords(result.refundOrPayMore)})
  </div>
    </div>
  </div>
</div>
  ) : (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">

    <Image
      src="/wallet-red.png"
      alt="Nộp thêm"
      width={80}
      height={80}
      className="shrink-0"
    />

    <div>
      <div className="text-red-600 text-base font-semibold uppercase">
        DỰ KIẾN PHẢI NỘP THÊM
      </div>

      <div className="text-2xl md:text-4xl font-bold text-red-600 break-all">
        {formatMoney(Math.abs(result.refundOrPayMore)).replace(" VNĐ", "")}
      <span className="text-xl font-semibold text-red-600 ml-2">
    VNĐ
  </span>
      </div>
      <div className="text-sm italic text-gray-500 mt-1">
    ({numberToVietnameseWords(
    Math.abs(result.refundOrPayMore)
  )})
  </div>
    </div>

  </div>
</div>
  )}
            <div className="space-y-3 text-base">

              <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 mb-2 shadow-sm">
  <span className="font-medium">
    💰 Tổng thu nhập
  </span>

  <span className="font-semibold">
    {formatMoney(result.totalIncome)}
  </span>
</div>

 <div className="bg-white rounded-lg px-4 py-3 mb-2 shadow-sm">

  <div className="flex justify-between items-center">
    <span className="font-medium text-green-700">
      🟢 Tổng giảm trừ
    </span>

    <span className="font-semibold text-green-700">
      {formatMoney(result.deduction)}
    </span>
  </div>

  <div className="mt-2 border-t border-slate-100 pt-2">

    <div className="flex justify-between text-sm text-gray-500 italic pl-10">
      <span>↳ Bảo hiểm bắt buộc</span>

      <span>
        {formatMoney(result.insuranceDeduction)}
      </span>
    </div>

    <div className="flex justify-between text-sm text-gray-500 italic mt-1 pl-10">
      <span>
        ↳ Giảm trừ bản thân & người phụ thuộc
      </span>

      <span>
        {formatMoney(result.personalDeduction)}
      </span>
    </div>

  </div>

</div>
<hr className="my-3 border-slate-300" />

              <div className="flex justify-between items-center bg-orange-50 rounded-lg px-4 py-3 mb-2 shadow-sm">
  <span className="font-medium text-orange-700">
    📊 Thu nhập tính thuế
  </span>

  <span className="font-bold text-orange-700">
    {formatMoney(result.taxableIncome)}
  </span>
</div>

              <div className="flex justify-between items-center bg-red-50 rounded-lg px-4 py-3 mb-2 border border-red-200 shadow-sm">
  <span className="font-medium text-red-600">
    🏛️ Tổng thuế phải nộp
  </span>

  <span className="font-bold text-red-600">
    {formatMoney(result.taxPayable)}
  </span>
</div>

              <div className="flex justify-between items-center bg-purple-50 rounded-lg px-4 py-3 mb-2 border border-purple-200 shadow-sm">
  <span className="font-medium text-purple-700">
    ✅ Tổng thuế đã khấu trừ
  </span>

  <span className="font-bold text-purple-700">
    {formatMoney(result.taxPaid)}
  </span>
</div>

                  </div>

            <div className="mt-5 text-sm text-gray-500 border-t pt-3">

              <p>
                • Giảm trừ bản thân:
                15.500.000 VNĐ/tháng = 186.000.000 VNĐ/năm.
              </p>

              <p>
                • Giảm trừ người phụ thuộc:
                6.200.000 VNĐ/tháng/người = 74.400.000 VNĐ/năm/người.
              </p>

              <p>
                • Giả định từ nay đến cuối năm 
                không phát sinh thêm thu nhập.
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }