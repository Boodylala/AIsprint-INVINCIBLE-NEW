document.addEventListener("DOMContentLoaded", () => {
    const landingView = document.getElementById("landing-view");
    const inputView = document.getElementById("input-view");
    
    // View transitions
    document.getElementById("get-started-btn").addEventListener("click", () => {
        landingView.classList.add("hidden");
        inputView.classList.remove("hidden");
    });

    document.getElementById("back-btn").addEventListener("click", () => {
        inputView.classList.add("hidden");
        landingView.classList.remove("hidden");
    });

    // Handle Form Submission
    document.getElementById("brief-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = document.getElementById("submit-btn");
        const loading = document.getElementById("loading");

        submitBtn.disabled = true;
        loading.classList.remove("hidden");

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            
            if (response.ok) {
                // REDIRECT TO THE NEW PAGE INSTEAD OF UNHIDING UI
                window.location.href = `/brief.html?id=${result.brief_id}`;
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
});
