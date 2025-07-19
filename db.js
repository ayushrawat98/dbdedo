import Database from "better-sqlite3"
class SQL {
    db
    constructor() {
        this.db = new Database("quick.db")
        this.db.pragma('journal_mode = WAL')
        this.db.exec(
            `
                create table if not exists usertablelist (
                    id integer primary key autoincrement,
                    tablename text unique
                );

                CREATE INDEX IF NOT EXISTS idx_usertablelist ON usertablelist(tablename);

                create table if not exists userdata (
                    id integer primary key autoincrement,
                    tablename text,
                    data text
                );

                CREATE INDEX IF NOT EXISTS idx_userdata ON userdata(tablename);

                create table if not exists counter (
                    id integer,
                    tablecount integer,
                    requestcount integer
                );

                insert into counter (tablecount, requestcount) values (0,0);
            `
        )
    }

    setTableCount(){
        return this.db.prepare("UPDATE counter set tablecount = tablecount + 1").run()
    }

    getTableCount(){
        return this.db.prepare("select tablecount from counter").get()
    }

    setRequestCount(){
        return this.db.prepare("Update counter set requestcount = requestcount + 1").run()
    }

    getRequestCount(){
        return this.db.prepare("select requestcount from counter").get()
    }

    insertTableList(tablename){
        return this.db.prepare(`INSERT INTO usertablelist (tablename) VALUES (?)`).run(tablename);
    }

    checkTableList(tablename){
        return this.db.prepare(`SELECT * FROM usertablelist where tablename = ?`).get(tablename)
    }

    /**Not used */
    // getTableCount(){
    //     return this.db.prepare(`SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';`).get()
    // }

    /**Not used */
    createTable(tablename){
        this.db.exec(
            `
                create table if not exists ${tablename} (
                    id integer primary key autoincrement,
                    data text
                )
            `
        )
    }

    getData(tablename) {
        return this.db.prepare(`SELECT id, data FROM userdata where tablename = ? limit 50 offset 0`).all(tablename);
    }

    getDataById(tablename, id) {
        return this.db.prepare(`SELECT id, data FROM userdata where id = ? and tablename = ?`).get(id, tablename)
    }

    insertData(tablename, data) {
        return this.db.prepare(`INSERT INTO userdata (data, tablename) VALUES (?, ?)`).run(data, tablename);
    }

    putPatchData(tablename, data, id) {
        return this.db.prepare(`UPDATE userdata SET data = ? WHERE id = ? and tablename = ?`).run(data, id, tablename);
    }

    deleteData(tablename, id) {
        return this.db.prepare(`DELETE from userdata WHERE id = ? and tablename = ?`).run(id, tablename);
    }

}

const DB = new SQL()

export default DB