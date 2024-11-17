const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());

//Database Configuration
const dbConfig = {
    user: 'cs330admin',
    password: 'Gr9-3O-2!pU-0dYwa?',
    server: 'cs3300.database.windows.net',
    database: 'your_database_name',
    options: {
        encrypt: true,
        trustServerCertificate: false,
    }
};