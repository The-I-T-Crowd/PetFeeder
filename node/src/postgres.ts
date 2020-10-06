import { Subject } from 'rxjs';

const { Client } = require('pg');
export class Database {
    client = new Client({
        user: 'user',
        host: 'localhost',
        database: 'accounts',
        password: 'password',
        port: 5432,
    });
    
    getQuery: (query: string, callbackFn: (results: any[]) => void) =>  Subject<any> = (query: string, callback: (results: any[]) => void) => {
        this.client.connect();
        const obs: Subject<any> = new Subject();
        this.client.query(query, (err: any, res: any) => {
            if (err) {
                console.error(err);
                obs.next();
            }

            if (callback) {
                callback(res.rows);
            } else {
                console.warn('No call back provided')
            }

            this.client.end();
            obs.next(res.rows);
        });
        return obs;
    }

    createQuery: (query: string, callbackFn: (results: any[]) => void) =>  Subject<any> = (query: string, callback: (results: any[]) => void) => {
        this.client.connect();
        const obs: Subject<any> = new Subject();
        this.client.query(query, (err: any, res: any) => {
            if (err) {
                console.error(err);
                obs.next();
            }

            if (callback) {
                callback(res);
            } else {
                console.warn('No call back provided')
            }

            this.client.end();
            obs.next(res);
        });
        return obs;
    }
}
