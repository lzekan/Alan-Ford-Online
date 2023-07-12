const db = require('../db');
const bcrypt = require("bcrypt");

module.exports = class User {
    constructor (username, password, email, firstName, lastName) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.id = undefined;
        this.firstName = firstName;
        this.lastName = lastName;
        this.ppUrl = '../images/af_avatar.jpg';
    }

    //dohvat korisnika na osnovu korisničkog imena
    static async fetchByUsername(username) {

        let results = await dbGetUserByName(username);
        let newUser = new User();

        if( results.length > 0 ) {
            newUser = new User(results[0].username, results[0].password,
                results[0].email, results[0].firstname, results[0].lastname);
            newUser.id = results[0].id;
            newUser.ppUrl = results[0].profilepicture;
        }

        return newUser;
    }

    static async fetchByEmail(email) {

        let results = await dbGetUserByEmail(email);
        let newUser = new User();

        if( results.length > 0 ) {
            newUser = new User(results[0].username, results[0].password,
                results[0].email, results[0].firstname, results[0].lastname);
            newUser.id = results[0].id;
            newUser.ppUrl = results[0].profilepicture;
        }

        return newUser;
    }

    async persist() {
        try {
            let userID = await dbNewUser(this);
            this.id = userID;
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }

    //provjera zaporke
    checkPassword(pass) {
        if(this.password === undefined) return false;

        let match =  bcrypt.compareSync(pass, this.password);
        return match;
    }

    async addProgressToDB(idUser, idComic, page) {
        try {
            await dbAddProgress(idUser, idComic, page);
        } catch (err) {
            throw err;
        }
    }

}

//dohvat korisnika iz baze podataka na osnovu korisničkog imena (stupac username)
dbGetUserByName = async (username) => {
    const sql = `SELECT username, password, email, id, firstname, lastname, profilepicture
    FROM users WHERE username = '` + username + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetUserByEmail = async (email) => {
    const sql = `SELECT username, password, email, id, firstname, lastname, profilepicture
    FROM users WHERE email = '` + email + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbNewUser = async (user) => {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

    const sql = "INSERT INTO users (username, password, email, firstname, lastname, profilepicture) VALUES ('" +
    user.username + "', '" + hash + "', '" + user.email + "', '" +
    user.firstName + "', '" + user.lastName + "', '" + user.ppUrl  + "') RETURNING id";

    const result = await db.query(sql, []);
    return result.rows[0].id;
}

dbAddProgress = async (idUser, idComic, page) => {

    let sql = `SELECT * FROM comics_progress WHERE id_user = ` + idUser + ` AND id_comic = ` + idComic + `;`;
    let result = await db.query(sql, []);

    if(result.rows.length > 0) {
        await db.query(`DELETE FROM comics_progress WHERE id_user = ` + idUser + `AND id_comic = ` + idComic + `;`);
    }

    sql = `INSERT INTO comics_progress VALUES (` + idUser + `, ` + idComic + `, ` + page + `);`;

    try {
        result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}   



