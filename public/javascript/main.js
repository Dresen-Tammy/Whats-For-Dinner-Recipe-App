    // Log in user
function loginUser() {
    // get variables
    var username = document.querySelector('#username').value,
        password = document.querySelector('#password').value,
        form = document.querySelector('#userInput'),
        output = document.querySelector('#output'),
        outputUl = document.querySelector('#outputUl');
    
        // resolve target uri
        var target = `/login/${username}/${password}`;
        // perform AJAX request using get()
        $.get(target, function(response) {
            console.log(response);
            // set cookie??
            // start session??
            var target2 = '/favorites'
            $.get(target2)
            
            
        }).fail(function() {
            output.append(JSON.stringify(ERROR))
        })
    }

    // get list of recipes from Food2Fork API
function searchRecipes() {
    const keyword = document.querySelector('#keyword').value;
    const target = `/searchRecipes/${keyword}/1`
    $.get(target, function(res){
        var list = res.recipes;
        document.querySelector('.galleryTitle').innerText = "Search Results";
        renderList(list);
    }).fail(function(ERROR){
        var recipeList = document.querySelector('.recipeList');
        var li = document.createElement('li');
        var text = document.createTextNode("There was an error");
        li.appendChild(text);
        recipeList.appendChild(li);
    })
}

// get favorites from database() {
function getFavorites() {
    const chef_id = 1; // TODO get chef_id from session
    const target = `/getFavorites/${chef_id}`;
    $.get(target, function(res){
        
        document.querySelector('.galleryTitle').innerText = "Favorite Recipes";
        renderFavorites(res);
    }).fail(function(ERROR){
        var recipeList = document.querySelector('.recipeList');
        var li = document.createElement('li');
        var text = document.createTextNode("There was an error");
        li.appendChild(text);
        recipeList.appendChild(li);
    })
}
/* // deliver list of recipes from database one at a time
function renderList(list) {
    var recipes = list.map(recipe => {
        return renderRecipes(recipe);
    });
    console.log(recipes);
    var ul = document.querySelector('.recipeList');
    recipes.forEach(recipe => {
        ul.appendChild(recipe);
        
    })
    
            
}
// turn each recipe from the database into a list item
function renderRecipes(recipe) {
        
        var li = document.createElement("li"); // each recipe in list item
        var cls = document.createAttribute("class");
        cls.value = 'recipeTile';
        li.setAttributeNode(cls);
        // favorite button
        var faveButton = document.createElement("button"); // favorite button
        var title = document.createTextNode("Add to Favorites"); // favorite text
        var id = document.createAttribute("id");
        id.value = recipe['f2f_rid'];
        faveButton.addEventListener('click', addFave); // assemble button
        faveButton.appendChild(title);
        faveButton.setAttributeNode(id);
        // image
        var img = document.createElement("img");
        img.src = recipe['imageurl'];
        img.alt = recipe['recipe_name'];
        // title
        var viewButton = document.createElement('button');
        var text = document.createTextNode(recipe['recipe_name']);
        viewButton.addEventListener('click', viewRecipe);
        viewButton.appendChild(text);
        var rid = document.createAttribute("data_id");
        rid.value = recipe['f2f_rid'];
        viewButton.setAttributeNode(rid);
        li.appendChild(faveButton);
        li.appendChild(img);
        li.appendChild(viewButton);
        return li;

} */

function addFave(e) {
    console.log(e.currentTarget.id);
    const recipe_id = e.currentTarget.id;
    const chef_id = 1; // TODO get session variable
    const title = e.currentTarget.attributes[2].value;
    const image_url = e.currentTarget.attributes[1].value;
    $.post('/addFavorite', //url
        { recipe_id: recipe_id, // data
          image_url: image_url,
          title: title,
          chef_id: chef_id
        }).done(function(result,status){
            
            const heart = document.getElementById(result.recipe_id);
            if (!heart.classList.contains('favorited')) {
                heart.classList.add('favorited')
            }
        }).fail(function(xhr, status, error) {
            console.log(status, error, xhr.status, xhr.status.text)
        }) 
}


/* function addFavorite(list) {
    const recipe_id = list.recipe_id;
    const chef_id = 1; // TODO get session variable
    const title = list.title;
    const ingreds = list.ingredients;
    let ingredients = JSON.stringify({ingreds});
    const image_url = list.image_url;
    const source_url = list.source_url;
    $.post('/addFavorite', //url
        { recipe_id: recipe_id, // data
          source_url: source_url,
          image_url: image_url,
          ingredients: ingredients,
          title: title,
          chef_id: chef_id
        }).done(function(result,status){
            const heart = e.currentTarget.id;
            if (!heart.classList.contains('favorited')) {
                heart.classList.add('favorited')
                return 
            }
        }).fail(function(xhr, status, error) {
            console.log(status, error, xhr.status, xhr.status.text)
        }) 

} */

