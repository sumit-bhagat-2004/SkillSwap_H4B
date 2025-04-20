import Editor from "@monaco-editor/react"
import { useEffect, useState } from "react"
import socket from "../socket"

export default function CodeEditor({ roomId, initialCode, onCodeChange }) {
  const [code, setCode] = useState(initialCode)

  const handleEditorChange = (value) => {
    setCode(value)
    onCodeChange(value) // Notify the parent component about the code change
    socket.emit("code_change", { room: roomId, code: value })
  }

  useEffect(() => {
    const handleRemoteChange = ({ code: incomingCode }) => {
      setCode(incomingCode) // Update the editor with the new code
      onCodeChange(incomingCode) // Notify the parent component
    }

    socket.on("code_change", handleRemoteChange)

    return () => {
      socket.off("code_change", handleRemoteChange)
    }
  }, [roomId, onCodeChange])

  return (
    <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden">
      <Editor
        height="500px"
        language="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          wordWrap: "on",
          minimap: { enabled: false },
        }}
      />
    </div>
  )
}
