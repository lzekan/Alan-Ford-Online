const db = require('../db');

module.exports = class Comic {
    constructor (id, title, pages) {
        this.id = id;
        this.title = title;
        this.pages = pages;
    }

    static async fetchById(id){
        let comic = await dbGetComicById(id);
        let newComic = new Comic();

        let pages = [];

        for(let i = 0; i < comic.length; i++){
            pages.push(comic[i].page);
        }

        newComic = new Comic(comic[0].id, comic[0].title, pages);
        
        return newComic;
    }
}

dbGetComicById = async (id) => {

    const sql = `SELECT comics_info.id id, comics_info.title title, comics_pages.ref page FROM comics_info LEFT JOIN comics_pages 
        ON comics_info.id = comics_pages.id WHERE comics_info.id = ` + id + `ORDER BY page`;
    
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }

}