const sql = require("mssql");

const config = {
    user: 'cs330admin',
    password: 'Gr9-3O-2!pU-0dYwa?',
    server: 'cs3300.database.windows.net',
    database: 'CS_330_0'
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
        console.log(result.recordset);

    } catch (error) {
        console.error("Error getting table data:", error);
        
    } finally {
        //Close the connection
        sql.close();
    }
}


//Function to insert table data
async function insertTableData(username, password) {
    try {
        //Connect to the database
        const pool = await sql.connect(config);

        //Create query
        const query = `
            INSERT INTO UserInfo (Username, Password)
            VALUES ('${username}', '${password}')`;

        //Execute query
        const result = await pool.request().query(query);
        console.log("Data inserted successfully:", result);

    } catch (error) {
        console.error("Error inserting data:", error);

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
        console.log("Data removed successfully:", result);

    } catch (error) {
        console.error("Error removing data:", error);

    } finally {
        //Close the connection
        sql.close();
    }
}

//Testing functions

//insertTableData("LukeDuke", "pa$$word");
//removeTableData("LukeDuke");
getTableData();