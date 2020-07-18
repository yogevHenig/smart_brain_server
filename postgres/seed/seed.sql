BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('a', 'a@a.com', 6, '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$MpnrpHwlXlDoBtxF56/Z/eTseo32gQsaCTLpcwHlvnNYwQgm7hZ1e', 'a@a.com'); -- pass - 123

COMMIT;