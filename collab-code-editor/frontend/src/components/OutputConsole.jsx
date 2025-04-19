export default function OutputConsole({ output }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md text-gray-800">
      <h3 className="text-lg font-bold mb-2">Output Console</h3>
      <pre className="bg-gray-100 p-2 rounded-md overflow-auto max-h-64">
        {output || "No output yet..."}
      </pre>
    </div>
  )
}