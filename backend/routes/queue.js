const express = require("express");
const pool = require("../config");

router = express.Router();

const { isLoggedIn } = require('../middlewares')

router.get("/queue/", async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {
        const [queueRows, queueField] = await conn.query("SELECT * FROM queue")
        conn.commit()
        console.log(queueRows)
        return res.json({
            queue: queueRows,
        })
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }

});


router.post("/queue", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    const { wm_id } = req.body;

    try {
        const addQueue = await conn.query(
            `INSERT INTO queue (wm_id, user_id, booking_time) VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [wm_id, req.user.id]
        )

        await conn.commit()
        res.send("queue added successfully !");

    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
    return;
    
});

router.delete("/queue/:id", async function (req, res, next) {

    const conn = await pool.getConnection();
    await conn.beginTransaction();
  
    try {
    //   let setQueue = await conn.query(
    //     `DELETE FROM queue WHERE id = ( SELECT MIN(id) FROM queue WHERE wm_id = ?)`,
    //     [req.params.id]
    //     )

      const [checkQueue] = await conn.query(
        "SELECT COUNT(*) AS number FROM `queue` WHERE `wm_id` = ?",
        [req.params.id]
      );
      console.log(checkQueue);
  
      if (checkQueue[0].number > 0) {
        const [rows1] = await conn.query("SELECT * FROM queue WHERE booking_time = ( SELECT MIN(booking_time) FROM queue WHERE wm_id = ?)" +
        "AND id = ( SELECT MIN(id) FROM queue WHERE wm_id = ?)", 
            [req.params.id, req.params.id]
        );

        const [rows2] = await conn.query("DELETE FROM queue WHERE booking_time = ( SELECT MIN(booking_time) FROM queue WHERE wm_id = ?)"+
        "AND id = ( SELECT MIN(id) FROM queue WHERE wm_id = ?) AND status = ?", 
            [req.params.id, req.params.id, 0]
        );

        if (rows2.affectedRows === 1) {
            await conn.commit();
            return res.json({
              nextQueue: rows1[0]
            });
        } 
      }
    } catch (err) {
      console.log(err)
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  });

// //pending queue
// router.put("/queue/:id/:status", async function (req, res, next) {

//   const conn = await pool.getConnection();
//   await conn.beginTransaction();

//   try {
//     const [rows1] = await conn.query("UPDATE washing_machine SET status = ? WHERE id = ?", 
//         [req.params.status, req.params.id]
//     );

//     // const [rows2] = await conn.query("UPDATE queue SET status = ? WHERE wm_id = ? AND id = ( SELECT MIN(ID) FROM queue WHERE id = ? )", 
//     //     [2, req.params.id, req.params.id]
//     // );

//     await conn.commit();
//     return res.json(rows1);

//   } catch (err) {
//     console.log(err)
//     await conn.rollback();
//     return res.status(500).json(err);
//   } finally {
//     conn.release();
//   }
// });


exports.router = router;