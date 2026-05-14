document.addEventListener("DOMContentLoaded", () => {
    // ... your existing code to fetch and render the brief ...

    const confirmBtn = document.getElementById("confirm-btn");
    
    if (confirmBtn) {
        confirmBtn.addEventListener("click", async () => {
            // Grab the ID from the URL link, just like you do for fetching the brief data
            const urlParams = new URLSearchParams(window.location.search);
            const briefId = urlParams.get("id");

            if (!briefId) return;

            try {
                // Change button text to show it's working
                confirmBtn.textContent = "Confirming...";
                confirmBtn.disabled = true;

                // Send the PATCH request to your new backend endpoint
                const response = await fetch(`/api/brief/${briefId}/confirm`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Update UI for success
                    confirmBtn.textContent = "✅ Brief Confirmed!";
                    confirmBtn.style.backgroundColor = "#4CAF50"; // Soft green success color
                    confirmBtn.style.color = "white";
                    confirmBtn.style.border = "none";
                } else {
                    // Revert UI on failure
                    confirmBtn.textContent = "I Confirm This Brief";
                    confirmBtn.disabled = false;
                    alert("Something went wrong confirming the brief. Please try again.");
                }
            } catch (error) {
                console.error("Error confirming brief:", error);
                confirmBtn.textContent = "I Confirm This Brief";
                confirmBtn.disabled = false;
            }
        });
    }
});

    // 2. Fetch the brief from the database
    try {
        const response = await fetch(`/api/brief/${briefId}`);
        if (response.ok) {
            const result = await response.json();
            const briefData = typeof result.content === 'string' ? JSON.parse(result.content) : result.content;
            renderBrief(briefData);
        } else {
            alert("Brief not found.");
            window.location.href = "/";
        }
    } catch (error) {
        console.error(error);
        alert("Error loading brief.");
    }

// 3. Populate the UI
    function renderBrief(data) {
        document.getElementById("out-summary").textContent = data.summary || "N/A";
        
        const populateCards = (elementId, array, cardClass) => {
            const container = document.getElementById(elementId);
            container.innerHTML = ""; // Clear out loading state
            
            if(array && array.length > 0) {
                array.forEach(item => {
                    const cardDiv = document.createElement("div");
                    cardDiv.className = `card ${cardClass}`;
                    cardDiv.textContent = item;
                    container.appendChild(cardDiv);
                });
            } else {
                const emptyCard = document.createElement("div");
                emptyCard.className = "card";
                emptyCard.textContent = "None identified";
                container.appendChild(emptyCard);
            }
        };

        // Pass specific color classes to each category
        populateCards("out-goals", data.goals, "card-goal");
        populateCards("out-missing", data.missing, "card-missing");
        populateCards("out-followups", data.follow_ups, "card-followup");

        // Set the share URL to the current page URL
        document.getElementById("share-url").value = window.location.href;
    }
    // 4. Modern Copy to Clipboard logic
    document.getElementById("copy-btn").addEventListener("click", () => {
        const copyText = document.getElementById("share-url");
        navigator.clipboard.writeText(copyText.value)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error("Failed to copy:", err));
    });
});
// 5. Back Button Logic
    document.getElementById("home-back-btn").addEventListener("click", () => {
        window.location.href = "/"; // Sends the user back to the main landing page
    });
