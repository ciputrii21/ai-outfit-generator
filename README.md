# 👗 AI Outfit Generator

**English** | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

An AI-powered web app that analyzes your clothing and suggests outfit combinations using Groq AI and Cloudinary.

### Features

- Upload a photo of your clothing
- AI analyzes the style, color, and type of clothing
- Get outfit recommendations for casual, formal, and date night occasions
- Images stored securely via Cloudinary

### Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Groq API (Llama 4 Vision)
- **Storage:** Cloudinary
- **Deployment:** Vercel

### How to Run Locally

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your API keys:
   VITE_GROQ_API_KEY=your_groq_api_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
4. Run the backend: `node server.js`
5. Run the frontend: `npm run dev`
6. Open `http://localhost:5173`

---

## Bahasa Indonesia

Aplikasi web berbasis AI yang menganalisis pakaianmu dan menyarankan kombinasi outfit menggunakan Groq AI dan Cloudinary.

### Fitur

- Upload foto pakaianmu
- AI menganalisis gaya, warna, dan jenis pakaian
- Dapatkan rekomendasi outfit untuk acara kasual, formal, dan date night
- Gambar tersimpan aman melalui Cloudinary

### Teknologi yang Digunakan

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Groq API (Llama 4 Vision)
- **Storage:** Cloudinary
- **Deployment:** Vercel

### Cara Menjalankan Secara Lokal

1. Clone repositori ini
2. Install dependencies: `npm install`
3. Buat file `.env` dengan API key kamu:
4. Jalankan backend: `node server.js`
5. Jalankan frontend: `npm run dev`
6. Buka `http://localhost:5173`
