const fs = require('fs');

const CLIENT_ID = process.env.KICK_CLIENT_ID;
const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;

async function updateLeaderboard() {
    try {
        console.log("Step 1: Requesting Access Token...");
        
        const tokenRes = await fetch('https://id.kick.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            })
        });

        if (!tokenRes.ok) {
            const errText = await tokenRes.text();
            throw new Error(`Token fetch failed: ${tokenRes.status} - ${errText}`);
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        console.log("Token received successfully!");

        console.log("Step 2: Fetching Leaderboard Data...");
        // משתמשים בנתיב המעודכן ל-API הפומבי
        const apiRes = await fetch('https://api.kick.com/public/v1/channels/ronengg/leaderboards', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
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
