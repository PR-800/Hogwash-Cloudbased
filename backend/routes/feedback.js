const express = require("express");
const pool = require("../config");

router = express.Router();

const { isLoggedIn } = require('../middlewares')

router.get("/feedback", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {
        const [feedback] = await conn.query(
            "SELECT *, DATE_FORMAT(feedback_date, '%d-%m-%Y') AS date, TIME(feedback_date) AS feedback_time FROM feedback ORDER BY feedback_date DESC"
        )
        const [email] = await conn.query(
            "SELECT * FROM users",
            [feedback[0].email]
        )

        // console.log(feedback)
        return res.json({
            feedback: feedback,
            email: email,
        })
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }
});

router.get("/feedback/:id", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {
        const [feedbackReader] = await conn.query(
            "SELECT *, DATE_FORMAT(feedback_date, '%d-%m-%Y') AS feedback_date, TIME(feedback_date) AS feedback_time FROM feedback WHERE id=?",
            [req.params.id]
        )
        return res.json({
            feedbackRead:feedbackReader,
        })
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }
});

exports.router = router;