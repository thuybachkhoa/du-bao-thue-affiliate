type Props = {
  result: any;
  formatMoney: (value?: number) => string;
  showDeductionDetail: boolean;
  setShowDeductionDetail: (value: boolean) => void;

  affiliateTaxMode: string;

  businessIncome: number;
  affiliateIncome: number;
  personalIncome: number;

  businessTaxRate: string;
};

export default function BusinessResult({
  result,
  formatMoney,
  showDeductionDetail,
  setShowDeductionDetail,
  affiliateTaxMode,
  businessIncome,
  affiliateIncome,
  personalIncome,
  businessTaxRate,
}: Props) {
  return (
    <div className="space-y-3 text-base">

      {affiliateTaxMode === "personal" ? (
        <>
          <div className="bg-white rounded-lg px-4 py-3">

            <div className="flex justify-between">
              <span className="font-medium">
                💰 Doanh thu hộ kinh doanh (cả năm)
              </span>

              <span className="font-semibold">
                {formatMoney(businessIncome)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 italic mt-2 pl-5">
              <span>Thuế suất</span>

              <span>{businessTaxRate}</span>
            </div>

          </div>

          <div className="bg-white rounded-lg px-4 py-3">

            <div className="flex justify-between">
              <span className="font-medium">
                👤 Thu nhập cá nhân (gồm Affiliate)
              </span>

              <span className="font-semibold">
                {formatMoney(personalIncome)}
              </span>
            </div>

          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-lg px-4 py-3">

            <div className="flex justify-between">
              <span className="font-medium">
                💰 Doanh thu hộ kinh doanh (cả năm)
              </span>

              <span className="font-semibold">
                {formatMoney(
                  businessIncome + affiliateIncome
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 italic mt-2 pl-5">
              <span>
                Hoạt động kinh doanh chính ({businessTaxRate})
              </span>

              <span>
                {formatMoney(businessIncome)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 italic mt-1 pl-5">
              <span>
                Affiliate ({businessTaxRate})
              </span>

              <span>
                {formatMoney(affiliateIncome)}
              </span>
            </div>

          </div>

          <div className="bg-white rounded-lg px-4 py-3">

            <div className="flex justify-between">
              <span className="font-medium">
                👤 Thu nhập cá nhân (nếu có)
              </span>

              <span className="font-semibold">
                {formatMoney(personalIncome)}
              </span>
            </div>

          </div>
        </>
      )}

      <div className="bg-white rounded-lg px-4 py-3">

        <button
          type="button"
          onClick={() =>
            setShowDeductionDetail(
              !showDeductionDetail
            )
          }
          className="w-full flex justify-between"
        >
          <span className="font-medium">
            🟢 Tổng giảm trừ
          </span>

          <div className="flex gap-2">
            <span>
              {formatMoney(result.deduction)}
            </span>

            <span>
              {showDeductionDetail ? "▲" : "▼"}
            </span>
          </div>
        </button>

        {showDeductionDetail && (
          <div className="mt-2 border-t pt-2">

            <div className="flex justify-between text-sm text-gray-500 italic pl-5">
              <span>
                1️⃣ Bảo hiểm xã hội
              </span>

              <span>
                {formatMoney(
                  result.insuranceDeduction
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 italic mt-1 pl-5">
              <span>
                2️⃣ Giảm trừ gia cảnh
              </span>

              <span>
                {formatMoney(
                  result.personalDeduction
                )}
              </span>
            </div>

          </div>
        )}

      </div>

      <hr />

      <div className="bg-orange-50 rounded-lg px-4 py-3 flex justify-between">

        <span className="font-bold text-orange-700">
          📊 Thu nhập tính thuế
        </span>

        <span className="font-bold text-orange-700">
          {formatMoney(result.taxableIncome)}
        </span>

      </div>

      <div className="bg-[#208AA2]/5 border border-teal-200 rounded-lg px-4 py-3 flex justify-between">

        <span className="font-bold text-[#177D96]">
          🏛️ Tổng thuế phải nộp
        </span>

        <span className="font-bold text-[#177D96]">
          {formatMoney(result.taxPayable)}
        </span>

      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 flex justify-between">

        <span className="font-bold text-purple-700">
          ✅ Tổng thuế đã khấu trừ
        </span>

        <span className="font-bold text-purple-700">
          {formatMoney(result.taxPaid)}
        </span>

      </div>

    </div>
  );
}