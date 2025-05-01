import { Router } from 'express';
import { db } from './../index.js';
import { checkAuth } from '../auth/auth-middleware.js';

export const eventsRouter = new Router();

eventsRouter.get("/api/events", checkAuth, async (req, res) => {
    let events;
    let connection;
    const uid = req.user.id;

    try {
        connection = await db.getConnection();

        [events] = await db.query(
            `SELECT * FROM Events WHERE uid = ?;`,
            [uid]
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send("The server encountered an unexpected error.");
    } finally {
        if (connection) connection.release();
    }

    if (events.length === 0) return res.status(204).send();
    return res.send(events);
});

eventsRouter.post("/api/events", checkAuth, async (req, res) => {
    let connection;
    let insertId; 
    const uid = req.user.id;
    const { event_name, event_type, date, start_time, end_time, location } = req.body;

    if (!event_name || !event_type || !date || !start_time || !end_time || !location) {
        return res.status(400).send("Missing required fields.");
    }

    const allowed_types = ["Course", "Meal", "Extracurricular", "Other"];
    if (!allowed_types.includes(event_type)) {
        return res.status(400).send("Invalid event_type.");
    }

    try {
        connection = await db.getConnection();

        const [result] = await db.query(
            `INSERT INTO Events (uid, event_name, event_type, date, start_time, end_time, location) 
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [uid, event_name, event_type, date, start_time, end_time, location]
        );

        insertId = result.insertId;
    } catch (error) {
        if (error.code === 'ER_BAD_NULL_ERROR')
            return res.status(400).send("Invalid input: Required fields cannot be empty.");
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE')
            return res.status(400).send("Invalid input: Required fields must be valid.");
        if (error.code === 'ER_DATA_TOO_LONG')
            return res.status(400).send("Invalid input: Required fields are too long.");
        if (error.code === 'WARN_DATA_TRUNCATED')
            return res.status(400).send("Invalid input: Event type must be 'Course', 'Meal', 'Extracurrricular', or 'Other'.")
        console.error(error);
        return res.status(500).send("The server encountered an unexpected error.");
    } finally {
        if (connection) connection.release();
    }

    return res.status(201).send({
        event_id: insertId,
        uid: uid,
        event_name,
        event_type,
        date,
        start_time,
        end_time,
        location: null
    });
});

eventsRouter.put("/api/events/:id", checkAuth, async (req, res) => {
    const { id } = req.params;
    const uid = req.user.id; // Student.uid
    const { event_name, event_type, date, start_time, end_time, location } = req.body;

    if (!event_name || !event_type || !date || !start_time || !end_time) {
        return res.status(400).send("Invalid input: Required fields cannot be empty.");
    }

    const allowed_types = ["Course", "Meal", "Extracurricular", "Other"];
    if (!allowed_types.includes(event_type)) {
        return res.status(400).send("Invalid event_type.");
    }

    let connection;

    try {
        connection = await db.getConnection();

        const [result] = await connection.query(
            `UPDATE Events 
            SET event_name = ?, 
            event_type = ?, 
            date = ?, 
            start_time = ?, 
            end_time = ?, 
            location = ? 
            WHERE event_id = ? AND uid = ?;`,
            [event_name, event_type, date, start_time, end_time, location, id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Event not found.");
        }

        return res.status(200).send("Successfully updated event.");
    }
    catch (error){
        console.error(error);
        return res.status(500).send("Server error.");
    }
    finally {
        if (connection) connection.release();
    }
});

eventsRouter.delete("/api/events/:id", checkAuth, async (req, res) => {
    const { id } = req.params;
    const uid = req.user.id; // Student.uid

    let connection;
    try {
        connection = await db.getConnection();

        const [result] = await connection.query(
            "DELETE FROM Events WHERE event_id = ? AND uid = ?;",
            [id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Event not found.");
        }

        return res.status(200).send("Successfully deleted event.");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    }
    finally {
        if (connection) connection.release();
    }
});