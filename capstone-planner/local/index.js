import express from "express";
import fs from 'fs';

const app = express();

let nextTicket = 1000000;
const activeTickets = new Map();

const xmlData = fs.readFileSync('user_data.xml', 'utf-8');

app.set('view engine', 'ejs');

app.get("/profile/cas/login", (req, res) => {
    const serviceURL = req.query.service;

    if (!serviceURL) {
        res.status(400).send("ERROR: NO SERVICE SPECIFIED");
    }

    return res.render('login', { redirectURL: `${decodeURIComponent(serviceURL)}?ticket=${nextTicket++}` })
});

app.get("/profile/cas/serviceValidate", (req, res) => {
    const ticket = req.query.ticket;
    const serviceURL = req.query.service;

    if (!ticket) res.status(400).send("ERROR: NO TICKET");
    if (!serviceURL) res.status(400).send("ERROR: NO SERVICE SPECIFIED");

    return res.send(xmlData);
});

const server = app.listen(process.env.NODE_PORT || 9000, () => {
    console.log(`Server is listening on port ${process.env.NODE_PORT || 9000}...`);
});