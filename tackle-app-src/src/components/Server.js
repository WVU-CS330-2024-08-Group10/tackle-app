//Get user information//

//SQL Database variables
const sql = require("mssql");
const config = {
    user: "cs330admin",
    password: "Gr9-3O-2!pU-0dYwa?",
    server: "cs3300.database.windows.net",
    database: "CS_330_0"
};

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

    //Check to see if username is already in use
    if(await checkForUsername(username) === true){
        return;
    }

    //Hash user information//
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    saltString = "";
    hashedPassword = "";

    //Hash password
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            hashedPassword = hash;
            saltString = salt;
        });
    });

    try {
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
        if(result.recordset.length === 1){
            console.log("Username is already in use", "\n");
            sql.close();
            return true;
        }

    } catch (error) {
        console.error("Error checking for username:", error, "\n");

    } finally {
        //Close the connection
        sql.close();
    }
}


//Function to check for password in database
async function checkForPassword(username, salt) {
    try {
        //Connect to the database
        const pool = await sql.connect(config);

        //Create query
        const saltQuery = `SELECT Salt FROM UserInfo WHERE Salt='${salt}'`;

        //Execute query
        const saltResult = await pool.request().query(saltQuery);
        
        //Check if salt exists in database
        if(saltResult.recordset.length === 1){
            console.log("Salt was found in database", "\n");
            
            //Create query
            const userQuery = `SELECT * FROM UserInfo WHERE Username='${username}'`;

            //Execute query
            const userResult = await pool.request().query(userQuery);

            //Check if username and salt belong both belong to same record
            if(userResult.recordset[0].Username.trim() === username && userResult.recordset[0].Salt.trim() === salt){
                console.log("Username and salt belong to the same record. Person authenticated!", "\n");
                sql.close();
                return true;
            }else{
                console.log("Username and salt do not belong to the same record", "\n");
            }
        }

    } catch (error) {
        console.error("Error checking for password:", error, "\n");

    } finally {
        //Close the connection
        sql.close();
    }
}


//Execute functions in a sequence
async function sequence() {
    try {
        //await removeAllTableData();
        await insertTableData("TyCraft", "password");
        await insertTableData("LukeDuke", "password");
        await checkForPassword("LukeDuke", "$2b$10$KVn5BDhJqSpMISxKfj8jdO");
        await getTableData();

    } catch (error) {
        console.error('Error:', error);
    }
}

sequence();