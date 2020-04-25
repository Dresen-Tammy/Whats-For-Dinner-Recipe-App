CREATE TABLE chef
(id  SERIAL PRIMARY KEY
,username VARCHAR(200) NOT NULL
,password VARCHAR(255) NOT NULL
,salt VARCHAR(255) NOT NULL
,UNIQUE (username) 
);

CREATE TABLE recipe
(id SERIAL PRIMARY KEY
,recipe_id VARCHAR(10) NOT NULL
,title VARCHAR(255) NOT NULL
,source TEXT NOT NULL
,image TEXT NOT NULL
,instructions TEXT
,credit varchar(255) NOT NULL
);

CREATE TABLE favorites
(id SERIAL PRIMARY KEY
,recipe_id INTEGER REFERENCES recipe(id)
,chef_id INTEGER REFERENCES chef(id)
,UNIQUE (chef_id, recipe_id)
);

CREATE TABLE ingredients
(id SERIAL PRIMARY KEY
,recipe_id INTEGER REFERENCES recipe(id)
,ingredient VARCHAR(255) NOT NULL
)

CREATE TABLE SESSION
(sid VARCHAR(255) PRIMARY KEY
,sess JSON NOT NULL
);
