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

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Dự Báo Thuế Affiliate 2026
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-6">
          Dự báo quyết toán thuế TNCN năm 2026
        </p>

<p className="text-center text-green-600 text-sm mb-6">
  Áp dụng biểu thuế TNCN 5 bậc năm 2026
</p>

        <div className="mb-5">
          <label className="block font-medium mb-2">
            Thu nhập lương lũy kế từ đầu năm (HĐLĐ)
          </label>

          <input
  type="text"
  value={salary}
  onChange={(e) =>
    setSalary(
      formatInputNumber(e.target.value)
    )
  }
            placeholder="Ví dụ: 90000000"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <h2 className="font-bold text-lg mb-3">
          Thu nhập Affiliate lũy kế từ đầu năm
        </h2>

        <div className="space-y-4 mb-6">

  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/shopee.png"
    alt="Shopee"
    width={28}
    height={28}
  />

  <span className="font-semibold text-orange-600">
    Shopee
  </span>
</div>

    <input
      type="text"
      value={shopeeIncome}
      onChange={(e) =>
        setShopeeIncome(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Doanh thu Shopee"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/tiktok.png"
    alt="TikTok"
    width={24}
    height={24}
  />

  <span className="font-semibold text-slate-700">
    TikTok
  </span>
</div>

    <input
      type="text"
      value={tiktokIncome}
      onChange={(e) =>
        setTiktokIncome(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Doanh thu TikTok"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/lazada.png"
    alt="Lazada"
    width={32}
    height={32}
  />

  <span className="font-semibold text-pink-600">
    Lazada
  </span>
</div>

    <input
      type="text"
      value={lazadaIncome}
      onChange={(e) =>
        setLazadaIncome(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Doanh thu Lazada"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/other.png"
    alt="Khác"
    width={28}
    height={28}
  />

  <span className="font-semibold text-blue-600">
    Khác
  </span>
</div>

    <input
      type="text"
      value={otherIncome}
      onChange={(e) =>
        setOtherIncome(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Nguồn thu khác"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-300 rounded-2xl p-8 shadow-md">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-green-700">
        Tổng doanh thu Affiliate
      </span>

      <span className="text-xl font-bold text-green-700">
        {formatMoney(
          Number(shopeeIncome.replace(/\./g, "")) +
          Number(tiktokIncome.replace(/\./g, "")) +
          Number(lazadaIncome.replace(/\./g, "")) +
          Number(otherIncome.replace(/\./g, ""))
        )}
      </span>
    </div>
  </div>

</div>
        <div className="space-y-4 mb-6">

  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/shopee.png"
    alt="Shopee"
    width={28}
    height={28}
  />

  <span className="font-semibold text-orange-600">
    Thuế Shopee
  </span>
</div>

    <input
      type="text"
      value={shopeeTax}
      onChange={(e) =>
        setShopeeTax(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Thuế Shopee đã khấu trừ"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/tiktok.png"
    alt="TikTok"
    width={24}
    height={24}
  />

  <span className="font-semibold text-slate-700">
    Thuế TikTok
  </span>
</div>

    <input
      type="text"
      value={tiktokTax}
      onChange={(e) =>
        setTiktokTax(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Thuế TikTok đã khấu trừ"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/lazada.png"
    alt="Lazada"
    width={32}
    height={32}
  />

  <span className="font-semibold text-pink-600">
    Thuế Lazada
  </span>
</div>

    <input
      type="text"
      value={lazadaTax}
      onChange={(e) =>
        setLazadaTax(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Thuế Lazada đã khấu trừ"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
  <Image
    src="/logos/other.png"
    alt="Khác"
    width={28}
    height={28}
  />

  <span className="font-semibold text-blue-600">
    Thuế khác
  </span>
</div>

    <input
      type="text"
      value={otherTax}
      onChange={(e) =>
        setOtherTax(
          formatInputNumber(e.target.value)
        )
      }
      placeholder="Thuế khác đã khấu trừ"
      className="w-full border rounded-lg p-3 bg-white"
    />
  </div>

  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-purple-700">
        Tổng thuế đã khấu trừ
      </span>

      <span className="text-xl font-bold text-purple-700">
        {formatMoney(
          Number(shopeeTax.replace(/\./g, "")) +
          Number(tiktokTax.replace(/\./g, "")) +
          Number(lazadaTax.replace(/\./g, "")) +
          Number(otherTax.replace(/\./g, ""))
        )}
      </span>
    </div>
  </div>

</div>

        <div className="mb-6">
          <label className="block font-medium mb-2">
            Số người phụ thuộc
          </label>

          <select
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-3">
            Có biết số thuế TNCN đã khấu trừ từ lương?
          </label>

          <div className="flex gap-6">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                checked={knowSalaryTax === "yes"}
                onChange={(e) =>
                  setKnowSalaryTax(e.target.value)
                }
              />
              Có
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                checked={knowSalaryTax === "no"}
                onChange={(e) =>
                  setKnowSalaryTax(e.target.value)
                }
              />
              Không
            </label>

          </div>
        </div>

        {knowSalaryTax === "yes" && (
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Thuế TNCN đã khấu trừ từ lương
            </label>

            <input
              type="text"
              value={salaryTax}
              onChange={(e) =>
  setSalaryTax(
    formatInputNumber(e.target.value)
  )
}
              placeholder="Ví dụ: 3500000"
              className="w-full border rounded-lg p-3"
            />
          </div>
        )}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
        >
          Tính thử
        </button>

        <div className="mt-6 bg-slate-50 rounded-xl p-4">

          <div className="text-center mb-4">
  <h2 className="font-bold text-2xl">
    Kết quả quyết toán thuế
  </h2>

  <p className="text-gray-500 text-sm mt-1">
    Theo quy định thuế TNCN năm 2026
  </p>
</div>

{result.refundOrPayMore >= 0 ? (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5 text-center">
    <div className="text-green-600 text-sm font-semibold uppercase">
      Dự kiến được hoàn thuế
    </div>

    <div className="text-6xl font-bold text-green-600 mt-2">
      {formatMoney(result.refundOrPayMore)}
    </div>
  </div>
) : (
  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-2xl p-8 shadow-md mb-5 text-center">
    <div className="text-red-600 text-sm font-semibold uppercase">
      Dự kiến phải nộp thêm
    </div>

    <div className="text-6xl font-bold text-red-600 mt-2">
      {formatMoney(Math.abs(result.refundOrPayMore))}
    </div>
  </div>
)}
          <div className="space-y-3 text-sm">

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
              <span>Thuế phải nộp</span>
              <span>
                {formatMoney(result.taxPayable)}
              </span>
            </div>

            <div className="flex justify-between text-blue-600 font-bold">
              <span>Thuế đã khấu trừ</span>
              <span>
                {formatMoney(result.taxPaid)}
              </span>
            </div>

                </div>

          <div className="mt-5 text-xs text-gray-500 border-t pt-3">

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