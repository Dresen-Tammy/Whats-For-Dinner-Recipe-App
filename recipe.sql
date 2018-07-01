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
,category_id INTEGER     REFERENCES category(id) NOT NULL
,f2f_rid     INTEGER                             NOT NULL
,recipe_name VARCHAR(200)                        NOT NULL
,source      TEXT                                NOT NULL
,imageURL    TEXT                                NOT NULL
,ingredients TEXT[]                              NOT NULL
, UNIQUE (f2f_rid)
);

CREATE TABLE ingredients
(id          SERIAL       PRIMARY KEY
,recipe_id   INTEGER      REFERENCES recipe(id) NOT NULL
,ingredient  VARCHAR(255) NOT NULL
,chef_id     INTEGER      REFERENCES chef(id) NOT NULL
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

[{recipe_id: 10, ingredient:'1 head lettuce, torn into small pieces'}, {recipe_id: 10, ingredient:'1 (10 ounce) package frozen green peas, thawed'}, {recipe_id: 10, ingredient:'1/2 cup chopped green bell pepper'}, {recipe_id: 10, ingredient:'12 slices bacon'}, {recipe_id: 10, ingredient:'1 1/2 cups small cauliflower florets'}, {recipe_id: 10, ingredient:'1/2 cup chopped celery'}, {recipe_id: 10, ingredient:'2 cups mayonnaise'}, {recipe_id: 10, ingredient:'3 tablespoons white sugar'}, {recipe_id: 10, ingredient:'4 ounces shredded Cheddar cheese'}]

[[10, '1 head lettuce, torn into small pieces'], [10, '1 (10 ounce) package frozen green peas, thawed'], [10, '1/2 cup chopped green bell pepper'], [10, '12 slices bacon'], [10, '1 1/2 cups small cauliflower florets'], [10, '1/2 cup chopped celery'], [10, '2 cups mayonnaise'], [10, '3 tablespoons white sugar'], [10, '4 ounces shredded Cheddar cheese']]
