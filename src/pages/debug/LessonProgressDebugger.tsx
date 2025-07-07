
import React, { useState } from "react";

// A simple debug page for manual testing of the POST /api/lessons/progress API endpoint
export default function LessonProgressDebugger() {
  const [userId, setUserId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [result, setResult] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("https://languagelearningdep.onrender.com/lessons/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lessonId }),
      });
      const text = await response.text();
      setResult(`Status: ${response.status}\nResponse: ${text}`);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center">Lesson Progress API Debugger</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            User ID
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 focus:bg-white outline-none"
              placeholder="Paste real user ID here"
              disabled={loading}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Lesson ID
            <input
              type="text"
              value={lessonId}
              onChange={e => setLessonId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 focus:bg-white outline-none"
              placeholder="Paste real lesson ID here"
              disabled={loading}
            />
          </label>
        </div>
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded transition hover:bg-green-700 disabled:opacity-50"
          onClick={handleTest}
          disabled={loading || !userId || !lessonId}
        >
          {loading ? "Testing..." : "Test Progress API"}
        </button>
        {result && (
          <pre className="bg-gray-100 rounded p-4 mt-6 text-xs whitespace-pre-wrap border border-gray-200">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
