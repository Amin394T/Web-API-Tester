import React, { useState } from "react";
import RequestSection from "./components/RequestSection";
import RequestBodyEditor from "./components/RequestBodyEditor";
import HeadersEditor from "./components/HeadersEditor";
import ResponsePanel from "./components/ResponsePanel";

const BODY_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState([]);
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

    const requestHeaders = {};

    // Merge custom headers
    headers.forEach(({ key, value }) => {
      if (key.trim()) {
        requestHeaders[key.trim()] = value.trim();
      }
    });

    // Auto-set Content-Type if body exists and not already set
    if (parsedBody != null) {
      if (!requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
      }
      opts.body = JSON.stringify(parsedBody);
    }

    if (Object.keys(requestHeaders).length) opts.headers = requestHeaders;

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
      </header>

      <main className="space-y-4">
        <div className="bg-white shadow rounded p-4">
          <RequestSection
            method={method}
            setMethod={setMethod}
            url={url}
            setUrl={setUrl}
            onSend={send}
            onClear={clear}
            loading={loading}
          />

          <RequestBodyEditor method={method} body={body} setBody={setBody} />

          <HeadersEditor headers={headers} setHeaders={setHeaders} />

          {error && <div className="mt-3 text-red-600">{error}</div>}
        </div>

        <ResponsePanel response={response} onCopy={copyResponse} />
      </main>
    </div>
  );
}

export default App;
