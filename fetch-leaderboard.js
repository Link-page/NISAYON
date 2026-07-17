const fs = require('fs');

async function fetchKickData() {
  try {
    // זו קריאה ל-API של קיק באמצעות המפתח שלך
    const response = await fetch('https://api.kick.com/v1/channels/ronengg/leaderboard', {
      headers: {
        'Authorization': `Bearer ${process.env.KICK_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // סידור הנתונים למבנה נקי שהאתר שלנו מכיר
    // שים לב: המבנה תלוי באיך שקיק מחזירים את המידע, אבל זה הסטנדרט
    const formattedData = {
      allTime: data.all_time ? data.all_time.map(u => ({ username: u.username, amount: u.amount })) : [],
      weekly: data.weekly ? data.weekly.map(u => ({ username: u.username, amount: u.amount })) : []
    };

    // שמירה לקובץ
    fs.writeFileSync('leaderboard.json', JSON.stringify(formattedData, null, 2));
    console.log('Leaderboard updated successfully!');
    
  } catch (error) {
    console.error('Failed to fetch Kick data:', error);
    // אם יש שגיאה, אנחנו לא דורסים את הקובץ הקיים כדי שהאתר לא יישאר ריק
  }
}

fetchKickData();
