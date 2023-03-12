const express = require('express');
const Ajv = require('ajv');
const sqlite = require('better-sqlite3');

const sleep = (ms) => new Promise((res) => { setTimeout(res, ms) })

// set up express
const app = express();
app.use(express.json());
app.use(express.static('public'));

// ajv request validator
const ajv = new Ajv();
const schema = {
    type: 'object',
    properties: {
        query: { type: 'string' },
    },
    required: ['query'],
    additionalProperties: false
};
const validate = ajv.compile(schema);

// database
const db = sqlite('sqlite3.db', { readonly: true });

// search route
app.search('/search', async (req, res) => {
    if (!validate(req.body)) {
        return res.json({
            success: false,
            msg: 'Invalid search query',
            results: [],
        });
    }

    await sleep(5000); // the database is slow :p

    const query = `SELECT * FROM brawlers WHERE name LIKE '%${req.body.query}%';`;
    let results;
    try {
        results = db.prepare(query).all();
    } catch {
        return res.json({
            success: false,
            msg: 'Something went wrong :(',
            results: [],
        })
    }

    return res.json({
        success: true,
        msg: `${results.length} result(s)`,
        results,
    });
});

// start server
app.listen(8080, () => {
    console.log('Server started');
});