document.addEventListener("DOMContentLoaded", async () => {
    // 1. Grab the ID from the URL link
    const urlParams = new URLSearchParams(window.location.search);
    const briefId = urlParams.get("id");

    // 2. Fill in the "Copy Link" input box with the current URL
    const linkInput = document.querySelector("input[type='text']");
    if (linkInput) {
        linkInput.value = window.location.href;
    }

    if (!briefId) {
        console.error("No brief ID found in the URL.");
        return;
    }

    // 3. Fetch the brief data from your database
    try {
        const response = await fetch(`/api/brief/${briefId}`);
        if (response.ok) {
            const data = await response.json();
            renderBrief(data); // Render the cards!
        } else {
            console.error("Failed to load brief data.");
        }
    } catch (error) {
        console.error("Error fetching brief:", error);
    }

    // 4. The Confirmation Button Logic
    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", async () => {
            try {
                confirmBtn.textContent = "Confirming...";
                confirmBtn.disabled = true;

                const response = await fetch(`/api/brief/${briefId}/confirm`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    confirmBtn.textContent = "✅ Brief Confirmed!";
                    confirmBtn.style.backgroundColor = "#4CAF50";
                    confirmBtn.style.color = "white";
                    confirmBtn.style.border = "none";
                } else {
                    confirmBtn.textContent = "I Confirm This Brief";
                    confirmBtn.disabled = false;
                    alert("Something went wrong confirming the brief.");
                }
            } catch (error) {
                console.error("Error confirming brief:", error);
                confirmBtn.textContent = "I Confirm This Brief";
                confirmBtn.disabled = false;
            }
        });
    }
});

// --- UI Card Rendering Functions ---

function renderBrief(data) {
    // Parse the JSON content from the database
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    
    // Populate the color-coded cards based on the container IDs in your HTML
    populateCards("summary", content.summary || "No summary provided.");
    populateCards("goals", content.goals || []);
    populateCards("missing", content.missing || []);
    populateCards("questions", content.questions || []);
}

function populateCards(containerId, items) {
    // Find the container (e.g., summary, goals, missing, questions)
    // Note: Adjust the ID slightly if your HTML uses "summary-container" instead of just "summary"
    const container = document.getElementById(containerId) || document.getElementById(`${containerId}-container`);
    if (!container) return;
    
    container.innerHTML = ""; // Clear any loading text
    
    // Ensure it's an array so we can loop through it
    if (!Array.isArray(items)) {
        items = [items];
    }

    // Build the UI cards
    items.forEach(item => {
        const card = document.createElement("div");
        // Apply your custom CSS classes for the rounded cards and specific colors
        card.className = `card ${containerId}-card`; 
        card.textContent = item;
        container.appendChild(card);
    });
}
