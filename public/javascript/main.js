    // add event listener to search, prev and next buttons.
    $(window).load(function() {
        if (document.querySelector('#next')) {
            document.querySelector('#next').addEventListener('click', searchSpRecipes);
            document.querySelector('#search').addEventListener('click', searchSpRecipes);
        }
    })

    function registerUser() {
        const message = document.querySelector('.error');
        message.innerText = ""
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        if (username == "" || password == "") {
            message.innerText = "Please fill in all fields"; 
        } else {
            $.post(
                '/register', 
                { username: username, 
                  password: password
            }).done(function(result, status){
                console.log('registration worked');
                message.innerText = `Thanks for registering, ${result.username}. Please Login.`
            }).fail(function(xhr, status, error) {
                const response = JSON.parse(xhr.responseText);
                message.innerText = response.message;
            }) 
        }
        
    }

    function loginUser() {
        // get variables
        const username = document.querySelector('#username').value,
            password = document.querySelector('#password').value;
        if (!username || !password) {
            document.querySelector('.error').innerText = "Please fill in all fields."
            return;
        }
        // perform AJAX request using get()
        $.post(
            '/login', 
            {
                username: username,
                password: password
            }
        ).done(function(result, status) {
            if (result.chef_id !== undefined) {
                window.location.href = '/'; 
            } else {
                document.querySelector('.error').innerText = "Username or password is incorrect."
            }
            // catch if it fails
        }).fail(function(xhr, status, error) {
            const response = JSON.parse(xhr.responseText);
            document.querySelector('.error').innerText = response.message ;
        })
    }
   
    function logout() {
        // clear message
        document.querySelector('.error').innertext = "";
        $.get('/logout', (result)=> {
            // if succeeds, render login page
            window.location.href = '/';
        }).fail(function(xhr, status, error) {
            const response = JSON.parse(xhr.responseText);
            document.querySelector('.error').innertext = response.message;
        })
    }

    function searchSpRecipes(e) {
        const keyword = document.querySelector('#keyword').value;
        const message = document.querySelector('.error');
        message.innerText = '';
        
        if (keyword === '' || keyword === null || keyword === undefined) {
            document.querySelector('.error').innerText = 'Please enter a search keyword.';
            return;
        }
        
        const offset = e.currentTarget.attributes[2].nodeValue;
        const target = `api/searchSpRecipes/${keyword}/${offset}`;

        $.get(target, function(res) {
            const list = res.recipes;
            const recipes = renderSpList(list);
            let ul = document.querySelector('.recipeList');
            document.querySelector('.galleryTitle').innerText = "Search Results";
            
            if (offset == 0) {
                $('li').remove();
            }
            
            recipes.forEach(recipe => ul.appendChild(recipe));
            
            if (offset == 0) {
                $('html, body').animate({scrollTop: $('#headline').offset().top}, 'slow');
            }

            setNext(offset);
        }).fail(function(error) {
            console.log("failed");
            message.innerText = 'There was an error searching for recipes';
        })
    }
    

    // get favorites from database() {
        function getFavorites() {
            // reset message
            document.querySelector('.error').innerText = "";
            // get request for favorite list
            $.get('recipes/getFavorites', function(res){
                // if successful change title,remove page number, reset prev, next buttons
                console.log(res);
                document.querySelector('.galleryTitle').innerText = "Favorite Recipes";
                document.querySelector('.page').innerText = "";
                const next = document.querySelector('#next');
                next.value = 1;
                if (!next.classList.contains('hidden')) {
                    next.classList.add('hidden');
                }
                // render favorite list into li's to display on page
                renderFavorites(res);
                // catch if error
            }).fail(function(ERROR){
                document.querySelector('.error').innerText = "Error getting favorites";
            })
        }
    
    // get one recipe from Food2Fork API
    function viewRecipe(e) {
        // reset message
        document.querySelector('.error').innerText = "";
        // get recipe id from target and create url for request.
        const recipe_id = e.currentTarget.attributes[1].value;
        console.log(recipe_id);
        const target = 'api/viewRecipe/' + recipe_id;
        // get request for one recipe
        $.get(target, (res)=>{
            // success render recipe 
            displayRecipe(res.recipe);
        // catch if error
        }).fail((ERROR)=>{
            document.querySelector('.error').innerText = "There was an error displaying the recipe.";
        })
    }
    
    
    // add favorite to database and change heart red
    function addFave(e) {
        // reset message
        document.querySelector('.error').innerText = "";
        //console.log(e.currentTarget.id);
        // get recipe information from target
        const recipe_id = e.currentTarget.id;
        const title = e.currentTarget.attributes[2].value;
        const image_url = e.currentTarget.attributes[1].value;
        // check for empty values
        if (recipe_id == null || recipe_id == "" ||title == null || title == "" ||image_url == null || image_url == "") {
            //console.log(err);
            document.querySelector('.error').innerText = "Error adding recipe to favorite list.";
            return;
        }
        // post request to add to favorites
        $.post('recipes/addFavorite', //url
            { recipe_id: recipe_id, // data
                image_url: image_url,
                title: title,
                // if succeeded
            }).done(function(result,status){
                // change hearts red and change event listener
                const heart = document.getElementById(result.recipe_id);
                if (!heart.classList.contains('favorited')) {
                    heart.classList.add('favorited')
                    heart.removeEventListener('click', addFave);
                    heart.addEventListener('click', removeFaveSearch);
                }
                const heartHero = document.getElementById(result.recipe_id + "fav");
                if (heartHero) {
                    if (!heartHero.classList.contains('favorited')) {
                        heartHero.classList.add('favorited')
                        heartHero.removeEventListener('click', addFaveHero);
                        heartHero.addEventListener('click', deleteFaveHero);
                    }
                }
            // catch if error
            }).fail(function(xhr, status, error) {
                document.querySelector('.error').innerText = "Error adding recipe to favorite list."
            }) 
    }
    // add to favorites from full size recipe display
    function addFaveHero(e) {
        // reset error message
        document.querySelector('.error').innerText = "";
        // get recipe information from target
        //console.log(e.currentTarget.id);
        const hero_recipe_id = e.currentTarget.id;
        const recipe_id = hero_recipe_id.slice(0, -3);
        const title = e.currentTarget.attributes[2].value;
        const image_url = e.currentTarget.attributes[1].value;
        // check for empty fields.
        if (recipe_id == null || recipe_id == "" ||title == null || title == "" ||image_url == null || image_url == "") {
            //console.log(err);
            document.querySelector('.error').innerText = "Error adding recipe to favorites.";
            return;
        }
        $.post('recipes/addFavorite', //url
            { recipe_id: recipe_id, // data
                image_url: image_url,
                title: title,
            }).done(function(result,status){
                
                const heart = document.getElementById(result.recipe_id);
                const heartHero = document.getElementById(result.recipe_id + "fav");
                if (heart) {
                    if (!heart.classList.contains('favorited')) {
                    heart.classList.add('favorited')
                    heart.removeEventListener('click', addFave);
                    heart.addEventListener('click', removeFaveSearch);
                    }
                }
                if (!heartHero.classList.contains('favorited')) {
                    heartHero.classList.add('favorited')
                    heartHero.removeEventListener('click', addFaveHero);
                    heartHero.addEventListener('click', deleteFaveHero);
                }
                
            }).fail(function(xhr, status, error) {
                document.querySelector('.error').innerText = "Error adding recipe to favorite list."
            }) 
    }
    
    // delete recipe from favorite in database and rerender favorite display.
    function removeFave(e) {
        // reset message
        document.querySelector('.error').innerText = "";
        // get recipe information from event
        const recipe_id = e.currentTarget.id;
        if (recipe_id) {
            // ajax delet request.
            $.ajax({
                type: 'DELETE',
                url: 'recipes/deleteFavorite',
                data: {
                    recipe_id: recipe_id
                }
                // if succeeded
            }).done(function(result){
                // remove recipe tile from page.
                console.log("deleted");
                const tile = document.getElementsByClassName(result.recipe_id);
                if (tile[0] !== undefined) {
                tile[0].parentNode.removeChild(tile[0]);
                }
                // change heart on large recipe to white and change event listener
                const heartHero = document.getElementById(result.recipe_id + "fav");
                if (heartHero) {
                    if (heartHero.classList.contains('favorited')) {
                        heartHero.classList.remove('favorited')
                        heartHero.removeEventListener('click', deleteFaveHero);
                        heartHero.addEventListener('click', addFaveHero);
                    }
                }
            // catch if error
            }).fail(function(xhr, status, error){
                document.querySelector('.error').innerText("Error deleting recipe from favorites.")
            })
        }
    }
    // delete favorite from list if deleted from large recipe for both favorite and search lists
    function deleteFaveHero(e) {
        // reset error message.
        document.querySelector('.error').innerText = "";
        // get recipe info from event
        const hero_recipe_id = e.currentTarget.id;
        const recipe_id = hero_recipe_id.slice(0, -3);
        // ajax delete request.
        if (recipe_id) {
            $.ajax({
                type: 'DELETE',
                url: 'recipes/deleteFavorite',
                data: {
                    recipe_id: recipe_id,
                }
                // if succeeded
            }).done(function(result){
                console.log("deleted");
                // remove recipeTile but leave large recipe
                const tile = document.getElementsByClassName(result.recipe_id);
                const title = document.getElementById(result.recipe_id);
                if (tile[0] !== undefined ) {
                    if (title && !title.attributes[2]) {
                        tile[0].parentNode.removeChild(tile[0]);
                    }
                }
                //change heart on large recipe to white
                const heart = document.getElementById(result.recipe_id);
                if (heart) { 
                    if (heart.classList.contains('favorited')) {
                        heart.classList.remove('favorited');
                        heart.removeEventListener('click', removeFaveSearch);
                        heart.addEventListener('click', addFave);
                    }
                }
                const heartHero = document.getElementById(result.recipe_id + "fav");
                if (heartHero.classList.contains('favorited')) {
                    heartHero.classList.remove('favorited')
                    heartHero.removeEventListener('click', deleteFaveHero);
                    heartHero.addEventListener('click', addFaveHero);
                }
            // catch error
            }).fail(function(xhr, status, error){
                document.querySelector('.error').innerText("Error deleting recipe from favorites.");
            })
        }
    }
    // delete recipe from favorite in database when search result is showing.
    function removeFaveSearch(e) {
        document.querySelector('.error').innerText = "";
        const recipe_id = e.currentTarget.id;
        if (recipe_id) {
            $.ajax({
                type: 'DELETE',
                url: 'recipes/deleteFavoriteSearch',
                data: {
                    recipe_id: recipe_id,
                }
            }).done(function(result){
                console.log("deleted");
                const heart = document.getElementById(result.recipe_id);
                // change heart color and event listener
                if (heart) {
                    if (heart.classList.contains('favorited')) {
                        heart.classList.remove('favorited');
                        heart.removeEventListener('click', removeFaveSearch);
                        heart.addEventListener('click', addFave);
                    }
                }
                const heartHero = document.getElementById(result.recipe_id + "fav");
                if (heartHero) {
                    heartHero.classList.remove('favorited')
                    heartHero.removeEventListener('click', deleteFaveHero);
                    heartHero.addEventListener('click', addFaveHero);
                }
            // catch if error
            }).fail(function(xhr, status, error){
                document.querySelector('.error').innerText("Error deleting recipe from favorites.");
            })
        }
    }

    function createNodeWithClass(type, className) {
        const newNode = document.createElement(type);
        const newClass = document.createAttribute('class');
        newClass.value = className;
        newNode.setAttributeNode(newClass);
        return newNode;
    }
    
    function addIdToNode(nodeName, idName) {
        const newId = document.createAttribute('id');
            newId.value = idName;
            nodeName.setAttributeNode(newId);
            return nodeName;
    }

    function createTextElement(type, text) {
        const newElement = document.createElement(type);
        const newText = document.createTextNode(text);
        newElement.appendChild(newText);
        return newElement; 
    }

    function addFaveButtonClass(faveButton, recipeId) {
        const recipeTile = document.getElementById(recipeId);
        console.log(recipeTile);
        const newClass = document.createAttribute("class");
        if (recipeTile.classList.contains('favorited')) {
            faveButton.addEventListener('click', deleteFaveHero);
            newClass.value = 'favorite herofave favorited';
        } else {
            faveButton.addEventListener('click', addFaveHero);
            newClass.value = 'favorite herofave';
        }
        faveButton.setAttributeNode(newClass);
        return faveButton;
    }

    function addAttribute(nodeName, attributeName, attributeValue) {
        console.log(attributeName, attributeValue);
        const newAttribute = document.createAttribute(attributeName);
        newAttribute.value = attributeValue;
        nodeName.setAttributeNode(newAttribute);
        return nodeName;
    }

    function createFaveButton(recipe) {
        let faveButton = createNodeWithClass('button', 'fave-button');
        faveButton = addIdToNode(faveButton, recipe['id'] + 'fav');
        console.log(faveButton);
        faveButton = addFaveButtonClass(faveButton, recipe['id']);
        const span = createNodeWithClass('span', 'fa fa-heart');
        faveButton.appendChild(span);
        faveButton = addAttribute(faveButton,'data_image', 'image_url');
        faveButton = addAttribute(faveButton, 'name', 'Add to favorites');
        faveButton = addAttribute(faveButton, 'data_title', recipe['title']);
        return faveButton;
    }

    // display 1 recipe
    function displayRecipe(recipe) {
        // reset message
        document.querySelector('.error').innerText = "";
        
        // li one-recipe - create li that will hold all components
        const li = createNodeWithClass('li', 'one-recipe');
        const recipeTitle = createTextElement('h2', recipe['title']);
        li.appendChild(recipeTitle);

        // fave button - goes on one-recipe 
        const faveButton = createFaveButton(recipe);
        // createNodeWithClass('button', 'fave-button');
        // faveButton = addIdToNode(faveButton, recipe['id'] + 'fav');
        // faveButton = addFaveButtonClass(faveButton, recipe['id']);
        
        // // button heart
        // const span = createNodeWithClass('span', 'fa fa-heart');
        // faveButton.appendChild(span);

        // // add custom attributes for saving to favorites
        // faveButton.setAttributeNode(addAttribute('data_image', 'image_url'));

        // const name = document.createAttribute('name');
        // name.value = "Add to Favorites";
        // faveButton.setAttributeNode(name);
        //  // favorite text
        // title = document.createAttribute("data_title");
        // title.value = recipe['title'];
        // faveButton.setAttributeNode(title);
        
        li.appendChild(faveButton);

        // div recipeinfo - that has all recipe info in it
        const recipeInfo = createNodeWithClass('div', 'info');


        // image one-image - goes inside info div
        const img = createNodeWithClass('img', 'one-image');
        const imgSrc = document.createAttribute('src');
        const imgAlt = document.createAttribute('alt');
        imgSrc.value = recipe.image;
        img.setAttributeNode(imgSrc);
        imgAlt.value = recipe.title;
        img.setAttributeNode(imgAlt);
        recipeInfo.appendChild(img);

        // div one-info
        const div = createNodeWithClass('div', 'one-info');

        // h3 goes in one-info div
        const h3 = createTextElement('h3', 'Ingredients');
        div.appendChild(h3);
        
        // ul one-list - goesn in one-info div, contains li recipes
        const ul = createNodeWithClass('ul', 'one-list');
        
        // li create ingredients list and append to ul
        const ingredients = recipe.ingredients;
        let ingred;
        for (let i=0; i<ingredients.length; i++) {
            ingred = createTextElement('li', ingredients[i].original);
            ul.appendChild(ingred);
        }
        div.appendChild(ul);

        if (recipe.instructions) {
            const instructions = createNodeWithClass('p', 'instructions');
            const instructionsText = document.createTextNode(recipe.instructions);
            instructions.appendChild(instructionsText);
            div.appendChild(instructions);
        }

        // p credit - goes in info after recipe

        const credit = createNodeWithClass('p', 'credit');
        const creditText = document.createTextNode(recipe.credit);
        credit.appendChild(creditText);
        div.appendChild(credit);
        
        // a for viewing source. Goes in div after li
        const a = document.createElement('a');
        const aHref = document.createAttribute('href');
        const aTarget = document.createAttribute('target');
        const aText = document.createTextNode('Get Directions');
        aHref.value = recipe.source_url;
        aTarget.value = "_blank";
        a.setAttributeNode(aHref);
        a.setAttributeNode(aTarget);
        a.appendChild(aText);
        div.appendChild(a);


        
        recipeInfo.appendChild(div);
        li.appendChild(recipeInfo);

        const hero = document.querySelector('.hero');
        $(".one-recipe").remove();
        hero.appendChild(li);
        $('html, body').animate({scrollTop: $("#hero").offset().top}, 'slow');



    }

    // deliver list items one at a time from F2F list to renderRecipes then display on page
    function renderList(list) {
        // turn recipe array into map
        const recipes = list.map(recipe => {
            // turn each recipe item into li inserted into map
            return renderRecipes(recipe);
        });
        //console.log(recipes);
        return recipes;            
    }

    function renderSpList(list) {
        // turn recipe array into map
        console.log(list);
        const recipes = list.map(recipe => {
            // turn each recipe item into li inserted into map
            return renderSpRecipes(recipe);
        });
        //console.log(recipes);
        return recipes;            
    }

    // turn each list item from F2F into recipe tile
    function renderRecipes(recipe) {
        const li = createRecipeTile(recipe);
        const faveButton = createFaveButton(recipe);
        const image_url = document.createAttribute("data_image");
            image_url.value = recipe['image_url'];
            faveButton.setAttributeNode(image_url);
        const title = document.createAttribute("data_title");
            title.value = recipe['title'];
            faveButton.setAttributeNode(title);
        faveButton.addEventListener('click', addFave); 
        const cls2 = document.createAttribute("class");
            cls2.value = 'favorite';
            faveButton.setAttributeNode(cls2);
            // add favorite button to tile
        li.appendChild(faveButton);
        return li;
    }

    function renderSpRecipes(recipe) {
        const li = createRecipeSpTile(recipe);
        const faveButton = createFaveSpButton(recipe);
        let image_url = document.createAttribute('data_image');
        image_url.value = 'https://spoonacular.com/recipeImages/' + recipe['image'];
        faveButton.setAttributeNode(image_url);
        let title = document.createAttribute('data_title');
        title.value = recipe['title'];
        faveButton.setAttributeNode(title);
        faveButton.addEventListener('click', addFave);
        let cls2 = document.createAttribute('class');
        cls2.value = 'favorite';
        faveButton.setAttributeNode(cls2);
        li.appendChild(faveButton);
        return li;
    }
    
    // deliver list items individually from favorite table to renderFavoriteList then display on page
    function renderFavorites(list) {
        const recipes = list.map(recipe => {
            return renderFavoriteList(recipe);
        })
        console.log(recipes);
        
        const ul = document.querySelector('.recipeList');
        $("li").remove();
        recipes.forEach(recipe => {
            ul.appendChild(recipe);
        })
        for (let i = 0; i < 4; i++) {
            const li = document.createElement('li');
            const cls = document.createAttribute('class');
            cls.value = 'noTile';
            li.setAttributeNode(cls);
            ul.appendChild(li); 
        }
    }
    
    // creates recipe tiles from individual favorite recipes
    // same as render recipes except faveButton event removes from favorites.
    // also has data_id and recipe_id for ad
    function renderFavoriteList(recipe) {
        const li = createRecipeTile(recipe);
        const faveButton = createFaveButton(recipe);
        const cls2 = document.createAttribute("class");
            cls2.value = 'favorite favorited'; // DIFFERENT
            faveButton.setAttributeNode(cls2);
        li.appendChild(faveButton);
        faveButton.addEventListener('click', removeFave);
        return li;
    }

    // create recipe tiles for favorite and search results lists.
    function createRecipeTile(recipe) {
        const li = document.createElement("li"); 
            // create and add class to tile
            const cls = document.createAttribute("class"); 
                cls.value = 'recipeTile ' + recipe['recipe_id'];
                li.setAttributeNode(cls);
            // add background image to tile
            li.style.backgroundImage = "url(" + recipe['image_url'] + ")";
            li.style.backgroundSize = "cover";
            li.style.backgroundPosition = "center center";
            // create and add view button
            const viewButton = document.createElement('button');
            const text = document.createTextNode(recipe['title']);
                viewButton.appendChild(text);
                viewButton.addEventListener('click', viewRecipe);
            const cls3 = document.createAttribute("class");
                cls3.value = 'viewButton';
                viewButton.setAttributeNode(cls3);
            // add custom attributes for buttons
            const rid = document.createAttribute("data_id");
                rid.value = recipe['recipe_id'];
                viewButton.setAttributeNode(rid);
            // add view recipe button to tile
            li.appendChild(viewButton);
            // return tile to calling function
            return li;
    }

    function createRecipeSpTile(recipe) {
        let li = document.createElement("li"); 
            // create and add class to tile
            let cls = document.createAttribute("class"); 
                cls.value = 'recipeTile ' + recipe['id'];
                li.setAttributeNode(cls);
            // add background image to tile
            li.style.backgroundImage = "url('https://spoonacular.com/recipeImages/" + recipe['image'] + "')";
            li.style.backgroundSize = "cover";
            li.style.backgroundPosition = "center center";
            // create and add view button
            let viewButton = document.createElement('button');
            let text = document.createTextNode(recipe['title']);
                viewButton.appendChild(text);
                viewButton.addEventListener('click', viewRecipe);
            let cls3 = document.createAttribute("class");
                cls3.value = 'viewButton';
                viewButton.setAttributeNode(cls3);
            // add custom attributes for buttons
            let rid = document.createAttribute("data_id");
                rid.value = recipe['id'];
                viewButton.setAttributeNode(rid);
            // add view recipe button to tile
            li.appendChild(viewButton);
            // return tile to calling function
            return li;
    }

    // create favorite button for recipe tiles
    function createFaveButton(recipe) {
        const faveButton = document.createElement("button"); // favorite button
        const id = document.createAttribute("id");
            id.value = recipe['recipe_id'];
            faveButton.setAttributeNode(id); 
        const span = document.createElement('span');
        const fa = document.createAttribute("class");
            fa.value = "fa fa-heart"
            span.setAttributeNode(fa);
            faveButton.appendChild(span);
        return faveButton;
    }

    function createFaveSpButton(recipe) {
        let faveButton = document.createElement("button"); // favorite button
        let id = document.createAttribute("id");
            id.value = recipe['id'];
            faveButton.setAttributeNode(id); 
        let span = document.createElement('span');
        let fa = document.createAttribute("class");
            fa.value = "fa fa-heart"
            span.setAttributeNode(fa);
            faveButton.appendChild(span);
        return faveButton;
    }

    function createFaveSpButton(recipe) {
        let faveButton = document.createElement("button"); // favorite button
        let id = document.createAttribute("id");
            id.value = recipe['id'];
            faveButton.setAttributeNode(id); 
        let span = document.createElement('span');
        let fa = document.createAttribute("class");
            fa.value = "fa fa-heart"
            span.setAttributeNode(fa);
            faveButton.appendChild(span);
        return faveButton;
    }

    function setNext(offset) {
        const next = document.querySelector('#next');
        next.value = parseInt(offset + 10);
        if (next.classList.contains('hidden')) {
            next.classList.remove('hidden');
        }
    }
    // set page numbers and hidden class for previous and next buttons
    function prevNext(page) {
        const prev = document.querySelector('#prev');
            const next = document.querySelector('#next');
        if (page == 1) {
            prev.value = 0;
            if (!prev.classList.contains('hidden')) {
                prev.classList.add('hidden');
            }
            next.value = 2;
            if (next.classList.contains('hidden')) {
                next.classList.remove('hidden');
                
            }
        } else {
            prev.value = parseInt(page) - 1;
            if (prev.classList.contains('hidden')) {
                prev.classList.remove('hidden');
            } 
            next.value = parseInt(page) + 1;
            if (next.classList.contains('hidden')) {
                next.classList.remove('hidden');
            }
        }
    }
    