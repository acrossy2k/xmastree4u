{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww14960\viewh11160\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
const express = require('express');\
const cors = require('cors');\
const app = express();\
\
app.use(cors());\
\
app.use(express.static('public'));\
\
app.get('/api/epa/*', async (req, res) => \{\
    try \{\
        const endpoint = req.params[0];\
        const epaUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/$\{endpoint\}`;\
        \
        const response = await fetch(epaUrl, \{\
            headers: \{\
                'Accept': 'application/json',\
                'User-Agent': 'CarbonCalculatorApp/1.0 (your_email@example.com)'\
            \}\
        \});\
        \
        const data = await response.json();\
        res.json(data); \
    \} catch (error) \{\
        console.error("Backend Error:", error);\
        res.status(500).json(\{ error: "Failed to fetch from EPA" \});\
    \}\
\});\
\
const PORT = process.env.PORT || 3000;\
app.listen(PORT, () => console.log(`Your backend server is running on port $\{PORT\}`));}