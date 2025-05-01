import { Router } from 'express';
import { db } from './../index.js';
import { checkAuth } from '../auth/auth-middleware.js';

export const tasksRouter = new Router();

// Get all tasks for a student
tasksRouter.get("/api/tasks", checkAuth, async (req, res) => {
    const uid = req.user.id;
    let connection;
    let tasks;

    try {
        connection = await db.getConnection();
        [tasks] = await connection.query(
            `SELECT * FROM Tasks WHERE uid = ?;`,
            [uid]
        );

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    } finally {
        if (connection) connection.release();
    }
    if (tasks.length === 0) {
        return res.status(204).send();
    } 
    return res.status(200).send(tasks);
});

// Create a new task
tasksRouter.post("/api/tasks", checkAuth, async (req, res) => {
    const uid = req.user.id;
    const { task_name, task_type, date, time, status = 'Working', priority = 'Medium', event_id = null } = req.body;

    if (!task_name || !task_type) {
        return res.status(400).send("Missing fields.");
    }

    const allowedTypes = ['Coursework', 'Work', 'Club', 'Other'];
    const allowedStatus = ['Working', 'Completed', 'Not Started'];
    const allowedPriority = ['Low', 'Medium', 'High'];

    if (!allowedTypes.includes(task_type)) {
        return res.status(400).send("Invalid task_type.");
    }
    if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status.");
    }
    if (!allowedPriority.includes(priority)) {
        return res.status(400).send("Invalid priority.");
    }

    let connection;
    try {
        connection = await db.getConnection();

        const [result] = await connection.query(
            `INSERT INTO Tasks 
            (uid, task_name, task_type, date, time, status, priority, event_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [uid, task_name, task_type, date || null, time || null, status, priority, event_id]
        );

        return res.status(201).send({
            task_id: result.insertId,
            uid,
            task_name,
            task_type,
            date,
            time,
            status,
            priority,
            event_id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    } finally {
        if (connection) connection.release();
    }
});

// Update a existing task
tasksRouter.put("/api/tasks/:id", checkAuth, async (req, res) => {
    const uid = req.user.id;
    const { id } = req.params;

    const { task_name, task_type, date, time, status, priority, event_id } = req.body;

    if (!task_name || !task_type || !status || !priority) {
        return res.status(400).send("Missing fields.");
    }

    const allowedTypes = ['Coursework', 'Work', 'Club', 'Other'];
    const allowedStatus = ['Working', 'Completed', 'Not Started'];
    const allowedPriority = ['Low', 'Medium', 'High'];

    if (!allowedTypes.includes(task_type)) {
        return res.status(400).send("Invalid task_type.");
    }
    if (status && !allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status.");
    }
    if (priority && !allowedPriority.includes(priority)) {
        return res.status(400).send("Invalid priority.");
    }

    let connection;

    try {
        connection = await db.getConnection();

        const [result] = await connection.query(
            `UPDATE Tasks 
             SET task_name = ?, task_type = ?, date = ?, time = ?, status = ?, priority = ?, event_id = ?
             WHERE task_id = ? AND uid = ?;`,
            [task_name, task_type, date || null, time || null, status || 'Working', priority || 'Low', event_id || null, id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Task not found.");
        }

        return res.status(200).send("Task updated successfully.");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    } finally {
        if (connection) connection.release();
    }
});

// Delete a task
tasksRouter.delete("/api/tasks/:id", checkAuth, async (req, res) => {
    const uid = req.user.id;
    const { id } = req.params;

    let connection;

    try {
        connection = await db.getConnection();

        const [result] = await connection.query(
            `DELETE FROM Tasks WHERE task_id = ? AND uid = ?;`,
            [id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Task not found");
        }

        return res.status(200).send("Task deleted successfully.");
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).send("Server error.");
    } finally {
        if (connection) connection.release();
    }
});
