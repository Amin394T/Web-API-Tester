import React, { useState } from "react";

export default function HeadersEditor({ headers, setHeaders }) {
  const [showHeaders, setShowHeaders] = useState(false);

  function addHeader() {
    setHeaders([...headers, { key: "", value: "" }]);
  }

  function removeHeader(idx) {
    setHeaders(headers.filter((_, i) => i !== idx));
  }

  function updateHeader(idx, field, val) {
    const updated = [...headers];
    updated[idx] = { ...updated[idx], [field]: val };
    setHeaders(updated);
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowHeaders(!showHeaders)}
        className="text-sm text-blue-600 hover:underline"
      >
        {showHeaders ? "▼ Hide Headers" : "▶ Show Headers"}
      </button>

      {showHeaders && (
        <div className="mt-3 border-t pt-3">
          <div className="space-y-2 mb-3">
            {headers.map((h, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Header key"
                  value={h.key}
                  onChange={(e) => updateHeader(idx, "key", e.target.value)}
                  className="w-40 border rounded px-2 py-1 text-sm bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Header value"
                  value={h.value}
                  onChange={(e) => updateHeader(idx, "value", e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm bg-slate-50"
                />
                <button
                  onClick={() => removeHeader(idx)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addHeader}
            className="text-sm bg-slate-200 px-3 py-1 rounded hover:bg-slate-300"
          >
            + Add Header
          </button>
        </div>
      )}
    </div>
  );
}
