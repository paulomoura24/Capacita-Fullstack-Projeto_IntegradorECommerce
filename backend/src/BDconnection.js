import mysql from "mysql"

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "escola"
})

conn.connect((err) =>{
    if (err) {
        console.log("problema com BD")
        return
    }
    console.log("conectado ao BD")
})

export{conn}