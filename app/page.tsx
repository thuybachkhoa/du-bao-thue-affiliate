  "use client";

  import { useState } from "react";
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

    const [knowSalaryTax, setKnowSalaryTax] = useState("no");
    const [salaryTax, setSalaryTax] = useState("");

    const [result, setResult] = useState({
      totalIncome: 0,
      deduction: 0,
      taxableIncome: 0,
      taxPayable: 0,
      taxPaid: 0,
      refundOrPayMore: 0,
    });

    const formatMoney = (value: number) => {
      return value.toLocaleString("vi-VN") + " VNĐ";
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

      const affiliateIncome =
    parseNumber(shopeeIncome) +
    parseNumber(tiktokIncome) +
    parseNumber(lazadaIncome) +
    parseNumber(otherIncome);

      const totalIncome = salaryIncome + affiliateIncome;

      const deduction =
        186000000 +
        Number(dependents) * 74400000;

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

    setKnowSalaryTax("no");
    setSalaryTax("");

    setResult({
      totalIncome: 0,
      deduction: 0,
      taxableIncome: 0,
      taxPayable: 0,
      taxPaid: 0,
      refundOrPayMore: 0,
    });
  };
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-5xl font-bold text-center text-[#177D96]">
            DỰ TÍNH THUẾ 2026
          </h1>

          <p className="text-center text-gray-600 text-base mt-1">
            Dự báo quyết toán thuế TNCN năm 2026
          </p>

  <p className="text-center text-green-600 text-base mt-1">
    Áp dụng biểu thuế TNCN 5 bậc năm 2026
  </p>

          <div className="flex items-center gap-2 mt-4 mb-3">
    <span className="text-xl">👔</span>

    <h2 className="font-bold text-2xl text-amber-700">
      THÔNG TIN THU NHẬP
    </h2>
  </div>

  <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

    <div className="flex justify-between items-center mb-4">

  <div>
  <h2 className="font-bold text-xl">
    1️⃣ THU NHẬP TỪ LƯƠNG
  </h2>

  <p className="text-ml text-gray-500 italic mt-1">
        Lũy kế từ đầu năm
  </p>
</div>

  <div className="relative">

  <input
    type="text"
    value={salary}
    onChange={(e) =>
      setSalary(
        formatInputNumber(e.target.value)
      )
    }
    placeholder="Số trên HĐLĐ"
    className="border border-amber-200 rounded-xl px-3 py-3 h-14 w-56 pr-14 text-center font-bold text-ml text-amber-700 bg-amber-50 placeholder:italic placeholder:font-normal placeholder:text-amber-400"
  />

  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 font-bold text-lg">
    VNĐ
  </span>

</div>

</div>
  <div className="grid grid-cols-2 gap-8">

  <div>
    <label className="font-semibold text-base block mb-2">
      👫 Người phụ thuộc
    </label>

    <select
      value={dependents}
      onChange={(e) => setDependents(e.target.value)}
      className="w-32 border rounded-lg px-3 py-2 bg-white"
    >
      {[...Array(11)].map((_, i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  </div>

  <div className="flex flex-col items-center">
    <label className="font-semibold text-base block mb-2">
      💰 Thuế lương đã khấu trừ
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
        placeholder="Số tiền đã nộp"
        className="w-48 border rounded-lg px-3 py-2 text-right bg-white"
      />
    )}
  </div>

</div>
  </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

  <div className="flex justify-between items-center mb-4">

    <div>
  <h2 className="font-bold text-xl">
    2️⃣ THU NHẬP AFFILIATE TRÊN DASHBOARD
  </h2>

  <p className="text-ml text-gray-500 italic mt-1">
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

  <div className="grid grid-cols-4 gap-4">

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
      width={24}
      height={24}
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

  <div className="flex justify-between items-center mb-4">

    <div>
  <h2 className="font-bold text-xl">
    3️⃣ THUẾ AFFILIATE ĐÃ KHẤU TRỪ
  </h2>

  <p className="text-ml text-gray-500 italic mt-1">
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

  <div className="grid grid-cols-4 gap-4">

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
          width={24}
          height={24}
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

          <div className="mt-4 bg-slate-50 rounded-xl p-4">

            <div className="text-center mb-4">
    <h2 className="font-bold text-2xl text-amber-700">
      KẾT QUẢ DỰ TÍNH QUYẾT TOÁN THUẾ
    </h2>

    <p className="text-gray-500 text-base mt-1">
      Theo quy định thuế TNCN năm 2026
    </p>
  </div>

  {result.refundOrPayMore >= 0 ? (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5 text-center">
      <div className="text-green-600 text-xl font-semibold uppercase">
        Dự kiến được hoàn thuế
      </div>

      <div className="text-5xl font-bold text-green-600 mt-2">
        {formatMoney(result.refundOrPayMore)}
      </div>
    </div>
  ) : (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-2xl p-8 shadow-md mb-5 text-center">
      <div className="text-red-600 text-xl font-semibold uppercase">
        Dự kiến phải nộp thêm
      </div>

      <div className="text-5xl font-bold text-red-600 mt-2">
        {formatMoney(Math.abs(result.refundOrPayMore))}
      </div>
    </div>
  )}
            <div className="space-y-3 text-base">

              <div className="flex justify-between">
                <span>Tổng thu nhập</span>
                <span>
                  {formatMoney(result.totalIncome)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tổng giảm trừ</span>
                <span>
                  {formatMoney(result.deduction)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Thu nhập tính thuế</span>
                <span>
                  {formatMoney(result.taxableIncome)}
                </span>
              </div>

              <div className="flex justify-between text-red-600 font-bold">
                <span>Tổng thuế phải nộp</span>
                <span>
                  {formatMoney(result.taxPayable)}
                </span>
              </div>

              <div className="flex justify-between text-[#177D96] font-bold">
                <span>Tổng thuế đã khấu trừ</span>
                <span>
                  {formatMoney(result.taxPaid)}
                </span>
              </div>

                  </div>

            <div className="mt-5 text-sm text-gray-500 border-t pt-3">

              <p>
                • Giảm trừ bản thân:
                186.000.000 VNĐ/năm
              </p>

              <p>
                • Giảm trừ người phụ thuộc:
                74.400.000 VNĐ/năm/người
              </p>

              <p>
                • Kết quả chỉ mang tính tham khảo.
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