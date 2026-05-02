import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const connectDB = async () => {
    try {

        const connection = await db.getConnection();

        console.log("MySQL Database Connected Successfully");

        connection.release();

    } catch (error) {

        console.error("Database connection failed");
        console.error(error);

    }
};

connectDB();


//Only to initialize the TABLE

// const createSchoolsTable = async () => {

//     try {

//         await db.query(`
//       CREATE TABLE IF NOT EXISTS schools (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         address VARCHAR(255) NOT NULL,
//         latitude FLOAT NOT NULL,
//         longitude FLOAT NOT NULL
//       )
//     `);

//         console.log("Schools table ready");

//     } catch (error) {

//         console.error("Table creation failed", error);

//     }

// };

// createSchoolsTable();


export default db;