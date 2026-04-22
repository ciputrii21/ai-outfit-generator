import { v2 as cloudinary } from "cloudinary"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { imageBase64, mimeType } = req.body

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  try {
    // Upload ke Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:${mimeType};base64,${imageBase64}`,
      { folder: "ai-outfit-generator" }
    )

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
                  text: "You are a professional fashion stylist. Analyze the clothing in this image and provide outfit combination recommendations. Include: 1) Description of the uploaded clothing, 2) Colors and items that pair well, 3) Style suggestions for specific occasions (casual, formal, date night)."
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
    res.status(200).json({ result: text, imageUrl: uploadResult.secure_url })
  } catch (error) {
    res.status(500).json({ error: "Gagal generate outfit: " + error.message })
  }
}