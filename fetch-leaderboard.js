const fs = require('fs');

async function updateLeaderboard() {
    try {
        console.log("Fetching Leaderboard Data directly from Kick Web API...");
        
        const apiRes = await fetch('https://web.kick.com/api/v1/kicks/4865495/leaderboard', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // מתחפשים לדפדפן כדי לעקוף חסימות בוטים
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!apiRes.ok) {
             const errText = await apiRes.text();
             throw new Error(`API fetch failed: ${apiRes.status} - ${errText}`);
        }

        const data = await apiRes.json();
        fs.writeFileSync('leaderboard.json', JSON.stringify(data, null, 2));
        console.log("Success: leaderboard.json saved successfully!");

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

updateLeaderboard();
