import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseService{
    constructor(private sqlite: SQLite){}

    public query(query:string, onSuccess:Function, onFailed:Function){
        this.sqlite.create({
            name: 'umnspa',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql(query, {})
                .then((data) => onSuccess(data))
                .catch(e => {console.log(e); onFailed();});
        })
        .catch(e => {console.log(e); onFailed();});
    }

    public initDatabase(){
        // Ntar bikin tabel
        this.query("CREATE TABLE IF NOT EXISTS tbl_user (id TEXT)",
        ()=>{
            console.log("table created");
        }, ()=>{
            console.log("table uncreated");
        });
    }

    public testDB(){
        this.query("SELECT id FROM tbl_user",
        ()=>{
            console.log("query jalan");
        },
        ()=>{
            console.log("query ga jalan");
        });
    }
}