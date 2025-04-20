import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import socket from "../socket"
import CodeEditor from "../components/Editor"
import LanguageSelector from "../components/LanguageSelector"
import OutputConsole from "../components/OutputConsole"
import SaveFileButton from "../components/SaveFileButton"
import VideoCall from "../components/VideoCall" // Import the VideoCall component

const languages = [
  { id: 45, name: "Assembly (NASM 2.14.02)" },
  { id: 46, name: "Bash (5.0.0)" },
  { id: 47, name: "Basic (FBC 1.07.1)" },
  { id: 75, name: "C (Clang 7.0.1)" },
  { id: 76, name: "C++ (Clang 7.0.1)" },
  { id: 48, name: "C (GCC 7.4.0)" },
  { id: 52, name: "C++ (GCC 7.4.0)" },
  { id: 49, name: "C (GCC 8.3.0)" },
  { id: 53, name: "C++ (GCC 8.3.0)" },
  { id: 50, name: "C (GCC 9.2.0)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
  { id: 86, name: "Clojure (1.10.1)" },
  { id: 51, name: "C# (Mono 6.6.0.161)" },
  { id: 77, name: "COBOL (GnuCOBOL 2.2)" },
  { id: 55, name: "Common Lisp (SBCL 2.0.0)" },
  { id: 56, name: "D (DMD 2.089.1)" },
  { id: 57, name: "Elixir (1.9.4)" },
  { id: 58, name: "Erlang (OTP 22.2)" },
  { id: 44, name: "Executable" },
  { id: 87, name: "F# (.NET Core SDK 3.1.202)" },
  { id: 59, name: "Fortran (GFortran 9.2.0)" },
  { id: 60, name: "Go (1.13.5)" },
  { id: 88, name: "Groovy (3.0.3)" },
  { id: 61, name: "Haskell (GHC 8.8.1)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 78, name: "Kotlin (1.3.70)" },
  { id: 64, name: "Lua (5.3.5)" },
  { id: 89, name: "Multi-file program" },
  { id: 79, name: "Objective-C (Clang 7.0.1)" },
  { id: 65, name: "OCaml (4.09.0)" },
  { id: 66, name: "Octave (5.1.0)" },
  { id: 67, name: "Pascal (FPC 3.0.4)" },
  { id: 85, name: "Perl (5.28.1)" },
  { id: 68, name: "PHP (7.4.1)" },
  { id: 43, name: "Plain Text" },
  { id: 69, name: "Prolog (GNU Prolog 1.4.5)" },
  { id: 70, name: "Python (2.7.17)" },
  { id: 71, name: "Python (3.8.1)" },
  { id: 80, name: "R (4.0.0)" },
  { id: 72, name: "Ruby (2.7.0)" },
  { id: 73, name: "Rust (1.40.0)" },
  { id: 81, name: "Scala (2.13.2)" },
  { id: 82, name: "SQL (SQLite 3.27.2)" },
  { id: 83, name: "Swift (5.2.3)" },
  { id: 74, name: "TypeScript (3.7.4)" },
  { id: 84, name: "Visual Basic.Net (vbnc 0.0.0.5943)" },
]

export default function EditorRoom() {
  const { roomId } = useParams()
  const [username, setUsername] = useState("")
  const [connected, setConnected] = useState(false)
  const [code, setCode] = useState("// Start coding...")
  const [language, setLanguage] = useState(languages[0].id)
  const [stdin, setStdin] = useState("")
  const [output, setOutput] = useState("")
  const [isEditorSwapped, setIsEditorSwapped] = useState(false) // State to control swapping

  const handleSwap = () => {
    setIsEditorSwapped(!isEditorSwapped)
  }

  useEffect(() => {
    const savedUsername = localStorage.getItem("username")
    if (!savedUsername) {
      alert("No username found! Redirecting to home.")
      window.location.href = "/"
      return
    }

    setUsername(savedUsername)

    socket.emit("join_room", { room: roomId, username: savedUsername })

    socket.on("executionResult", (result) => {
      setOutput(result.stdout || result.stderr || "No output.")
    })

    socket.on("stdin_change", ({ stdin: incomingStdin }) => {
      setStdin(incomingStdin)
    })

    socket.on("language_change", ({ language_id }) => {
      setLanguage(language_id)
    })

    return () => {
      socket.off("executionResult")
      socket.off("stdin_change")
      socket.off("language_change")
    }
  }, [roomId])

  useEffect(() => {
    socket.on("room_joined", ({ code: incomingCode, stdin: incomingStdin, language_id }) => {
      console.log("Room joined. Incoming code:", incomingCode)
      setConnected(true)
      setCode(incomingCode) // Update the editor with the current code
      setStdin(incomingStdin) // Update the stdin
      setLanguage(language_id) // Update the language
    })

    return () => {
      socket.off("room_joined")
    }
  }, [roomId])

  const handleRunCode = () => {
    setOutput("Running...")
    socket.emit("execute_code_event", {
      room: roomId,
      source_code: code,
      language_id: language,
      stdin,
    })
  }

  const handleStdinChange = (value) => {
    setStdin(value)
    socket.emit("stdin_change", { room: roomId, stdin: value })
  }

  const handleLanguageChange = (languageId) => {
    setLanguage(languageId)
    socket.emit("language_change", { room: roomId, language_id: languageId })
  }

  return (
    <div className="flex h-screen">
      {/* Left Side: Code Editor */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
        {isEditorSwapped ? (
          <VideoCall roomId={roomId} /> // Use the VideoCall component here
        ) : (
          <CodeEditor roomId={roomId} initialCode={code} onCodeChange={setCode} />
        )}
      </div>

      {/* Right Side: Features */}
      <div className="w-1/3 flex flex-col space-y-4 p-4">
        <div className="text-sm text-gray-600 mb-2">
          Room ID: <strong>{roomId}</strong> | Username: <strong>{username}</strong>
        </div>
        <LanguageSelector
          languages={languages}
          selectedLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
        <textarea
          placeholder="Enter input (stdin)"
          value={stdin}
          onChange={(e) => handleStdinChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          rows="4"
        ></textarea>
        <button
          onClick={handleRunCode}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Run Code
        </button>
        <OutputConsole output={output} />
        <SaveFileButton
          code={code}
          stdin={stdin}
          output={output}
          languageId={language}
        />
        <div className="bg-white p-4 rounded-xl shadow-md h-80">
          {isEditorSwapped ? (
            <CodeEditor
              roomId={roomId}
              initialCode={code}
              onCodeChange={setCode}
              className="h-full"
            />
          ) : (
            <VideoCall roomId={roomId} /> // Use the VideoCall component here
          )}
        </div>
        <button
          onClick={handleSwap}
          className="absolute top-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Swap
        </button>
      </div>
    </div>
  )
}
