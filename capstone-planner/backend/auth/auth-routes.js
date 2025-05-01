import { Router } from 'express';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import jwt from 'jsonwebtoken';
import { db } from './../index.js'
import { checkAuth } from '../auth/auth-middleware.js'; // ✅ Import here

// three routes
// 1. /api/cas/login
// 2. /api/cas/callback
// 3. /api/cas/logout

export const authRouter = new Router();
const parser = new XMLParser();

const serviceURL = `${process.env.SERVICE_URL}/api/cas/callback`;
const casValidateURL = `${process.env.CAS_URL}/profile/cas/serviceValidate`;
const loginURL = `${process.env.CAS_URL}/profile/cas/login?service=${encodeURIComponent(serviceURL)}`;

const maxAge = 3 * 24 * 60 * 60;
const secret = process.env.JWT_SECRET;

function createToken(payload) {
    return jwt.sign(payload, secret, {expiresIn: maxAge});
}

authRouter.get('/api/cas/login', async (req, res) => {
    return res.redirect(loginURL);
});

authRouter.get('/api/cas/callback', async (req, res) => {
    const ticket = req.query.ticket;
    let connection;
  
    if (!ticket) {
        return res.status(400).send("no ticket");
    }

    try {
        const response = await axios.get(casValidateURL, { params: {
            service: serviceURL,
            ticket: ticket
        }});

        let userData = parser.parse(response.data);
        if (!userData["cas:serviceResponse"]["cas:authenticationSuccess"]) {
            return res.status(401).send("authentication failed");
        }
        userData = userData["cas:serviceResponse"]["cas:authenticationSuccess"];
        const payload = {
            username: userData["cas:user"],
            id: userData["cas:attributes"]["cas:uid"],
            email: userData["cas:attributes"]["cas:eduPersonPrincipalName"],
            affiliations: userData["cas:attributes"]["cas:eduPersonAffiliation"]
        }

        connection = await db.getConnection();

        let [students] = await connection.query(
            `SELECT * FROM Student WHERE uid = ?;`,
            [payload.id]
        );

        if (students.length === 0) {
            await connection.query(
                `INSERT INTO Student (uid, username, email) VALUES (?, ?, ?);`,
                [payload.id, payload.username, payload.email]
            );
        }

        const token = createToken(payload);
        res.cookie("vt_planner_jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    } catch (error) {
        console.error(error);
        return res.status(500).send("authentication failed");
    } finally {
        if (connection) connection.release();
    }

    return res.redirect("/student-home-page");
});

authRouter.get('/api/me', checkAuth, (req, res) => {
    return res.status(200).send(req.user);
  });