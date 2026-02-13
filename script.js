const GROQ_API_KEY = "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";

async function proses(tone) {
    const inputField = document.getElementById("inputTeks");
    const outputField = document.getElementById("outputTeks");
    const inputTeks = inputField.value;

    if (!inputTeks.trim()) {
        alert("Ketik dulu pesannya!");
        return;
    }

    outputField.value = "Sedang memproses... ⚡";

    let instruksi = "";
    if (tone === 'formal') {
        instruksi = `Ubah teks berikut menjadi sangat profesional dan sopan (Bahasa Indonesia). 
        HANYA BERIKAN SATU HASIL TERJEMAHAN. Dilarang memberikan kalimat pembuka seperti 'Baiklah' atau 'Ini hasilnya'.
        Teks: `;
    } else {
        instruksi = `Ubah teks berikut menjadi sopan tapi santai dan akrab (Bahasa Indonesia). 
        Gunakan partikel natural seperti 'ya' atau 'nih'.
        HANYA BERIKAN SATU HASIL TERJEMAHAN TANPA BASA-BASI.
        Teks: `;
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Menggunakan model terbaru yang stabil
                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah mesin penerjemah gaya bahasa. TUGASMU HANYA MEMBERIKAN HASIL KONVERSI TEKS. JANGAN memberikan pembukaan, JANGAN memberikan penjelasan, JANGAN memberikan variasi lain. HANYA OUTPUT TEKS AKHIR."                    },
                    {
                        role: "user",
                        content: instruksi + inputTeks
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (response.ok) {
            outputField.value = data.choices[0].message.content.trim();
        } else {
            // Jika masih error 400, pesan ini akan memberitahu alasannya
            outputField.value = "Error: " + (data.error ? data.error.message : "Gagal memproses data.");
            console.log("Detail Error:", data);
        }

    } catch (error) {
        outputField.value = "Koneksi gagal! Cek internet kamu.";
        console.error("Koneksi Error:", error);
    }
}

// Fungsi copy teks
function copyText() {
    const outputTeks = document.getElementById("outputTeks");
    if (outputTeks.value && !outputTeks.value.includes("...")) {
        outputTeks.select();
        document.execCommand("copy");
        alert("Berhasil disalin!");
    }
}