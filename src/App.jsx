import { useState } from "react"
import axios from "axios"

export default function App() {
  const [preview, setPreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [mimeType, setMimeType] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

 const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
    setMimeType("image/jpeg")

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const maxSize = 800
      let width = img.width
      let height = img.height

      if (width > height && width > maxSize) {
        height = (height * maxSize) / width
        width = maxSize
      } else if (height > maxSize) {
        width = (width * maxSize) / height
        height = maxSize
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, width, height)
      const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1]
      console.log("Base64 siap, panjang:", base64?.length)
      setImageBase64(base64)
    }
    img.src = URL.createObjectURL(file)
  }

  const handleGenerate = async () => {
    console.log("Tombol diklik, imageBase64:", imageBase64 ? "ada" : "kosong")
    if (!imageBase64) {
      setError("Foto belum siap, coba upload lagi!")
      return
    }
    setLoading(true)
    setError(null)
    try {
      console.log("Mengirim request ke server...")
      const res = await axios.post("/api/generate", { imageBase64, mimeType })
      console.log("Response:", res.data)
      setResult(res.data.result)
    } catch (err) {
      console.log("Error:", err.message)
      setError("Gagal generate outfit. Coba lagi!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-pink-600 mb-2">👗 AI Outfit Generator</h1>
      <p className="text-gray-500 mb-8">Upload foto bajumu, AI akan suggest kombinasi outfit!</p>

      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 rounded-xl p-8 cursor-pointer hover:bg-pink-50 transition">
          <span className="text-4xl mb-2">📸</span>
          <span className="text-gray-500 text-sm">Klik untuk upload foto baju</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>

        {preview && (
          <div className="mt-4">
            <img src={preview} alt="preview" className="rounded-xl w-full object-cover h-48" />
            <button
              className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "⏳ Generating..." : "✨ Generate Outfit"}
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-pink-600 mb-3">💡 Rekomendasi Outfit</h2>
          <p className="text-gray-700 whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  )
}