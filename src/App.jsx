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
      setImageBase64(base64)
    }
    img.src = URL.createObjectURL(file)
  }

  const handleGenerate = async () => {
    if (!imageBase64) { setError("Upload foto dulu ya!"); return }
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("/api/generate", { imageBase64, mimeType })
      setResult(res.data.result)
    } catch (err) {
      setError("Gagal generate outfit. Coba lagi!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #fff5f7;
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff0f5 0%, #fce4ec 40%, #f8bbd0 100%);
          padding: 40px 20px 80px;
          position: relative;
          overflow: hidden;
        }

        .blob1 {
          position: fixed; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, #f48fb1 0%, #f06292 100%);
          opacity: 0.15; pointer-events: none; z-index: 0;
        }

        .blob2 {
          position: fixed; bottom: -150px; left: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, #ce93d8 0%, #ab47bc 100%);
          opacity: 0.1; pointer-events: none; z-index: 0;
        }

        .container {
          max-width: 520px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        .header { text-align: center; margin-bottom: 40px; }

        .badge {
          display: inline-block;
          background: linear-gradient(135deg, #f48fb1, #ce93d8);
          color: white; font-size: 11px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 20px; margin-bottom: 16px;
        }

        .title {
          font-family: 'Playfair Display', serif;
          font-size: 42px; font-weight: 700;
          color: #ad1457;
          line-height: 1.1; margin-bottom: 12px;
        }

        .title span { font-style: italic; color: #e91e8c; }

        .subtitle {
          color: #c2185b; font-size: 15px;
          font-weight: 300; opacity: 0.8;
        }

        .card {
          background: white;
          border-radius: 28px;
          padding: 32px;
          box-shadow: 0 8px 40px rgba(233, 30, 140, 0.12);
          margin-bottom: 24px;
        }

        .upload-area {
          border: 2px dashed #f48fb1;
          border-radius: 20px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #fff5f8, #fce4ec);
        }

        .upload-area:hover {
          border-color: #e91e8c;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          transform: translateY(-2px);
        }

        .upload-icon { font-size: 48px; margin-bottom: 12px; }

        .upload-text {
          color: #c2185b; font-size: 15px; font-weight: 500;
        }

        .upload-subtext {
          color: #f48fb1; font-size: 12px; margin-top: 6px;
        }

        .preview-img {
          width: 100%; height: 220px;
          object-fit: cover; border-radius: 16px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(233, 30, 140, 0.15);
        }

        .btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #e91e8c, #ab47bc);
          color: white; border: none; border-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 500;
          cursor: pointer; transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(233, 30, 140, 0.35);
        }

        .btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .loading-dots::after {
          content: ''; animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60% { content: '...'; }
          80%, 100% { content: ''; }
        }

        .error {
          background: #fce4ec; color: #c62828;
          padding: 12px 16px; border-radius: 12px;
          font-size: 14px; margin-top: 16px; text-align: center;
        }

        .result-card {
          background: white; border-radius: 28px; padding: 32px;
          box-shadow: 0 8px 40px rgba(233, 30, 140, 0.12);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; padding-bottom: 16px;
          border-bottom: 2px solid #fce4ec;
        }

        .result-icon { font-size: 28px; }

        .result-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; color: #ad1457; font-weight: 700;
        }

        .result-text {
          color: #555; font-size: 15px; line-height: 1.8;
          white-space: pre-line;
        }

        .result-text strong, .result-text b { color: #c2185b; }

        .decorative {
          text-align: center; margin-bottom: 32px;
          font-size: 20px; opacity: 0.4; letter-spacing: 8px;
        }
      `}</style>

      <div className="app">
        <div className="blob1" />
        <div className="blob2" />

        <div className="container">
          <div className="header">
            <div className="badge">✨ AI Fashion Stylist</div>
            <h1 className="title">Your <span>Outfit</span><br />Generator</h1>
            <p className="subtitle">Upload foto bajumu, AI akan suggest kombinasi outfit!</p>
          </div>

          <div className="decorative">🌸 ✿ 🌸 ✿ 🌸</div>

          <div className="card">
            <label className="upload-area" style={{ display: "block" }}>
              <div className="upload-icon">👗</div>
              <div className="upload-text">Klik untuk upload foto baju</div>
              <div className="upload-subtext">JPG, PNG • Max 10MB</div>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
            </label>

            {preview && (
              <div style={{ marginTop: "20px" }}>
                <img src={preview} alt="preview" className="preview-img" />
                <button className="btn" onClick={handleGenerate} disabled={loading}>
                  {loading ? <span className="loading-dots">✨ AI sedang analisis</span> : "✨ Generate Outfit"}
                </button>
              </div>
            )}

            {error && <div className="error">⚠️ {error}</div>}
          </div>

          {result && (
            <div className="result-card">
              <div className="result-header">
                <span className="result-icon">💖</span>
                <h2 className="result-title">Rekomendasi Outfit</h2>
              </div>
              <p className="result-text">{result}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}