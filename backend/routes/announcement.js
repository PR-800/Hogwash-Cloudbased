const express = require("express");
const pool = require("../config");

router = express.Router();

const { isLoggedIn } = require('../middlewares')


router.get("/announcement", async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {
        const [announcement] = await conn.query(
            "SELECT * FROM announcement WHERE id = (SELECT MAX(id) FROM announcement)"
        )

        // console.log(feedback)
        return res.json({
            announcement: announcement,
        })
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }
});

router.post("/announcement", isLoggedIn, async function (req, res, next) {

    const announce = req.body.announce;

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {

        console.log('req.user.id', req.user.id)
        const [rows1, fields1] = await conn.query(
            'INSERT INTO `announcement` (`user_id`, `announce`, `date`) VALUES (?, ?, CURRENT_TIMESTAMP)',
            [req.user.id, announce]
        )
        
        await conn.commit()
        return res.json({
            message : 'Send announcement successfully'
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