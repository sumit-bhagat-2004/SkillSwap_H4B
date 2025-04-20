import { useState } from "react"

export default function LanguageSelector({ languages, selectedLanguage, onLanguageChange }) {
  const handleChange = (e) => {
    const languageId = parseInt(e.target.value, 10)
    onLanguageChange(languageId) // Notify the parent component about the change
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
        Select Language
      </label>
      <select
        id="language"
        value={selectedLanguage} // Bind the dropdown to the selectedLanguage prop
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}