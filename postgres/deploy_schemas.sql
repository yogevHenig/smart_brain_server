-- Deploy fresh dataBase tables

-- i for excecute 
\i '/docker-entrypoint-initdb.d/tables/users.sql';
\i '/docker-entrypoint-initdb.d/tables/login.sql';

\i '/docker-entrypoint-initdb.d/seed/seed.sql';