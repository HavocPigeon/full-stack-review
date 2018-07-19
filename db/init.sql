create table users (
    id serial primary key, 
    auth0_id text unique not null, 
    email text not null, name text not null, 
    picture_url text
    );

create table words (
    id serial primary key, 
    user_id integer references users (id), 
    text text
    );

