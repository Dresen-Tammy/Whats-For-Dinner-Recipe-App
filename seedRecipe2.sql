INSERT INTO chef VALUES (default, 'Tammy', 'password');
INSERT INTO chef VALUES (default, 'David', 'password');


INSERT INTO recipe VALUES (default, 35120, 'Bacon Wrapped Jalapeno Popper Stuffed Chicken'
,'http://static.food2fork.com/Bacon2BWrapped2BJalapeno2BPopper2BStuffed2BChicken2B5002B5909939b0e65.jpg', 'http://www.closetcooking.com/2012/11/bacon-wrapped-jalapeno-popper-stuffed.html', 
'{"4 small chicken breasts, pounded thin", "salt and pepper to taste", "4 jalapenos, diced", "4 ounces cream cheese, room temperature", "1 cup cheddar cheese, shredded", "8 slices bacon\n"}'
); 



INSERT INTO recipe VALUES (default, 35123, 'Baklava'
,'http://static.food2fork.com/Baklava39f0e7c8.jpg', 'http://www.closetcooking.com/2008/03/baklava.html',
'{"4 cups walnuts, chopped", "1/2 cup sugar", "1 tablespoon cinnamon", "1 cup butter, melted", "1 pound phyllo pastry, thawed", "3/4 cup water", "1/2 cup sugar", "1 stick cinnamon", "2 inch slice lemon peel", "2 inch slice orange peel", "3/4 cup honey\n"}'
); 

INSERT INTO recipe VALUES (default, 35224, 'Chipotle Lime Fish Tacos'
,'http://static.food2fork.com/Chipotle2BLime2BFish2BTacos2B5002B2200548335bd.jpg'
, 'http://www.closetcooking.com/2011/06/chipotle-lime-fish-tacos.html',
'{"1 pound white fish such as tilapia, cod, etc.", "2 tablespoons oil", "1 lime, juice", "1 tablespoon chipotle chili powder", "1 teaspoon cumin, toasted and ground", "salt and pepper to taste", "8 (4 inch) corn tortillas\n"}'
); 

INSERT INTO favorite VALUES (default, 1, 3);
INSERT INTO favorite VALUES (default, 1, 1);
INSERT INTO favorite VALUES (default, 1, 2);
INSERT INTO favorite VALUES (default, 2, 1);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

grant select, insert, delete on session to recipeUser;

grant usage, select on all sequences in schema public to recipeUser;