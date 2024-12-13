const reqs = require("./AccountReqs.json");

//SQL Database variables
const sql = require("mssql");
require("dotenv").config({ path: "../../.env" }); //Loading variables from .env file
const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVERNAME,
    database: process.env.DATABASENAME
};
const secret = process.env.SECRET;

//Express variables
const express = require("express");
const multer = require("multer");
const exp = express();
exp.use(express.json());

//CORS configuration (only allow requests from localhost:3000, only allow POST methods, allow cookies)
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["POST"],
    credentials: true,
  };
exp.use(cors(corsOptions));

//Set up multer for handling image uploads
const storage = multer.memoryStorage(); //Store file in memory as buffer
const upload = multer({ storage: storage });

//Hashing variables
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const saltRounds = 10;
let saltString = "";
let hashedPassword = "";

//Function for verifying token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const tokIN = jwt.verify(token, secret);
        req.username = tokIN.username;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

//Route for logging in from token
exp.post("/verifyToken", verifyToken, async (req, res) => {
    res.status(200).json({username: req.username});
});

//Route to upload an image as binary data
exp.post("/uploadPFP", verifyToken, upload.single("pfp"), async (req, res) => {

    const file = req.file;
    const { pfpFileType, username } = req.body;

    let error = 0;
    // check if file is of valid type (image file only)
    if (!reqs.pfp.allowedTypes.includes(pfpFileType)) error |= reqs.error.FILE_TYPE;
    // check if file is of valid size
    if (file.size > reqs.pfp.maxSizeMB * 1024 * 1024) error |= reqs.error.MAX_SIZE;

    if (error > 0) {
        console.log("Error uploading pfp: pfp doesn't meet minimum requirements");
        res.status(401).send("pfp doesn't meet minimum requirements");
    }

    try {
        const pool = await sql.connect(config);

        //Get the binary data
        const fileBuffer = file.buffer;

        //Create query
        const query = `UPDATE UserInfo SET [pfp]=@pfp, [pfpFileType]=@pfpFileType WHERE Username=@username;`;

        //Execute query
        await pool.request()
                    .input('username', sql.NVarChar, username) //username
                    .input('pfpFileType', sql.NVarChar, pfpFileType) // pfp type string
                    .input('pfp', sql.VarBinary, fileBuffer) //pfp as binary data
                    .query(query);

        //Close connection
        res.status(200).send("PFP was inserted!");
        await sql.close();

    } catch (err) {
        console.log("Error uploading pfp: " + err);
    }
});


//Function to check for username in database
async function checkForUsername(username) {

    try {
        //Connect to the database
        const pool = await sql.connect(config);

        //Create query
        const query = `SELECT Username FROM UserInfo WHERE Username=@username;`;

        //Execute query
        const result = await pool.request()
                                    .input('username', sql.NVarChar, username) //username
                                    .query(query);

        //Close connection
        await sql.close();

        //Check for username
        console.error(`${username} usernames in database: ` + result.recordset.length);
        if(result.recordset.length > 0){
            console.log("Username is already in use", "\n");
        }
    } catch (error) {
        console.error("Error checking for username:", error, "\n");
    }
}


//Route to load user information
exp.post("/loadUserInfo", verifyToken, async (req, res) => {

    const { username } = req.body;

    try {
        const pool = await sql.connect(config);

        //Create query
        const query = `SELECT * FROM UserInfo WHERE Username=@username;`;

        //Execute query
        const result = await pool.request()
                                    .input('username', sql.NVarChar, username) //username
                                    .query(query);

        //Close connection
        res.status(200).json(result.recordset[0]);
        await sql.close();

    } catch (error) {
        res.status(500).send("Server Error: Loading user info");
    }
});


//Route to add dark/light mode preference for user account
exp.post("/updateUserInfo", verifyToken, async (req, res) => {

    const { username, darkmode, nickname, gender, fishlist } = req.body;

    try {
        const pool = await sql.connect(config);

        //Convert fishlist to JSON
        const jsonFishlist = JSON.stringify(fishlist);
        
        //Create query
        const query = `UPDATE UserInfo SET [darkmode]=@darkmode, [nickname]=@nickname, [gender]=@gender, [fishlist]=@fishlist WHERE Username=@username;`;

        //Execute query
        await pool.request()
                        .input('darkmode', sql.Bit, darkmode) //darkmode
                        .input('nickname', sql.NVarChar, nickname) //nickname
                        .input('gender', sql.NVarChar, gender) //gender
                        .input('fishlist', sql.NVarChar, jsonFishlist) //fishlist
                        .input('username', sql.NVarChar, username) //username
                        .query(query);
        
        //Close connection
        res.status(200).send("User info updated!");
        await sql.close();

    } catch (error) {
        res.status(500).send("Server Error: Updating user info");
    }
});


