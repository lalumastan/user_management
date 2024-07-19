const db = require('./db');
const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;
const uri = db.uri;
const client = new db.MongoClient(uri, {
    serverApi: {
        version: db.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const secret_key = db.secret_key;
const ROLE_ADMIN = "ROLE_ADMIN";

var dbo = client.db(process.env.USER_MGMT_MONGO_DB);

var expired_token = [];

function send(res, status, message, result) {
    if (!res.headersSent) {
        res.send({
            "status": status,
            "message": message,
            "result": result
        });
    }
}

// verify valid user by checking the jwt information
async function verifyUser(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        //Authorization: 'Bearer TOKEN'
        if (!token || (token && expired_token.includes(token))) {
            console.log("authorization: " + req.headers.authorization);
            throw req.headers.authorization;
        }
        else {
            //Decoding the token
            const decodedToken = jwt.verify(token, secret_key);
            const username = decodedToken.username;
            //console.log("username: " + username);
            //console.log("session_secret: " + decodedToken.session_secret);
            await client.connect();
            return username;
        }
    }
    catch (err) {
        console.log("Invalid Token: " + err);
        send(res, 500, "Not authorized", req.headers);
    }
}

// check if admin
async function isAdmin(req) {
    var isAdmin = false;

    try {
        const token = req.headers.authorization.split(' ')[1];
        //Authorization: 'Bearer TOKEN'
        if (!token || (token && expired_token.includes(token))) {
            console.log("authorization: " + req.headers.authorization);
            throw req.headers.authorization;
        }
        else {
            //Decoding the token
            const decodedToken = jwt.verify(token, secret_key);
            const username = decodedToken.username;
            console.log("username: " + username);
            console.log("session_secret: " + decodedToken.session_secret);
            await client.connect();

            var user = await dbo.collection("users").findOne({ username: username });

            isAdmin = (ROLE_ADMIN == user.authorities);
        }
    }
    catch (err) {
        console.log("Invalid Token: " + err);
    }

    return isAdmin;
}

// get the jwt
function getJwt(user, req) {
    let token = null;
    try {
        //Creating jwt token
        let username = user.username;
        token = jwt.sign(
            {
                username: username,
                session_secret: Buffer.from(req.session.id).toString("base64") + "U" + Buffer.from(username).toString("base64") + "U" + Buffer.from(user.password).toString("base64")
            },
            secret_key,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
    }
    return token;
}

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Date Time: ', new Date())
    next();
});

// define the login route
router.post('/auth/login', async function (req, res) {
    var message = "User not found";
    try {
        await client.connect();
        user = await dbo.collection("users").findOne({ username: req.body.username });
        if (user != null) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                status = 200;
                message = "success";
                result = { "token": getJwt(user, req), "username": user.username, "firstName": user.firstName, "lastName": user.lastName, "authorities": user.authorities };
                send(res, status, message, result);
            }
            else
                throw message;
        }
        else
            throw message;
    }
    catch (err) {
        console.dir(err);

        var status = 500;
        var result = null;
        if (err) {
            send(res, status, message, result);
        }
    }
});

// define the users route
router.get('/users', async function (req, res) {
    try {
        await verifyUser(req, res);
        var result = await dbo.collection("users").find({}).toArray();
        send(res, 200, "User list fetched successfully.", result);
    }
    catch (err) {
        send(res, 500, "Error fetching users list: " + err, {});
    }
});

// define the specific user's route
router.get('/users/:_id', async function (req, res) {
    try {
        await verifyUser(req, res);

        if (await isAdmin(req)) {
            var user = await dbo.collection("users").findOne({ _id: parseInt(req.params._id) });
            if (user) {
                send(res, 200, "User fetched successfully.", user);
            }
        }
        else {
            send(res, 403, "Not Authorized", req.headers.authorization);
        }
    }
    catch (err) {
        send(res, 500, "Error fetching user: " + req.params._id, err);
    }
});

// define the add route
router.post('/users/add', async function (req, res) {
    try {
        await verifyUser(req, res);

        if (await isAdmin(req)) {
            var users = await dbo.collection("users").find({}).sort({ "_id": -1 }).limit(1).toArray();

            req.body._id = users != null ? users[0]._id + 1 : 1;
            req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
            await dbo.collection("users").insertOne(req.body);
            send(res, 200, "User saved successfully.", req.body);
        }
        else {
            send(res, 403, "Not Authorized", req.headers.authorization);
        }
    }
    catch (err) {
        send(res, 500, "Error adding user: " + err, req.body);
    }
});

// define the update route
router.put('/users/update', async function (req, res) {
    var result = req.body;
    try {
        await verifyUser(req, res);
        if (await isAdmin(req)) {
            var user = req.body;
            try {
                if (bcrypt.getRounds(req.body.password) == saltRounds) {
                    console.log("Hash is Ok. Password May Not Have Changed.");
                }
                else
                    throw "Hash is not Ok";
            }
            catch (err) {
                console.log("Password May Have Changed: " + err);
                req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
            }
            result = await dbo.collection("users").findOneAndUpdate({ _id: parseInt(user._id) }, { $set: { username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName, age: user.age, salary: user.salary, authorities: user.authorities } });
            send(res, 200, "User updated successfully.", req.body);
        }
        else {
            send(res, 403, "Not Authorized", req.headers.authorization);
        }
    }
    catch (err) {
        send(res, 500, "Error updating user: " + err, result);
    }
});

// define the delete route
router.delete('/users/delete/:_id', async function (req, res) {
    try {
        await verifyUser(req, res);

        if (await isAdmin(req)) {
            await dbo.collection("users").findOneAndDelete({ _id: parseInt(req.params._id) });
            send(res, 200, "User deleted successfully.", null);
        }
        else {
            send(res, 403, "Not Authorized", req.headers.authorization);
        }
    }
    catch (err) {
        send(res, 500, "Error deleting user: " + req.params._id, err);
    }
});

// define the logout route
router.get('/auth/logout', function (req, res) {
    try {
        let username = verifyUser(req, res);
        const token = req.headers.authorization.split(' ')[1];
        console.log("Token: " + token);
        expired_token.push(token);
        console.log("Token Expired: " + JSON.stringify(expired_token));
        if (client != null) {
            client.close();
        }
        send(res, 200, "User logged out successfully.", username);
    }
    catch (err) {
        console.log("Error Logging Out: " + err);
    }
});

module.exports = router;