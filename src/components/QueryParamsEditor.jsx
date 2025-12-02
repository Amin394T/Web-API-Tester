import React, { useState } from "react";

export default function QueryParamsEditor({ queryParams, setQueryParams }) {
  const [showParams, setShowParams] = useState(false);

  function addParam() {
    setQueryParams([...queryParams, { key: "", value: "" }]);
  }

  function removeParam(idx) {
    setQueryParams(queryParams.filter((_, i) => i !== idx));
  }

  function updateParam(idx, field, val) {
    const updated = [...queryParams];
    updated[idx] = { ...updated[idx], [field]: val };
    setQueryParams(updated);
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowParams(!showParams)}
        className="text-sm text-blue-600 hover:underline"
      >
        {showParams ? "▼ Hide Query Params" : "▶ Show Query Params"}
      </button>

      {showParams && (
        <div className="mt-3 border-t pt-3">
          <div className="space-y-2 mb-3">
            {queryParams.map((p, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Param key"
                  value={p.key}
                  onChange={(e) => updateParam(idx, "key", e.target.value)}
                  className="w-40 border rounded px-2 py-1 text-sm bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Param value"
                  value={p.value}
                  onChange={(e) => updateParam(idx, "value", e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm bg-slate-50"
                />
                <button
                  onClick={() => removeParam(idx)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addParam}
            className="text-sm bg-slate-200 px-3 py-1 rounded hover:bg-slate-300"
          >
            + Add Param
          </button>
        </div>
      )}
    </div>
  );
}
