import { useState } from "react"

export default function SwapButton({ editor, videoCall }) {
  const [isEditorSwapped, setIsEditorSwapped] = useState(false)

  const handleSwap = () => {
    setIsEditorSwapped(!isEditorSwapped)
  }

  return (
    <div className="relative">
      <button
        onClick={handleSwap}
        className="absolute top-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Swap
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isEditorSwapped ? (
          <>
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-md">
              {videoCall}
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-xl shadow-md w-1/4">
              {editor}
            </div>
          </>
        ) : (
          <>
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-md">
              {editor}
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-xl shadow-md w-1/4">
              {videoCall}
            </div>
          </>
        )}
      </div>
    </div>
  )
}