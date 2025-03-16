CREATE TABLE IF NOT EXISTS users (
    user_id	INTEGER NOT NULL UNIQUE,
    username	TEXT NOT NULL,
    user_high_score INTEGER DEFAULT 0,
    PRIMARY KEY(user_id AUTOINCREMENT)
);

    

