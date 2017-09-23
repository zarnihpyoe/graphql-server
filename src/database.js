import sqlite from 'sqlite3'

import { users, usersFriends, posts } from './tables'

const db = new sqlite.Database('./db.sqlite')

export const getSql = query => {
    return new Promise((resolve, reject) => {
        console.log(query.text)
        console.log(query.values)
        db.all(query.text, query.values, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}