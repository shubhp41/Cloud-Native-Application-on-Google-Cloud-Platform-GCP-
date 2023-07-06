const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();
const port = 7000;
const bodyParser = require("body-parser");
const path = '/shubh_PV_dir';

app.use(bodyParser.json());

// GET /file/:filename
app.get('/file/:filename', (req, res) => {
    const { filename } = req.params;
    console.log("THis is the file name in container2", filename)
    const filepath = `${path}/${filename}`;

    // Check if file exists
    console.log("Container2 Check if file exists")

    if (!fs.existsSync(filepath)) {
        console.log("Container2 file not found get triggered")

        return res.status(404).json({ file: filename, error: 'File not found.' });
    }
    // Read file and return content
    // Read file and return content
    const stream = fs.createReadStream(filepath);
    stream.pipe(res);
});

app.post('/calculate', (req, res) => {
    const { file, product } = req.body;
    const filepath = `${path}/${file}`;

    let sum = 0;

    // Check if file exists
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ file, error: 'File not found.' });
    }

    // Read the file
    const fileContents = fs.readFileSync(filepath, 'utf8');

    // Split the file contents by line
    const lines = fileContents.split('\n');

    // Check if the file has at least two line
    if (lines.length < 2) {
        return res.status(400).json({ file, error: 'Input file not in CSV format.' });
    }



    // Iterate through the remaining lines and calculate the sum
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length > 0) {
            const [productValue, amountValue] = line.split(',');

            // Check if the line has two values
            if (typeof productValue === 'undefined' || typeof amountValue.trim() === 'undefined') {
                console.log("Triggered")
                return res.status(400).json({ file, error: 'Input file not in CSV format.' });
            }

            if (productValue.trim().toLowerCase() === product.trim().toLowerCase()) {
                const amount = parseInt(amountValue.trim());

                // Check if the amount is a valid number
                if (!isNaN(amount)) {
                    sum += amount;
                } else {
                    console.log("Triggered000000000")

                    return res.status(400).json({ file, error: 'Input file not in CSV format.' });
                }
            }
        }
    }

    // Send the response with the calculated sum
    res.json({ file, sum });
});



app.listen(port, () => {
    console.log(`Container 2 listening at http://localhost:${port}`)
})