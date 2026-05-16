const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/api/epa/*', async (req, res) => {
    try {
        const endpoint = req.params[0];
        const epaUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/${endpoint}`;
        
        const response = await fetch(epaUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'XmasTree4U/1.0 (acrossy2k@gmail.com)'
            }
        });
        
        const data = await response.json();
        res.json(data); 
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Failed to fetch from EPA" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Your backend server is running on port ${PORT}`));