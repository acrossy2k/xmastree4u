const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/api/epa/*', async (req, res) => {
    try {
        // 1. Get the base path (e.g., "menu/make")
        const endpointPath = req.params[0];
        
        // 2. Safely grab any query parameters (e.g., "year=2024")
        const queryParams = new URLSearchParams(req.query).toString();
        
        // 3. Combine them safely
        const fullEndpoint = queryParams ? `${endpointPath}?${queryParams}` : endpointPath;
        const epaUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/${fullEndpoint}`;
        
        // 4. Log the exact URL so you can see it in Render!
        console.log("Fetching from EPA:", epaUrl);
        
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