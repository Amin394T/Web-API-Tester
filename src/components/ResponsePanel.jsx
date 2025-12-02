import React from "react";

export default function ResponsePanel({ response, onCopy }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Response</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            disabled={!response}
            className="text-sm px-3 py-1 bg-slate-100 rounded disabled:opacity-50"
          >
            Copy
          </button>
        </div>
      </div>

      {!response && <div className="text-sm text-slate-500">No response yet.</div>}

      {response && (
        <div className="space-y-3">
          <div className="flex gap-4 flex-wrap text-sm">
            <div className="px-2 py-1 bg-slate-100 rounded">
              Status: {response.status} {response.statusText}
            </div>
            <div className="px-2 py-1 bg-slate-100 rounded">
              Time: {response.duration} ms
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-600 mb-1">Headers</div>
            <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(response.headers, null, 2)}
            </pre>
          </div>

          <div>
            <div className="text-sm text-slate-600 mb-1">Body</div>
            <pre className="bg-black text-white p-3 rounded overflow-auto font-mono text-sm whitespace-pre-wrap">
              {response.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
