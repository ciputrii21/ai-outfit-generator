import express from "express"
import cors from "cors"
import { v2 as cloudinary } from "cloudinary"

const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb" }))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.post("/api/generate", async (req, res) => {
  const { imageBase64, mimeType } = req.body
  console.log("Request masuk!")

  try {
    // Upload ke Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:${mimeType};base64,${imageBase64}`,
      { folder: "ai-outfit-generator" }
    )
    console.log("Upload Cloudinary berhasil:", uploadResult.secure_url)

    // Kirim ke Groq
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: uploadResult.secure_url }
                },
                {
                  type: "text",
                  text: "Kamu adalah fashion stylist profesional. Analisis pakaian dalam gambar ini dan berikan rekomendasi kombinasi outfit yang cocok. Sebutkan: 1) Deskripsi pakaian yang diupload, 2) Warna dan item yang cocok dipadukan, 3) Saran gaya untuk occasion tertentu (casual, formal, date night). Jawab dalam Bahasa Indonesia."
                }
              ]
            }
          ],
          max_tokens: 1024
        }),
      }
    )

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content
    res.status(200).json({ 
      result: text,
      imageUrl: uploadResult.secure_url 
    })
  } catch (error) {
    console.log("Error detail:", error.message)
    res.status(500).json({ error: "Gagal generate outfit" })
  }
})

app.listen(3001, () => console.log("Server running on port 3001"))