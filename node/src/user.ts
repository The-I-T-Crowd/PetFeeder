import { Console } from "console";
import { Observable, Subject } from "rxjs";
import { Database } from "./postgres";

export interface IUser {
    id: number;
    name: string;
    email: string;
    dob: Date;
    tankId?: number;
    admin?: boolean;
}

export class User implements IUser {
    id:  number = null;
    name = '';
    email = '';
    dob: Date = null;
    tankId: number = null;
    admin: boolean;

    constructor(id?: number,
                name?: string,
                email?: string,
                dob?: Date,
                tankId?: number,
                admin?: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.dob = dob;
        this.tankId = tankId;
        this.admin = admin;
    }

}

export function getUsers(): Observable<User[]> {
    const db = new Database();
    const results$ : Subject<User[]> = new Subject();
    const query = `
        SELECT * from users;
    `;

    const callback = (results: any[]) => {
        const users: User [] = [];
        for (let row of results) {
            // console.log(row)
            users.push(new User(row.id, row.name, row.email, row.dob, row.tank_id, row.admin));
        }
        results$.next(users);
    }

    db.getQuery(query, callback);
    return results$;
}

export function getUser(id: number): Observable<User> {
    const db = new Database();
    const results$ : Subject<User> = new Subject();
    const query = `
        SELECT * from users
        WHERE ID = ${id};
    `;

    const callback = (results: any[]) => {
        const users: User [] = [];
        for (let row of results) {
            users.push(new User(row.ID, row.NAME, '', row.DOB, row.TANK_ID, row.ADMIN));
        }
        results$.next(users[0]);
    }

    db.getQuery(query, callback);
    return results$;
}

export function createUser(user: User): Observable<User> {
    const db = new Database();
    const results$ : Subject<User> = new Subject();
    const query = `
        INSERT INTO USERS (NAME, EMAIL, TANK_ID, ADMIN) VALUES('${user.name}','${user.email}', ${user.tankId ? user.tankId : null}, ${user.admin ? user.admin : false});
    `;

    const callback = (results: any[]) => {
        results$.next(user);
    }

    db.createQuery(query, callback);
    return results$;
}

export function isValidUser(user: User): boolean {
    return !!(user && user.name && user.email && user.dob);
}
