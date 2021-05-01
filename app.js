const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");

const port = 3787;

const cache = new NodeCache({ stdTTL: 60 * 5, checkperiod: 60 });

app.use(bodyParser.json());

app.get("/:?", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const cached = cache.get(req.url);
    if (cached) {
        res.status(200);
        res.send(cached);
    } else {
        res.status(404);
        res.end();
    }
});

app.post("/:?", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!req.body) {
        res.status(304);
        res.end();
    } else {
        cache.set(req.url, req.body);
        res.status(201);
        res.end();
    }
});

app.listen(port);
console.log(`Server started on port ${port}`);