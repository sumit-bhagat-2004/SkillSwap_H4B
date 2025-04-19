import React from "react"

const languageExtensions = {
  45: "asm",
  46: "sh",
  47: "bas",
  75: "c",
  76: "cpp",
  48: "c",
  52: "cpp",
  49: "c",
  53: "cpp",
  50: "c",
  54: "cpp",
  86: "clj",
  51: "cs",
  77: "cob",
  55: "lisp",
  56: "d",
  57: "ex",
  58: "erl",
  44: "exe",
  87: "fs",
  59: "f90",
  60: "go",
  88: "groovy",
  61: "hs",
  62: "java",
  63: "js",
  78: "kt",
  64: "lua",
  89: "txt",
  79: "m",
  65: "ml",
  66: "m",
  67: "pas",
  85: "pl",
  68: "php",
  43: "txt",
  69: "pl",
  70: "py",
  71: "py",
  80: "r",
  72: "rb",
  73: "rs",
  81: "scala",
  82: "sql",
  83: "swift",
  74: "ts",
  84: "vb",
}

export default function SaveFileButton({ code, stdin, output, languageId }) {
  const handleSaveFiles = () => {
    // Save code file
    const codeBlob = new Blob([code], { type: "text/plain" })
    const codeExtension = languageExtensions[languageId] || "txt"
    const codeFileName = `code.${codeExtension}`
    const codeLink = document.createElement("a")
    codeLink.href = URL.createObjectURL(codeBlob)
    codeLink.download = codeFileName
    codeLink.click()

    // Save stdin and output file
    const textBlob = new Blob(
      [`Input (stdin):\n${stdin}\n\nOutput:\n${output}`],
      { type: "text/plain" }
    )
    const textFileName = "stdin_output.txt"
    const textLink = document.createElement("a")
    textLink.href = URL.createObjectURL(textBlob)
    textLink.download = textFileName
    textLink.click()
  }

  return (
    <button
      onClick={handleSaveFiles}
      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
    >
      Save Files
    </button>
  )
}