function viewRecipe() {

}
function removeFave(e) {
    const recipe_id = e.currentTarget.id;
    const chef_id = 1; // TODO change to session variable
    $.ajax({
        type: 'DELETE',
        url: '/deleteFavorite',
        data: {
            recipe_id: recipe_id,
            chef_id: chef_id
        }
    }).done(function(result){
        console.log("deleted");
        renderFavorites(result);
    }).fail(function(xhr, status, error){
        console.log(status, error, xhr.status, xhr.status.text);
    })

}

// deliver list items one at a time from database to renderAPIRecipes 
function renderList(list) {
    var recipes = list.map(recipe => {
        return renderRecipes(recipe);
    });
    console.log(recipes);
    var ul = document.querySelector('.recipeList');
    $("li").remove();
    recipes.forEach(recipe => {
        ul.appendChild(recipe);
    })
    
            
}
function renderFavorites(list) {
    var recipes = list.map(recipe => {
        return renderFavoriteList(recipe);
    })
    console.log(recipes);
    var ul = document.querySelector('.recipeList');
    $("li").remove();
    recipes.forEach(recipe => {
        ul.appendChild(recipe);
    })

}
// turn each list item from database into list item
function renderRecipes(recipe) {
        
        var li = document.createElement("li"); // each recipe in list item
        var cls = document.createAttribute("class");
        cls.value = 'recipeTile ' + recipe['recipe_id'];
        
        li.setAttributeNode(cls);
        li.style.backgroundImage = "url(" + recipe['image_url'] + ")";
        li.style.backgroundSize = "cover";
        li.style.backgroundPosition = "center center";
        // favorite button
        var faveButton = document.createElement("button"); // favorite button
        var title = document.createTextNode("Add to Favorites"); // favorite text
        var id = document.createAttribute("id");
        id.value = recipe['recipe_id'];
        var image_url = document.createAttribute("data_image");
        image_url.value = recipe['image_url'];
        var title = document.createAttribute("data_title");
        title.value = recipe['title'];
        faveButton.addEventListener('click', addFave); // assemble button
        //faveButton.appendChild(title);
        var span = document.createElement('span');
        var fa = document.createAttribute("class");
        
        fa.value = "fa fa-heart"
        span.setAttributeNode(fa);
        faveButton.setAttributeNode(id);
        faveButton.setAttributeNode(image_url);
        faveButton.setAttributeNode(title);
        faveButton.appendChild(span);
        var cls2 = document.createAttribute("class");
        cls2.value = 'favorite';
        faveButton.setAttributeNode(cls2);
        // image
        //var img = document.createElement("img");
        //img.src = recipe['image_url'];
        //img.alt = recipe['title'];
        // title
        var viewButton = document.createElement('button');
        var text = document.createTextNode(recipe['title']);
        viewButton.addEventListener('click', viewRecipe);
        viewButton.appendChild(text);
        var cls3 = document.createAttribute("class");
        cls3.value = 'viewButton';
        viewButton.setAttributeNode(cls3);
        var rid = document.createAttribute("data_id");
        rid.value = recipe['recipe_id'];
        viewButton.setAttributeNode(rid);
        li.appendChild(faveButton);
        //li.appendChild(img);
        li.appendChild(viewButton);
        return li;

}
function renderFavoriteList(recipe) {
    var li = document.createElement("li"); // each recipe in list item
        var cls = document.createAttribute("class");
        cls.value = 'recipeTile ' + recipe['recipe_id'];
        
        li.setAttributeNode(cls);
        li.style.backgroundImage = "url(" + recipe['image_url'] + ")";
        li.style.backgroundSize = "cover";
        li.style.backgroundPosition = "center center";
        // favorite button
        var faveButton = document.createElement("button"); // favorite button
        var title = document.createTextNode("Add to Favorites"); // favorite text
        var id = document.createAttribute("id");
        id.value = recipe['recipe_id'];
        faveButton.addEventListener('click', removeFave); // assemble button
        //faveButton.appendChild(title);
        var span = document.createElement('span');
        var fa = document.createAttribute("class");
        
        fa.value = "fa fa-heart"
        span.setAttributeNode(fa);
        faveButton.setAttributeNode(id);
        faveButton.appendChild(span);
        var cls2 = document.createAttribute("class");
        cls2.value = 'favorite favorited';
        faveButton.setAttributeNode(cls2);
        // image
        //var img = document.createElement("img");
        //img.src = recipe['image_url'];
        //img.alt = recipe['title'];
        // title
        var viewButton = document.createElement('button');
        var text = document.createTextNode(recipe['title']);
        viewButton.addEventListener('click', viewRecipe);
        viewButton.appendChild(text);
        var cls3 = document.createAttribute("class");
        cls3.value = 'viewButton';
        viewButton.setAttributeNode(cls3);
        var rid = document.createAttribute("data_id");
        rid.value = recipe['recipe_id'];
        viewButton.setAttributeNode(rid);
        li.appendChild(faveButton);
        //li.appendChild(img);
        li.appendChild(viewButton);
        return li;
}