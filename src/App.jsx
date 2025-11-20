import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    SK_ID_CURR: "",
    AMT_INCOME_TOTAL: "",
    AMT_CREDIT: "",
    AMT_ANNUITY: "",
    AMT_GOODS_PRICE: "",
    CNT_CHILDREN: "",
    CNT_FAM_MEMBERS: "",
    DAYS_BIRTH: "",
    DAYS_EMPLOYED: "",
    DAYS_REGISTRATION: "",
    DAYS_ID_PUBLISH: "",
    NAME_CONTRACT_TYPE: "Cash loans",
    CODE_GENDER: "M",
    NAME_INCOME_TYPE: "Working",
    NAME_EDUCATION_TYPE: "Secondary / secondary special",
    NAME_FAMILY_STATUS: "Married",
    NAME_HOUSING_TYPE: "House / apartment",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

 const backendUrl = "https://home-credit-backend.onrender.com/predict";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setLoading(true);

    const payload = {
      SK_ID_CURR: Number(form.SK_ID_CURR),
      AMT_INCOME_TOTAL: Number(form.AMT_INCOME_TOTAL),
      AMT_CREDIT: Number(form.AMT_CREDIT),
      AMT_ANNUITY: form.AMT_ANNUITY ? Number(form.AMT_ANNUITY) : null,
      AMT_GOODS_PRICE: form.AMT_GOODS_PRICE ? Number(form.AMT_GOODS_PRICE) : null,
      CNT_CHILDREN: Number(form.CNT_CHILDREN),
      CNT_FAM_MEMBERS: Number(form.CNT_FAM_MEMBERS),
      DAYS_BIRTH: Number(form.DAYS_BIRTH),
      DAYS_EMPLOYED: Number(form.DAYS_EMPLOYED),
      DAYS_REGISTRATION: Number(form.DAYS_REGISTRATION),
      DAYS_ID_PUBLISH: Number(form.DAYS_ID_PUBLISH),
      NAME_CONTRACT_TYPE: form.NAME_CONTRACT_TYPE,
      CODE_GENDER: form.CODE_GENDER,
      NAME_INCOME_TYPE: form.NAME_INCOME_TYPE,
      NAME_EDUCATION_TYPE: form.NAME_EDUCATION_TYPE,
      NAME_FAMILY_STATUS: form.NAME_FAMILY_STATUS,
      NAME_HOUSING_TYPE: form.NAME_HOUSING_TYPE,
    };

    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Home Credit Default Risk
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter applicant details below to calculate risk.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {Object.keys(form).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                {key.replace(/_/g, " ")}
              </label>

              {[
                "NAME_CONTRACT_TYPE",
                "CODE_GENDER",
                "NAME_INCOME_TYPE",
                "NAME_EDUCATION_TYPE",
                "NAME_FAMILY_STATUS",
                "NAME_HOUSING_TYPE",
              ].includes(key) ? (
                <select
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 shadow-sm"
                >
                  {[
                    ...new Set(
                      ["Cash loans", "Revolving loans", "M", "F", "Working", 
                       "Commercial associate", "Pensioner", "State servant",
                       "Secondary / secondary special", "Higher education",
                       "Incomplete higher", "Lower secondary",
                       "Married", "Single / not married", "Separated", "Widow",
                       "House / apartment", "Rented apartment", 
                       "Municipal apartment", "With parents"]
                      .filter((v) => v)
                    ),
                  ].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 shadow-sm"
                />
              )}
            </div>
          ))}

          <div className="col-span-full mt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              {loading ? "Scoring..." : "Predict Risk"}
            </button>
          </div>
        </form>

        {/* RESULTS */}
        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg shadow">
            {error}
          </div>
        )}

        {result && (
          <div
            className={`mt-6 p-6 rounded-xl shadow text-center ${
              result.decision === "REJECT"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Prediction Result</h2>
            <p className="text-lg">Probability: <strong>{(result.default_probability * 100).toFixed(1)}%</strong></p>
            <p className="text-lg">Decision: <strong>{result.decision}</strong></p>
            <p className="text-sm text-gray-600">Threshold: {result.threshold}</p>
          </div>
        )}
      </div>
    </div>
  );
}