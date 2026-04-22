export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { imageBase64, mimeType } = req.body

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageBase64,
                  },
                },
                {
                  text: "Kamu adalah fashion stylist profesional. Analisis pakaian dalam gambar ini dan berikan rekomendasi kombinasi outfit yang cocok. Sebutkan: 1) Deskripsi pakaian yang diupload, 2) Warna dan item yang cocok dipadukan, 3) Saran gaya untuk occasion tertentu (casual, formal, date night). Jawab dalam Bahasa Indonesia.",
                },
              ],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    res.status(200).json({ result: text })
  } catch (error) {
    res.status(500).json({ error: "Gagal generate outfit" })
  }
}