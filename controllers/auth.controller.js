const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// var redis = require('redis');
// var JWTR = require('jwt-redis').default;
// var redisClient = redis.createClient();
// var jwtr = new JWTR(redisClient);

router.post("/register", async (req, res) => {
    // Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email } = req.body;
        var { password } = req.body

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            return res.status(400).send("All input are required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        password = password.toString();
        password = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password
        });

        //Create token jwt
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        //create token jwtr
        // const token1 = '';
        // jwtr.sign({ user_id: user._id, email }, process.env.TOKEN_KEY)
        //     .then((token) => {
        //         token1 = token;
        //     })
        //     .catch((error) => {
        //         // error handling
        //         console.log(error)
        //     });
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

router.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "30s",
                }
            );

            // const token1 = '';
            // jwtr.sign({ user_id: user._id, email }, process.env.TOKEN_KEY)
            //     .then((token) => {
            //         token1 = token;
            //     })
            //     .catch((error) => {
            //         // error handling
            //         console.log(error)
            //     });
            // save user token
            user.token = token;
            // user
            return res.cookie('jwt', token, { maxAge: 900000, httpOnly: true }).status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

router.post('/logout', async (req, res) => {
    token = req.body.token || req.headers["Authorization"] || req.cookies['jwt'];
    // jwt.destroy(token)
    res.clearCookie('jwt').send('Loggout Successful')
})

module.exports = router