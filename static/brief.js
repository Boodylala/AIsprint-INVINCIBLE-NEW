document.addEventListener("DOMContentLoaded", async () => {
    // 1. Get the ID from the URL link (e.g., brief.html?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const briefId = urlParams.get('id');

    if (!briefId) {
        alert("No brief ID provided.");
        window.location.href = "/"; // Send them back to main page if there's no ID
        return;
    }

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
        
        const populateList = (elementId, array) => {
            const ul = document.getElementById(elementId);
            ul.innerHTML = "";
            if(array && array.length > 0) {
                array.forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    ul.appendChild(li);
                });
            } else {
                ul.innerHTML = "<li>None identified</li>";
            }
        };

        populateList("out-goals", data.goals);
        populateList("out-missing", data.missing);
        populateList("out-followups", data.follow_ups);

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
