document.addEventListener("DOMContentLoaded", () => {
    const landingView = document.getElementById("landing-view");
    const inputView = document.getElementById("input-view");
    const outputView = document.getElementById("output-view");
    
    // View transitions
    document.getElementById("get-started-btn").addEventListener("click", () => {
        landingView.classList.add("hidden");
        inputView.classList.remove("hidden");
    });

    // Handle Form Submission
    document.getElementById("brief-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = document.getElementById("submit-btn");
        const loading = document.getElementById("loading");

        // UI updates during fetch
        submitBtn.disabled = true;
        loading.classList.remove("hidden");

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            
            if (response.ok) {
                renderBrief(result.data, result.brief_id);
                inputView.classList.add("hidden");
                outputView.classList.remove("hidden");
            } else {
                alert("Error generating brief: " + result.detail);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong communicating with the server.");
        } finally {
            submitBtn.disabled = false;
            loading.classList.add("hidden");
        }
    });

    // Populate Output View
    function renderBrief(data, id) {
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

        // Setup share URL
        const shareUrl = `${window.location.origin}/?brief=${id}`;
        document.getElementById("share-url").value = shareUrl;
    }

    // Copy Link Logic
    document.getElementById("copy-btn").addEventListener("click", () => {
        const copyText = document.getElementById("share-url");
        copyText.select();
        document.execCommand("copy");
        alert("Link copied to clipboard!");
    });

    // Handle incoming shared links
    const urlParams = new URLSearchParams(window.location.search);
    const sharedBriefId = urlParams.get('brief');
    
    if (sharedBriefId) {
        landingView.classList.add("hidden");
        loadSharedBrief(sharedBriefId);
    }

    async function loadSharedBrief(id) {
        try {
            const response = await fetch(`/api/brief/${id}`);
            if (response.ok) {
                const result = await response.json();
                const briefData = typeof result.content === 'string' ? JSON.parse(result.content) : result.content;
                renderBrief(briefData, id);
                outputView.classList.remove("hidden");
            } else {
                alert("Brief not found.");
                landingView.classList.remove("hidden");
            }
        } catch (error) {
            console.error(error);
            landingView.classList.remove("hidden");
        }
    }
});