//Route to insert user
exp.post("/insertUser", async (req, res) => {

    const { username, password, darkmode, nickname, gender, fishlist } = req.body;

    let error = 0;

    // check if meets minimum length
    if (username.length < reqs.username.minLength) error |= reqs.error.MIN_LENGTH;
    // check if meets maximum length
    if (username.length > reqs.username.maxLength) error |= reqs.error.MAX_LENGTH;
    // check if is alphanumeric, underscore, or dash
    if (!username.match(reqs.username.regEx)) error |= reqs.error.REGEX;

    // check if meets minimum length
    if (password.length < reqs.password.minLength) error |= reqs.error.MIN_LENGTH;
    // check if meets maximum length
    if (password.length > reqs.password.maxLength) error |= reqs.error.MAX_LENGTH;
    // check if only ASCII
    if (!password.match(reqs.password.regExOnlyASCII)) error |= reqs.error.REGEX_ASCII;
    // check if no spaces
    if (!password.match(reqs.password.regExNoSpaces)) error |= reqs.error.REGEX_SPACES;

    if (error > 0) {
        console.log("Account can't be created. Username/password doesn't meet minimum requirements.");
        res.status(401).send("Username/password doesn't meet minimum requirements");
    }

    try {
        //Check to see if username is already in use
        if(await checkForUsername(username)){
            console.log("Account can't be created. Username already exists.");
            res.status(401).send("Username already exists");
        }
        else{
            //Hash password
            const genSalt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, genSalt);
            hashedPassword = hash;
            saltString = genSalt;

            //Connect to the database
            const pool = await sql.connect(config);

            //Convert fishlist to JSON
            const jsonFishlist = JSON.stringify(fishlist);

            //Create query
            const query = `INSERT INTO UserInfo (Username, Password, Salt, darkmode, nickname, gender, fishlist) VALUES (@username, @password, @salt, @darkmode, @nickname, @gender, @fishlist);`;

            //Execute query
            const result = await pool.request()
                        .input('username', sql.NVarChar, username) //username
                        .input('password', sql.Char, hashedPassword) //password
                        .input('salt', sql.Char, saltString) //salt
                        .input('darkmode', sql.Bit, darkmode) //darkmode
                        .input('nickname', sql.NVarChar, nickname) //nickname
                        .input('gender', sql.NVarChar, gender) //gender
                        .input('fishlist', sql.NVarChar, jsonFishlist) //fishlist
                        .query(query);

            //Close connection
            console.log("Account created!");
            const token = jwt.sign({ username }, secret);
            res.status(200).json({ token });
            await sql.close();
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error: Creating account");
    }
});


//Route to remove user account
exp.post("/removeUser", async (req, res) => {

    const { username } = req.body;

    try {
        //Check if username even exists
        if(await checkForUsername(username) === false){
            console.log("Account can't be deleted. Username doesn't exist.");
            res.status(401).send("Username doesn't exist");
        }
        else{
            //Connect to database
            const pool = await sql.connect(config);

            //Create query
            const query = `DELETE FROM UserInfo WHERE Username=@username;`;

            //Execute query
            await pool.request()
                        .input('username', sql.NVarChar, username) //username
                        .query(query);

            //Close connection
            console.log("Account Deleted!");
            res.status(200).send("Account Deleted!");
            await sql.close();
        }

    } catch (error) {
        res.status(500).send("Server Error: Deleting account");
    }
});


//Route to authenticate user
exp.post("/authenticate", async (req, res) => {

    const { username, password } = req.body;

    try {
        //Check if username even exists
        if(await checkForUsername(username) === false){
            console.log("Authentication failed. Username doesn't exist.");
            res.status(401).send("Username doesn't exist");
        }
        else{
            //Connect to the database
            const pool = await sql.connect(config);

            //Create query
            const query = `SELECT * FROM UserInfo WHERE Username=@username;`;

            //Execute query
            const userResult = await pool.request()
                                            .input('username', sql.NVarChar, username) //username
                                            .query(query);

            //Close connection
            await sql.close();

            //Check given password with password in record
            if(await bcrypt.compare(password, userResult.recordset[0].Password.trim())){
                console.log("Authenticated!");
                const token = jwt.sign({ username }, secret);
                res.status(200).json({ token });
            }
            else{
                console.log("Authentication failed");
                res.status(401).send("Invalid username/password");
            }
        }

    } catch (error) {
        res.status(500).send("Server Error: Authenticating user");
    }
});

//Start the server
const PORT = 5000;
exp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});