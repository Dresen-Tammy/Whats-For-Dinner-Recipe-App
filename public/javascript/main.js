    // add event listener to search, prev and next buttons.
    $(window).load(function() {
        if (document.querySelector('#next')) {
            document.querySelector('#next').addEventListener('click', searchRecipes);
            document.querySelector('#search').addEventListener('click', searchRecipes);
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

    function searchRecipes(e) {
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
            message.innerText = 'There was an error searching for recipes';
        })
    }
    

    // get favorites from database
        function getFavorites() {
            // reset message
            document.querySelector('.error').innerText = "";
            // get request for favorite list
            $.get('recipes/getFavorites', function(res){
                // if successful change title,remove page number, reset next button
                document.querySelector('.galleryTitle').innerText = "Favorite Recipes";
                document.querySelector('.page').innerText = "";
                const next = document.querySelector('#next');
                next.value = 10;
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
        document.querySelector('.error').innerText = "";
        // get recipe information from event
        console.log(e);
        const recipe_id = e.currentTarget.id;
        const title = e.currentTarget.attributes[4].value;
        console.log(title);
        const image_url = e.currentTarget.attributes[3].value;
        console.log(image_url);

        // check for empty values
        if (recipe_id == null || recipe_id == "" ||title == null || title == "" ||image_url == null || image_url == "") {
            document.querySelector('.error').innerText = "Error adding recipe to favorite list.";
            return;
        }

        // post request to add to favorites
        $.post('recipes/addFavorite', 
            { recipe_id: recipe_id, 
                image_url: image_url,
                title: title,
            }).done(function(result,status){

                checkHeartButton(result.recipe_id);
                

            }).fail(function(xhr, status, error) {
                document.querySelector('.error').innerText = "Error adding recipe to favorite list."
            }) 
    }

    // add to favorites from full size recipe display
    function addFaveHero(e) {
        document.querySelector('.error').innerText = "";
        // get recipe information from target
        console.log(e);
        const hero_recipe_id = e.currentTarget.id;
        const recipe_id = hero_recipe_id.slice(0, -3);
        const title = e.currentTarget.attributes[4].value;
        const image_url = e.currentTarget.attributes[3].value;

        if (recipe_id == null || recipe_id == "" ||title == null || title == "" ||image_url == null || image_url == "") {
            document.querySelector('.error').innerText = "Error adding recipe to favorites.";
            return;
        }

        $.post('recipes/addFavorite', 
            { recipe_id: recipe_id, 
                image_url: image_url,
                title: title,
            }).done(function(result, status){
                checkHeartButton(result.recipe_id);   
            }).fail(function(xhr, status, error) {
                document.querySelector('.error').innerText = "Error adding recipe to favorite list."
            }) 
    }
    
    function checkHeartButton(recipe_id) {
        const heart = document.getElementById(recipe_id);
        const heartHero = document.getElementById(recipe_id + "fav");

        if (!heart.classList.contains('favorited')) {
            heart.classList.add('favorited')
            heart.removeEventListener('click', addFave);
            heart.addEventListener('click', removeFaveSearch);
        }

        if (heartHero) {
            if (!heartHero.classList.contains('favorited')) {
                heartHero.classList.add('favorited')
                heartHero.removeEventListener('click', addFaveHero);
                heartHero.addEventListener('click', deleteFaveHero);
            }
        }
    }

    function uncheckHeartButton(recipe_id) {
        const heart = document.getElementById(recipe_id);
        const heartHero = document.getElementById(recipe_id + "fav");
        
        if (heart) { 
            if (heart.classList.contains('favorited')) {
                heart.classList.remove('favorited');
                heart.removeEventListener('click', removeFaveSearch);
                heart.addEventListener('click', addFave);
            }
        }
        
        if (heartHero) {
            if (heartHero.classList.contains('favorited')) {
                heartHero.classList.remove('favorited')
                heartHero.removeEventListener('click', deleteFaveHero);
                heartHero.addEventListener('click', addFaveHero);
            }
        }
    }

    // delete recipe from favorite in database and rerender favorite display.
    function removeFave(e) {
        document.querySelector('.error').innerText = "";
        // get recipe information from event
        const recipe_id = e.currentTarget.id;
        if (recipe_id) {
            $.ajax({
                type: 'DELETE',
                url: 'recipes/deleteFavorite',
                data: {
                    recipe_id: recipe_id
                }
            }).done(function(result){
                // remove recipe tile from page.
                const tile = document.getElementsByClassName(result.recipe_id);
                if (tile[0] !== undefined) {
                tile[0].parentNode.removeChild(tile[0]);
                }
                // change heart on large recipe to white and change event listener
                uncheckHeartButton(result.recipe_id);
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
                // remove recipeTile but leave large recipe
                const tile = document.getElementsByClassName(result.recipe_id);

                if (tile[0] !== undefined ) {
                        tile[0].parentNode.removeChild(tile[0]);
                }

                //change heart on large recipe to white
                uncheckHeartButton(result.recipe_id);
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
                uncheckHeartButton(result.recipe_id)
            // catch if error
            }).fail(function(xhr, status, error){
                document.querySelector('.error').innerText("Error deleting recipe from favorites.");
            })
        }
    }

    function createIngredientsList(ul, ingredients) {
        let newIngredient;
        for (let i=0; i<ingredients.length; i++) {
            newIngredient = createTextElement('li', ingredients[i].original);
            ul.appendChild(newIngredient);
        }
        return ul;
    }

    function assembleRecipe(recipe) {
        let recipeContent = createNodeWithClass('div', 'one-info');
        // h3 goes in one-info div
        const title = createTextElement('h3', 'Ingredients');
        recipeContent.appendChild(title);
        
        // ul one-list - goesn in one-info div, contains li recipes
        let ingredientUl = createNodeWithClass('ul', 'one-list');
        
        // li create ingredients list and append to ul
        ingredientUl = createIngredientsList(ingredientUl, recipe.ingredients);
        recipeContent.appendChild(ingredientUl);

        if (recipe.instructions) {
            let instructions = createNodeWithClass('p', 'instructions');
            instructions = addTextNode(instructions, recipe.instructions);
            recipeContent.appendChild(instructions);
        }

        // p credit - goes in info after recipe
        let credit = createNodeWithClass('p', 'credit');
        credit = addTextNode(credit, recipe.credit);
        recipeContent.appendChild(credit);
        
        // a for viewing source. Goes in div after li
        let directionsButton = document.createElement('a');
        directionsButton = addAttribute(directionsButton, 'href', recipe.source);
        directionsButton = addAttribute(directionsButton, 'target', '_blank');
        directionsButton = addTextNode(directionsButton, 'Get Directions'); 
        recipeContent.appendChild(directionsButton);
        return recipeContent;
    }
    

    // display 1 recipe
    function displayRecipe(recipe) {
        // reset message
        document.querySelector('.error').innerText = "";
        
        // li one-recipe - create li that will hold all components
        const oneRecipe = createNodeWithClass('li', 'one-recipe');
        const recipeTitle = createTextElement('h2', recipe['title']);
        oneRecipe.appendChild(recipeTitle);

        // fave button - goes on one-recipe 
        let faveButton = createFaveButton(recipe);
        faveButton = updateFaveButton(faveButton, recipe);
        oneRecipe.appendChild(faveButton);

        // div recipeinfo - that has all recipe info in it
        const recipeInfo = createNodeWithClass('div', 'info');
        // image one-image - goes inside recipeinfo div
        let img = createNodeWithClass('img', 'one-image');
        img = addAttribute(img, 'src', recipe.image);
        img = addAttribute(img, 'alt', recipe.title);
        recipeInfo.appendChild(img);

        // div one-info
        const recipeContent = assembleRecipe(recipe);
        recipeInfo.appendChild(recipeContent);
        oneRecipe.appendChild(recipeInfo);

        const hero = document.querySelector('.hero');
        $(".one-recipe").remove();
        hero.appendChild(oneRecipe);
        $('html, body').animate({scrollTop: $("#hero").offset().top}, 'slow');
    }

    function renderSpList(list) {
        // turn recipe array into map
        const recipes = list.map(recipe => {
            // turn each recipe item into li inserted into map
            return renderSpRecipes(recipe);
        });
        return recipes;            
    }

    function renderSpRecipes(recipe) {
        const li = createRecipeTile(recipe);
        const faveButton = createFaveButton(recipe);
        let image_url = document.createAttribute('data_image');
        image_url.value = recipe['image'];
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

    function createRecipeTile(recipe) {
        let li = document.createElement("li"); 
            // create and add class to tile
            let cls = document.createAttribute("class"); 
                cls.value = 'recipeTile ' + recipe['id'];
                li.setAttributeNode(cls);
            // add background image to tile
            if (recipe['image'].startsWith('http')) {
                li.style.backgroundImage = "url(" + recipe['image'] + ")";
            } else {
                li.style.backgroundImage = "url(http://spoonacular.com/recipeImages/" + recipe['image'] + ")";
            }
            if (!li.style.backgroundImage) {
                li.style.backgroundImage = "url(http://spoonacular.com/recipeImages/notfound.jpg)";
            }
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



    function setNext(offset) {
        const next = document.querySelector('#next');
        next.value = parseInt(offset + 10);

        if (next.classList.contains('hidden')) {
            next.classList.remove('hidden');
        }
    }

    function createFaveButton(recipe) {
        let faveButton = createNodeWithClass('button', 'fave-button');
        faveButton = addIdToNode(faveButton, recipe['id']); 
        const span = createNodeWithClass('span', 'fa fa-heart');
        faveButton.appendChild(span);
        faveButton = addAttribute(faveButton, 'name', 'Add to favorites');
        return faveButton;
    }

    function updateFaveButton(faveButton, recipe) {
        faveButton.removeAttribute('id');
        faveButton = addIdToNode(faveButton, recipe['id'] + 'fav');
        faveButton = addFaveButtonClass(faveButton, recipe['id']);
        faveButton = addAttribute(faveButton,'data_image', recipe.image);
        faveButton = addAttribute(faveButton, 'data_title', recipe['title']);
        return faveButton;
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

    function addTextNode(nodeName, text) {
        const textNode = document.createTextNode(text);
        nodeName.appendChild(textNode);
        return nodeName;
    }

    function addFaveButtonClass(faveButton, recipeId) {
        const recipeTile = document.getElementById(recipeId);
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
        const newAttribute = document.createAttribute(attributeName);
        newAttribute.value = attributeValue;
        nodeName.setAttributeNode(newAttribute);
        return nodeName;
    }

    
    
    