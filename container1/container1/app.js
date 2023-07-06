const bodyParser = require("body-parser");
const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const port = 6000;
const path = '/shubh_PV_dir';
const csv = require('csv-writer');



app.use(bodyParser.json());

app.get("/hello", (req, res) => {
    res.json({ message: "hello user" })
})
//Store Data
app.post('/store-file', async (req, res) => {
    const { file, data } = req.body;

    // If file name is not provided
    if (!file || Array.isArray(file) || file.length === 0) {
        res.status(400).json({ file: null, error: 'Invalid JSON input.' });
        return;
    }

    // If data is not provided
    if (!data || Array.isArray(data) || data.length === 0) {
        res.status(400).json({ file, error: 'Invalid JSON input.' });
        return;
    }

    // Store the file
    try {
        await storeFileToStorage(file, data);
        res.json({ file, message: 'Success.' });
    } catch (error) {
        res
            .status(500)
            .json({ file, error: 'Error while storing the file to the storage.' });
    }
    // async function storeFileToStorage(file, data) {
    //     try {
    //         const filePath = `${path}/${file}`;
    //         const records = parseDataToCSV(data);
    //         const csvWriter = csv.createObjectCsvWriter({
    //             path: filePath,
    //             header: Object.keys(records[0]).map(key => ({ id: key, title: key })),
    //         });
    //         await csvWriter.writeRecords(records);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // function parseDataToCSV(data) {
    //     const lines = data.split('\n');
    //     const headers = lines[0].split(',').map(header => header.trim());
    //     console.log(headers)
    //     const records = [];

    //     for (let i = 1; i < lines.length; i++) {
    //         const line = lines[i].split(',').map(value => value.trim());
    //         const record = {};
    //         for (let j = 0; j < headers.length; j++) {
    //             record[headers[j]] = line[j];
    //         }
    //         records.push(record);
    //         console.log(record);
    //     }

    //     return records;
    //  }
    async function storeFileToStorage(file, data) {
        try {
            const filePath = `${path}/${file}`;
            await fs.promises.writeFile(filePath, data);
            console.log("This is the data stored in container1", data)
        }
        catch (err) {
            console.log(err);
        }
    }
});

app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    //If file name is not provided
    if (!file || Array.isArray(file) || file.length == 0) {
        res.status(400).json({ file: null, error: "Invalid JSON input." });
        return
    }
    if (!product || Array.isArray(product) || product.length == 0) {
        res.status(400).json({ file: null, error: "Invalid JSON input." });
        return
    }
    //check if file exist
    try {
        console.log("Checking the file exist");
        const response = await axios.get(`http://localhost:7000/file/${file}`);
        console.log("file exist");
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Container1 Error triggered file not found")
            return res.status(404).json({ file, error: 'File not found.' });
        }
        res.status(500).json({ file, error: 'Internal server error.' });
    }

    //send request to container 2

    try {
        console.log("Container1 calculate file api triggered in 1")

        const response = await axios.post('http://localhost:7000/calculate', { file, product });
        console.log("Successfull response in container 1");
        res.json({ file, sum: response.data.sum.toString() })
    } catch (error) {
        if (error.response && error.response.status === 400) {
            res.status(400).json({ file, error: 'Input file not in CSV format.' });
        } else {

            res.status(500).json({ file, error: 'Internal Server error.' });
        }
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Container 1 is listening at http://0.0.0.0:${port}`);
});
