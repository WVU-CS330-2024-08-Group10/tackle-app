//SQL Database variables
const sql = require("mssql");
const config = {
user: "cs330admin",
password: "Gr9-3O-2!pU-0dYwa?",
server: "cs3300.database.windows.net",
database: "CS_330_0"
};

//Express variables
const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


//Hashing variables
const bcrypt = require("bcrypt");
const saltRounds = 10;
let saltString = "";
let hashedPassword = "";

//Function to fetch table data
async function getTableData() {
    
    try {
        //Connect to database
        const pool = await sql.connect(config);

        //Create query
        const tableName = "UserInfo";
        const query = `SELECT * FROM ${tableName}`;

        //Execute query
        const result = await pool.request().query(query);
        console.log("Table Data:");
        console.log(result.recordset, "\n");

    } catch (error) {
        console.error("Error getting table data:", error, "\n");
        
    } finally {
        //Close the connection
        sql.close();
    }
}


//Function to remove table data
async function removeAllTableData() {

    try {
        //Connect to database
        const pool = await sql.connect(config);

        //Create query
        const query = `DELETE FROM UserInfo`;

        //Execute query
        const result = await pool.request().query(query);
        console.log("All data removed successfully:", result, "\n");

    } catch (error) {
        console.error("Error removing all data:", error, "\n");

    } finally {
        //Close the connection
        sql.close();
    }
}


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
        sql.close();

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


//Creating route to insert user
app.post("/api/insert", async (req, res) => {

    const { username, password } = req.body;

    try {
        //Check to see if username is already in use
        if(await checkForUsername(username)){
            console.log("Account can't be created. Username already exists.");
            res.status(401).send("Username already exists");
            return true;
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
            sql.close();
            return false;
        }

    } catch (error) {
        res.status(500).send("Server Error");

    }
});


//Creating route to remove user account
app.post("/api/remove", async (req, res) => {

    const { username } = req.body;

    try {
        //Check if username even exists
        if(await checkForUsername(username) === false){
            console.log("Account can't be deleted. Username doesn't exist.");
            res.status(401).send("Username doesn't exist");
            return true;
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
            sql.close();
            return false;
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
            return true;
        }
        else{
            //Connect to the database
            const pool = await sql.connect(config);

            //Create query
            const userQuery = `SELECT * FROM UserInfo WHERE Username='${username}'`;

            //Execute query
            const userResult = await pool.request().query(userQuery);

            //Close connection
            sql.close();

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