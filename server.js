const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/api/epa/*', async (req, res) => {
    try {
        const endpointPath = req.params[0];
        const queryParams = new URLSearchParams(req.query).toString();
        const fullEndpoint = queryParams ? `${endpointPath}?${queryParams}` : endpointPath;
        const epaUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/${fullEndpoint}`;
        
        console.log("Fetching from EPA:", epaUrl);
        
        const response = await fetch(epaUrl, {
            headers: {
                'Accept': 'application/json',
                // Spoofing a standard web browser to bypass strict government firewalls
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        // Grab the raw text first instead of forcing JSON
        const rawText = await response.text();
        
        try {
            // Attempt to parse it as JSON
            const data = JSON.parse(rawText);
            res.json(data); 
        } catch (parseError) {
            // If the government site returns plain text like "Error connecting...", we catch it here safely!
            console.error("EPA API returned an error page. Raw response:", rawText);
            res.status(502).json({ error: "EPA Database Outage", details: rawText });
        }
    } catch (error) {
        console.error("Network Error:", error);
        res.status(500).json({ error: "Failed to connect to EPA server" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Your backend server is running on port ${PORT}`));