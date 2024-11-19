//SQL Database variables
const express = require("express");
const sql = require("mssql");
const config = {
user: "cs330admin",
password: "Gr9-3O-2!pU-0dYwa?",
server: "cs3300.database.windows.net",
database: "CS_330_0"
};
const app = express();
app.use(express.json());

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


//Function to insert table data
async function insertTableData(username, password) {

    try {
        //Check to see if username is already in use
        if(await checkForUsername(username)){
            return false;
        }

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
        console.log("Data inserted successfully:", result, "\n");

    } catch (error) {
        console.error("Error inserting data:", error, "\n");

    } finally {
        //Close the connection
        sql.close();
    }
}


//Function to remove table data
async function removeTableData(username) {

    try {
        //Connect to database
        const pool = await sql.connect(config);

        //Create query
        const query = `DELETE FROM UserInfo WHERE Username='${username}'`;

        //Execute query
        const result = await pool.request().query(query);
        console.log("Data removed successfully:", result, "\n");

    } catch (error) {
        console.error("Error removing data:", error, "\n");

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
        
        //Check for username
        console.error(`${username} usernames in database: ` + result.recordset.length);
        if(result.recordset.length > 0){
            console.log("Username is already in use", "\n");
            return true;
        }

    } catch (error) {
        console.error("Error checking for username:", error, "\n");

    } finally {
        //Close the connection
        sql.close();
    }
}


//Function to authenticate user
async function authenticateUser(username, password) {

    try {
        //Check if username even exists
        if(await !checkForUsername(username)){
            console.log("Username does not exist.", "\n");
            return false;
        }

        //Connect to the database
        const pool = await sql.connect(config);

        //Create query
        const userQuery = `SELECT * FROM UserInfo WHERE Username='${username}'`;

        //Execute query
        const userResult = await pool.request().query(userQuery);

        //Check given password with password in record
        if(await bcrypt.compare(password, userResult.recordset[0].Salt.trim())){
            console.log("Username and password belong to the same record. Person authenticated!", "\n");
        }
        else{
            console.log("Username and password do not belong to the same record.", "\n");
        }

    } catch (error) {
        console.error("Error checking for password:", error, "\n");

    } finally {
        //Close the connection
        sql.close();
    }
}


//Execute functions in a sequence (just for testing Server.js)
async function sequence() {
    try {
        //await removeAllTableData();
        await insertTableData("TyCraft", "password1");
        await insertTableData("LukeDuke", "password2");
        await insertTableData("LukeDuke", "sfsdf");
        await insertTableData("user", "pass");
        await authenticateUser("LukeDuke", "password2");
        await getTableData();

    } catch (error) {
        console.error('Error:', error);
    }
}

//sequence();