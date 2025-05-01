import express, { json } from "express";
import cookieParser from "cookie-parser";
import { createPool } from "mysql2/promise";
import { authRouter } from "./auth/auth-routes.js";
import { checkAuth } from "./auth/auth-middleware.js";
import { eventsRouter } from "./events/events-routes.js";
import { tasksRouter } from "./tasks/tasks-routes.js";

const app = express();

app.use(json());
app.use(cookieParser());

// connect to database
export const db = createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
console.log("connected to database");

// add routes here
app.get("/api/test1", checkAuth, async (req, res) => {
    let test;
    let connection;
    try {
        connection = await db.getConnection();
    } catch (err) {
        return res.send({err});
    }
    
    try {
        [test] = await connection.query(`SELECT * FROM test_table;`);

        if (test.length === 0) {
            return res.status(404).send("nothing found");
        }
    } catch (err) {
        res.status(500).send("the server encountered an unexpected error");
        throw err;
    } finally {
        connection.release();
    }

    return res.send(test);
});

app.get("/api/test2", checkAuth, async (req, res) => {
    return res.send("here is my test");
});

app.use(authRouter);
app.use(eventsRouter);
app.use(tasksRouter);

const server = app.listen(process.env.NODE_PORT || 8393, () => {
    console.log(`Server is listening on port ${process.env.NODE_PORT || 8393}...`);
});