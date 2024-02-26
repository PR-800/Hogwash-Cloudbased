const express = require("express");
const pool = require("../config");

const { isLoggedIn } = require('../middlewares')

router = express.Router();

router.get("/contact", isLoggedIn, async function (req, res, next) {

    try {
        const [rows1, fields1] = await pool.query("SELECT path FROM images");
        return res.json({
            images: rows1,
        });
    } catch(err) {
        return res.status(500).json(err);
    }
});

// contactBox
router.post("/contact", isLoggedIn, async function (req, res, next) {

    const feedbackTitle = req.body.feedbackTitle;
    const feedbackDes = req.body.feedbackDes;

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {

        const [rows1, fields1] = await conn.query(
            'INSERT INTO `feedback` (`user_id`, `title`, `description`, `feedback_date`) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [req.user.id, feedbackTitle, feedbackDes]
        )
        
        await conn.commit()
        return res.json({
            message : 'Send feedback successfully'
        })
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err)
    } finally {
        console.log('finally')
        conn.release();
    }

})

exports.router = router;
