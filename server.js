const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

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

app.post('/api/climatiq', async (req, res) => {
    try {
        // 1. Receive the data from your frontend
        const { zipCode, totalKwh } = req.body;
        
        // 2. Safely grab the API key from Render's secure vault
        const apiKey = process.env.CLIMATIQ_API_KEY;

        // 3. Forward the request to Climatiq
        const response = await fetch('https://api.climatiq.io/data/v1/estimate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "emission_factor": {
                    "activity_id": "electricity-energy_source_grid_mix",
                    "data_version": "33.33"
                },
                "parameters": {
                    "energy": totalKwh,
                    "energy_unit": "kWh"
                },
                "location": {
                    "country": "US",
                    "postal_code": zipCode
                }
            })
        });

        // 4. Send the result back to your frontend
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        res.json(data);

    } catch (error) {
        console.error("Climatiq Backend Error:", error);
        res.status(500).json({ error: "Failed to connect to Climatiq proxy" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Your backend server is running on port ${PORT}`));