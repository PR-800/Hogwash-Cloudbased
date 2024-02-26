const express = require("express");
const pool = require("../config");
const Joi = require('joi')
const { generateToken } = require("../utils/token");
const { isLoggedIn } = require('../middlewares')

router = express.Router();

const passwordValidator = (value, helpers) => {
    if (value.length < 6) {
        throw new Joi.ValidationError('Password must contain at least 6 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}

const signupSchema = Joi.object({
    signUpEmail: Joi.string().required().email(),
    signUpPassword: Joi.string().required().custom(passwordValidator),
    confirm_password: Joi.string().required().valid(Joi.ref('signUpPassword')), 
})

const loginSchema = Joi.object({
    loginEmail: Joi.string().required(),
    loginPassword: Joi.string().required()
})

// show all users
router.get("/user", async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    try {
        const [rows, field] = await conn.query(
            "SELECT * FROM users",
        )
        conn.commit()
        return res.json(rows)
    } catch (err) {
        conn.rollback()
        return res.send(err);
    } finally {
        conn.release()
    }
    
});

// update password
router.put("/user/:id", async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    const { currentPassword, newPassword, confirm_newPassword } = req.body;
    
    try {
        const [rows, field] = await conn.query(
            "SELECT password FROM users WHERE id = ?", [req.params.id]
        )
        // console.log(rows[0].password + " // " + currentPassword)
        if (rows[0].password != currentPassword || newPassword != confirm_newPassword) {
            throw new Error('Incorrect password')
            // return res.json({
            //     message: "Incorrect password"
            // })
        }
        else {
            const [rows, field] = await conn.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [newPassword, req.params.id]
            )
            console.log(rows)
            conn.commit()
            return res.json({
                message: "Updated"
            })
        }
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }
});

// sign up
router.post("/user/signup", async function (req, res, next) {

    try {
        await signupSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    const { signUpEmail, signUpPassword } = req.body;

    try {
        const [rowsCheck, fieldsCheck] = await pool.query(
            "SELECT email FROM users WHERE email = ?",
            [signUpEmail]
        )
        if (rowsCheck.length > 0) {
            throw new Error('This email is already used')
            // return res.json({
            //     message: 'This email is already used',
            // })
        }
        else {
            const [rows, fields] = await conn.query(
                "INSERT INTO users(email, password) VALUES(?, ?)",
                [signUpEmail, signUpPassword]
            )
            conn.commit()
            return res.json({
                message: 'Sign Up Successfully',
            })
        } 
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }

})

// login
router.post("/user/login", async function (req, res, next) {
    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const conn = await pool.getConnection()
    await conn.beginTransaction();

    const { loginEmail, loginPassword } = req.body;

    try {
        const [userCheck] = await conn.query(
            'SELECT * FROM users WHERE email = ?', 
            [loginEmail]
        )

        console.log(userCheck[0])

        if (!userCheck[0] || userCheck[0].password != loginPassword) {  
            throw new Error('Incorrect email or password')        
        }
        else {
            // Check if token already existed
            const [tokens] = await conn.query(
                'SELECT * FROM tokens WHERE user_id=?', 
                [userCheck[0].id]
            )
            let token = tokens[0]?.token
            if (!token) {
                // Generate and save token into database
                token = generateToken()
                await conn.query(
                    'INSERT INTO tokens(user_id, token) VALUES (?, ?)', 
                    [userCheck[0].id, token]
                )
            }
            conn.commit()
            return res.json({
                token: token
            })
        }
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }
})

// specific user who logged in
router.get('/user/me', isLoggedIn, async (req, res, next) => {
    // req.user ถูก save ข้อมูล user จาก database ใน middleware function "isLoggedIn"
    res.json(req.user)
})

exports.router = router;
