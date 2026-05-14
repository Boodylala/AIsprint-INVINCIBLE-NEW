// --- UI Card Rendering Functions ---

function renderBrief(data) {
    // 1. Log the data so you can see exactly what the database is sending!
    console.log("Database Data Received:", data); 

    // 2. Smartly extract the content, regardless of how FastAPI formats it
    let content = data;
    if (data.content) {
        content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    } else if (typeof data === 'string') {
        content = JSON.parse(data);
    }

    // 3. Populate cards, checking for the different possible names the AI might have used
    populateCards("summary", content.summary || content.Summary || "No summary provided.");
    populateCards("goals", content.goals || content.Goals || []);
    
    // Check for "missing", "missing_information", etc.
    const missingData = content.missing || content.missing_information || content.missingInformation || [];
    populateCards("missing", missingData);
    
    // Check for "questions", "follow_up_questions", etc.
    const questionData = content.questions || content.follow_up_questions || content.followUpQuestions || [];
    populateCards("questions", questionData);
}

function populateCards(containerId, items) {
    // Find the container using a few common naming conventions
    const container = document.getElementById(containerId) || 
                      document.getElementById(`${containerId}-container`) ||
                      document.querySelector(`.${containerId}-container`);
                      
    if (!container) {
        console.warn(`Could not find HTML container for: ${containerId}`);
        return;
    }
    
    container.innerHTML = ""; // Clear any loading text
    
    // Ensure it's an array so we can loop through it cleanly
    if (!Array.isArray(items)) {
        items = [items];
    }

    // If the array is empty, let the user know
    if (items.length === 0) {
        const emptyCard = document.createElement("div");
        emptyCard.className = `card ${containerId}-card`;
        emptyCard.textContent = "None generated.";
        container.appendChild(emptyCard);
        return;
    }

    // Build the UI cards
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = `card ${containerId}-card`; 
        card.textContent = item;
        container.appendChild(card);
    });
}
