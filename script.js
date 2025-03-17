const key = "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"; // Replace with a valid key
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

async function query(text) {
    load.style.display = "block"; // Show loading

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.blob();
        return result;
    } catch (error) {
        console.error("Error generating image:", error);
        alert(`Error: ${error.message}\nTry again later.`);
        return null;
    } finally {
        load.style.display = "none"; // Hide loading
    }
}

async function generate() {
    const text = inputText.value.trim();
    if (!text) {
        alert("Please enter a prompt.");
        return;
    }

    svg.style.display = "none"; // Hide placeholder
    const response = await query(text);

    if (response) {
        const objectUrl = URL.createObjectURL(response);
        image.style.display = "block";
        image.src = objectUrl;
        downloadBtn.onclick = () => download(objectUrl);
    }
}
GenBtn.addEventListener("click", generate);

inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") generate();
});

ResetBtn.addEventListener("click", () => {
    inputText.value = "";
    image.style.display = "none";
    svg.style.display = "block";
});

function download(objectUrl) {
    fetch(objectUrl)
        .then((res) => res.blob())
        .then((file) => {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = `generated_image_${Date.now()}.png`;
            a.click();
        })
        .catch(() => alert("Failed to download image"));
}
