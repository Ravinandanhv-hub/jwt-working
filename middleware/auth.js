const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    let token =
        req.cookies['jwt'] || req.headers["authorization"] || req.body.token;
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    token = token.toString();
    try {
        const decoded = await jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        // if(decoded){
        //   res.send('Authorized')
        // }
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
    next();
}

module.exports = auth;