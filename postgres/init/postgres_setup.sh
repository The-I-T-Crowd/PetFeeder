docker cp init.sql postgres:/init.sql
winpty docker exec -ti postgres psql -U postgres postgres -f init.sql
