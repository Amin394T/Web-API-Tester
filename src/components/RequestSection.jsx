import React from "react";

export default function RequestSection({
  method,
  setMethod,
  url,
  setUrl,
  onSend,
  onClear,
  loading,
}) {
  return (
    <div className="flex gap-3">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="w-28 border rounded px-2 py-1 bg-slate-50"
      >
        {[
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
          "HEAD",
          "OPTIONS",
        ].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="https://api.example.com/resource"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 border rounded px-3 py-2"
      />

      <button
        onClick={onSend}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send"}
      </button>

      <button
        onClick={onClear}
        className="ml-2 bg-slate-100 px-3 py-2 rounded"
      >
        Clear
      </button>
    </div>
  );
}
