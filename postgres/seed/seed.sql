BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('a', 'a@a.com', 6, '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$hJaFKxbZsVXl0g7Rxos3wutp.29lgICIwgT/dDT9XIdoPKlZ7vG2W', 'a@a.com');

COMMIT;