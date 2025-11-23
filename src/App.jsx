import React, { useState } from "react";

const BODY_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function send() {
    setError(null);
    setResponse(null);

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    const hasBody = BODY_METHODS.includes(method);
    let parsedBody = null;

    if (hasBody && body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        setError("Request body must be valid JSON.");
        return;
      }
    }

    const opts = { method };

    const headers = {};
    if (parsedBody != null) {
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(parsedBody);
    }

    if (Object.keys(headers).length) opts.headers = headers;

    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(url, opts);
      const duration = Date.now() - start;

      const rawText = await res.text();

      let parsed = null;
      let pretty = rawText;
      try {
        parsed = JSON.parse(rawText);
        pretty = JSON.stringify(parsed, null, 2);
      } catch {
        // not JSON, keep rawText
      }

      const headersObj = {};
      res.headers.forEach((v, k) => (headersObj[k] = v));

      setResponse({
        status: res.status,
        statusText: res.statusText,
        duration,
        headers: headersObj,
        body: pretty,
        raw: rawText,
      });
    } catch {
      setError("Network or fetch error");
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setResponse(null);
    setError(null);
  }

  async function copyResponse() {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response.body ?? response.raw ?? "");
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Web API Tester</h1>
        <p className="text-sm text-slate-500">Select method, enter URL and optional JSON body, then Send.</p>
      </header>

      <main className="space-y-4">
        <div className="bg-white shadow rounded p-4">
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
              onClick={send}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send"}
            </button>

            <button onClick={clear} className="ml-2 bg-slate-100 px-3 py-2 rounded">
              Clear
            </button>
          </div>

          {BODY_METHODS.includes(method) && (
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
          )}

          {error && <div className="mt-3 text-red-600">{error}</div>}
        </div>

        <div className="bg-white shadow rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Response</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={copyResponse}
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
                <div className="px-2 py-1 bg-slate-100 rounded">Status: {response.status} {response.statusText}</div>
                <div className="px-2 py-1 bg-slate-100 rounded">Time: {response.duration} ms</div>
              </div>

              <div>
                <div className="text-sm text-slate-600 mb-1">Headers</div>
                <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto">
{JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>

              <div>
                <div className="text-sm text-slate-600 mb-1">Body</div>
                <pre className="bg-black text-white p-3 rounded overflow-auto font-mono text-sm whitespace-pre-wrap">{response.body}</pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
