const sqlite = require('better-sqlite3');

const query = `
DROP TABLE IF EXISTS brawlers;
DROP TABLE IF EXISTS the_flag_is_in_here_1d4c9282775ae0d4d53ad0967693b44d;
CREATE TABLE IF NOT EXISTS brawlers(name TEXT, rarity TEXT);
CREATE TABLE IF NOT EXISTS the_flag_is_in_here_1d4c9282775ae0d4d53ad0967693b44d (flag TEXT);
INSERT INTO brawlers VALUES 
    ('Shelly', 'Common'),
    ('Poco', 'Rare'),
    ('Barley', 'Rare'),
    ('Colt', 'Rare'),
    ('Max', 'Mythic'),
    ('Tara', 'Mythic'),
    ('Mr P', 'Mythic'),
    ('Grey', 'Mythic'),
    ('Grey', 'Epic'),
    ('Cty', 'Epic'),
    ('Bo', 'Epic'),
    ('Bonny', 'Epic'),
    ('Griff', 'Epic'),
    ('Bibi', 'Epic'),
    ('Bazz', 'Chromo'),
    ('Colet', 'Chromo'),
    ('Buster', 'Chromo'),
    ('Sandy', 'Legendary'),
    ('Crow', 'Legendary'),
    ('Spike', 'Legendary');
INSERT INTO the_flag_is_in_here_1d4c9282775ae0d4d53ad0967693b44d (flag) VALUES ('ADM{AmaZingFlag_YouAreREALLY_TOP_Of_BRAWLERS}');
`
const db = new sqlite('sqlite3.db');

db.exec(query);