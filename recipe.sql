CREATE TABLE chef
(id        SERIAL        PRIMARY KEY
,username  VARCHAR(200)  NOT NULL 
,password  VARCHAR(255)  NOT NULL
,UNIQUE (username)
);

CREATE TABLE category
(id            SERIAL      PRIMARY KEY
,category_name VARCHAR(255) NOT NULL
,UNIQUE (category_name)
);

CREATE TABLE recipe 
(id          SERIAL      PRIMARY KEY
,chef_id     INTEGER     REFERENCES chef(id)     NOT NULL
,category_id INTEGER     REFERENCES category(id) NOT NULL
,f2f_rid     INTEGER                             NOT NULL
,recipe_name VARCHAR(200)                        NOT NULL
,source      TEXT                                NOT NULL
,imageURL    TEXT                                NOT NULL
, UNIQUE (f2f_rid)
);

CREATE TABLE ingredients
(id          SERIAL       PRIMARY KEY
,recipe_id   INTEGER      REFERENCES recipe(id) NOT NULL
,ingredient  VARCHAR(255) NOT NULL

);

CREATE TABLE favorite
(id          SERIAL       PRIMARY KEY
,chef_id     INTEGER      REFERENCES chef(id)
,recipe_id   INTEGER      REFERENCES recipe(id)
,UNIQUE (chef_id, recipe_id)
);

CREATE TABLE menu
(id          SERIAL       PRIMARY KEY
,chef_id     INTEGER      REFERENCES chef(id)
,recipe_id   INTEGER      REFERENCES recipe(id)
,UNIQUE (chef_id, recipe_id)
);



