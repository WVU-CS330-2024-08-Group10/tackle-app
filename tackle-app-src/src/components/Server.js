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

//Express variables
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());


//Hashing variables
const bcrypt = require("bcrypt");
const saltRounds = 10;
let saltString = "";
let hashedPassword = "";


//Function to check for username in database
async function checkForUsername(username) {

    try {
        //Connect to the database
        const pool = await sql.connect(config);

        //Create query
        const query = `SELECT Username FROM UserInfo WHERE Username='${username}'`;

        //Execute query
        const result = await pool.request().query(query);

        //Close connection
        await sql.close();

        //Check for username
        console.error(`${username} usernames in database: ` + result.recordset.length);
        if(result.recordset.length > 0){
            console.log("Username is already in use", "\n");
            return true;
        }
        else{
            return false;
        }

    } catch (error) {
        console.error("Error checking for username:", error, "\n");
        return false;
    }
}


//Creating route to insert profile picture for user
// app.post("/api/insertPFP", async (req, res) => {

//     const { username, image } = req.body;

//     try {
//         //Connect to the database
//         const pool = await sql.connect(config);

//         //Create query
//         const query = `INSERT INTO UserInfo Image VALUE '${image}' WHERE Username='${username}'`;

//         //Execute query
//         const result = await pool.request().query(query);
//         console.log("PFP saved!");
//         res.status(200).send("PFP saved!");

//         //Close connection
//         sql.close();
//         return true;

//     } catch (error) {
//         res.status(500).send("Server Error");

//     }
// });


//Creating route to insert user
app.post("/api/insertUser", async (req, res) => {

    const { username, password } = req.body;

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
        return false;
    }

    try {
        //Check to see if username is already in use
        if(await checkForUsername(username)){
            console.log("Account can't be created. Username already exists.");
            res.status(401).send("Username already exists");
            return false;
        }
        else{
            //Hash password
            const genSalt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, genSalt);
            hashedPassword = hash;
            saltString = genSalt;

            //Connect to the database
            const pool = await sql.connect(config);

            //Create query
            const query = `INSERT INTO UserInfo (Username, Password, Salt) VALUES ('${username}', '${hashedPassword}', '${saltString}')`;

            //Execute query
            const result = await pool.request().query(query);
            console.log("Account created!");
            res.status(200).send("Account Created!");

            //Close connection
            await sql.close();
            return true;
        }

    } catch (error) {
        res.status(500).send("Server Error");

    }
});


//Creating route to remove user account
app.post("/api/removeUser", async (req, res) => {

    const { username } = req.body;

    try {
        //Check if username even exists
        if(await checkForUsername(username) === false){
            console.log("Account can't be deleted. Username doesn't exist.");
            res.status(401).send("Username doesn't exist");
            return false;
        }
        else{
            //Connect to database
            const pool = await sql.connect(config);

            //Create query
            const query = `DELETE FROM UserInfo WHERE Username='${username}'`;

            //Execute query
            await pool.request().query(query);
            console.log("Account Deleted!");
            res.status(200).send("Account Deleted!");

            //Close connection
            await sql.close();
            return true;
        }

    } catch (error) {
        res.status(500).send("Server Error");
    }
});


//Creating route to authenticate user
app.post("/api/authenticate", async (req, res) => {

    const { username, password } = req.body;

    try {
        //Check if username even exists
        if(await checkForUsername(username) === false){
            console.log("Authentication failed. Username doesn't exist.");
            res.status(401).send("Username doesn't exist");
            return false;
        }
        else{
            //Connect to the database
            const pool = await sql.connect(config);

            //Create query
            const userQuery = `SELECT * FROM UserInfo WHERE Username='${username}'`;

            //Execute query
            const userResult = await pool.request().query(userQuery);

            //Close connection
            await sql.close();

            //Check given password with password in record
            if(await bcrypt.compare(password, userResult.recordset[0].Password.trim())){
                console.log("Authenticated!");
                res.status(200).send("Authenticated!");
                return true;
            }
            else{
                console.log("Authentication failed");
                res.status(401).send("Invalid username/password");
                return false;
            }
        }

    } catch (error) {
        res.status(500).send("Server Error");
    }
});

//Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});