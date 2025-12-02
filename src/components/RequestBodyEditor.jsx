import React from "react";

const BODY_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export default function RequestBodyEditor({ method, body, setBody }) {
  if (!BODY_METHODS.includes(method)) {
    return null;
  }

  return (
    <div className="mt-4">
      <label className="block text-sm text-slate-600 mb-1">Request Body (JSON)</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        placeholder='e.g. {"name": "Alice"}'
        className="w-full border rounded p-2 font-mono text-sm bg-slate-50"
      />
    </div>
  );
}
