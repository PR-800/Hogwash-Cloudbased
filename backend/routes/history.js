const express = require("express");
const pool = require("../config");

router = express.Router();

const { isLoggedIn } = require('../middlewares')

router.get("/history", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {
        const [historyRows, historyField] = await conn.query(
            "SELECT *, DATE_FORMAT(date, '%d-%m-%Y') AS justdate, TIME(date) AS time FROM history WHERE user_id = ? ORDER BY date DESC",
            [req.user.id]
        )
        const [paymentRows, paymentField] = await conn.query(
            "SELECT * FROM payments",
            [historyRows[0].payment_id]
        )
        const [optionRows, optionField] = await conn.query(
            "SELECT * FROM options",
            [historyRows[0].option_id]
        )
        conn.commit()
        console.log(historyRows)
        return res.json({
            history: historyRows,
            payment: paymentRows,
            option: optionRows,
        })
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }

});

// add history
router.post("/history", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    const { payment_choose, wm_choose, option_choose, wm_time } = req.body.params;

    try {
        const [rows, fields] = await conn.query(
            "INSERT INTO history(date, payment_id, wm_id, user_id, option_id) VALUES(CURRENT_TIMESTAMP, ?, ?, ?, ?)",
            [payment_choose, wm_choose, req.user.id, option_choose]
        )

        const [rowsTemp] = await conn.query(
            "SELECT * FROM washing_machine WHERE id = ?",
            [wm_choose]
        )

        console.log(wm_choose)

        const powderNum = +rowsTemp[0].powder - 5
        const softenerNum = +rowsTemp[0].softener - 5

        const [rows2] = await conn.query(
            "UPDATE washing_machine SET status = ?, powder = ?, softener = ?, used_by = ?, time = ? WHERE id = ?",
            [1, powderNum, softenerNum,  req.user.id, wm_time, wm_choose]
        )

        conn.commit()
        return res.json({
            message: 'History added successfully',
            data: rows2
        })
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }

})

// router.post("/history",  async function (req, res, next) {

//     const conn = await pool.getConnection()
//     await conn.beginTransaction();

//     const { payment_choose, wm_choose, option_choose, wm_time } = req.body.params;

//     try {
        
//         const [rowsTemp] = await conn.query(
//             "SELECT * FROM washing_machine WHERE id = ?",
//             [wm_choose]
//             )
            
//             console.log(wm_choose)
            
//             const powderNum = +rowsTemp[0].powder - 5
//             const softenerNum = +rowsTemp[0].softener - 5
            
//             if (powderNum < 0 || softenerNum < 0) {
//                 console.log('น้ำยาหมด กรุณาใช้งานเครื่องถัดไป')
//                 conn.rollback();
//                 return res.json({
//                     message: 'น้ำยาหมด กรุณาใช้งานเครื่องถัดไป'
//                 });
//             }
//             else {
//                 const [rows2] = await conn.query(
//                     "UPDATE washing_machine SET status = ?, powder = ?, softener = ?, used_by = ?, time = ? WHERE id = ?",
//                     [1, powderNum, softenerNum,  req.user.id, wm_time, wm_choose]
//                     )
                    
//                 const [rows, fields] = await conn.query(
//                     "INSERT INTO history(date, payment_id, wm_id, user_id, option_id) VALUES(CURRENT_TIMESTAMP, ?, ?, ?, ?)",
//                     [payment_choose, wm_choose, req.user.id, option_choose]
//                 )
//                 conn.commit()
//                 return res.json({
//                     message: 'History added successfully',
//                     data: rows2
//                 })
//             }


//         } catch (err) {
//             conn.rollback()
//             return res.send(err);
//         } finally {
//             conn.release()
//         }

// })



// get allHistory
router.get("/historylist", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {
        const [allHistory] = await conn.query(
            "SELECT *, DATE_FORMAT(date, '%d-%m-%Y') AS justdate, TIME(date) AS time FROM history ORDER BY date desc"
        )
        const [paymentRows] = await conn.query(
            "SELECT * FROM payments",
            [allHistory[0].payment_id]
        )
        const [optionRows] = await conn.query(
            "SELECT * FROM options",
            [allHistory[0].option_id]
        )
        const [users] = await conn.query(
            "SELECT * FROM users",
            [allHistory[0].user_id]
        )


        conn.commit()
        console.log(allHistory[0])
        return res.json({
            allHistory: allHistory,
            payment: paymentRows,
            option: optionRows,
            users: users,
        })
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }

});
exports.router = router;
