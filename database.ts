// create a database for the bot channels, which holds the messages and last active time
// the database will use BetterSQLite3

import Database from 'better-sqlite3';
const db = new Database('botdb.sqlite');

interface ChannelRow {
    id: string;
    postText: string;
}

export function initDb() {
    // create a table for the channels
    db.exec(`CREATE TABLE IF NOT EXISTS completedPosts (
    id TEXT PRIMARY KEY,
    postText TEXT
    )`);
}

// update the last active time for a channel
export function updateCompletedPost(postId: string, postText: string) {
    //if the channel is not in the database, add it
    const result = db.prepare(`SELECT id FROM completedPosts WHERE id = ?`).get(postId);
    if (!result) {
        db.prepare(`INSERT INTO completedPosts (id, postText) VALUES (?, ?)`).run(postId, postText);
    } else {
        db.prepare(`UPDATE completedPosts SET postText = ? WHERE id = ?`).run(postText, postId);
    }
}

// get the messages for a channel
export function getHasPosted(postId: string): string {
    const result = db.prepare(`SELECT postText FROM completedPosts WHERE id = ?`).get(postId) as ChannelRow | undefined;
    if (result) {
        return result.postText;
    } else {
        return '';
    }
}
