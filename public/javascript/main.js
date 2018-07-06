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
            window.location.href = '/favorites';
            
            
        }).fail(function(xhr, status, error) {
            output.append(JSON.stringify(error));
        })
    }
    // register user
function registerUser() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    console.log('password');
    $.post('/register', //url
    { username: username, // data
      password: password
    }).done(function(result,status){
        document.querySelector('.error').innerText = `Thanks for registering, ${result.username}. Please Login.`
        
    }).fail(function(xhr, status, error) {
        console.log(status, error, xhr.status, xhr.status.text)
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
// get one recipe from Food2Fork API
// TODO: get one recipe by recipe_id and display recipe with link to instructions.
function viewRecipe(e) {
const recipe_id = e.currentTarget.attributes[1].value;
const target = '/viewRecipe/' + recipe_id;
$.get(target, (res)=>{
    // success render recipe 
    displayRecipe(res.recipe);
}).fail((ERROR)=>{
    console.log(ERROR);
    // error
})
}
// display 1 recipe
function displayRecipe(recipe) {
    // create recipe tile elements
    const li = document.createElement('li'),
          liClass = document.createAttribute('class'),
          card = document.createElement('div'),
          cardClass = document.createAttribute('class'),
          img = document.createElement('img'),
          imgClass = document.createAttribute('class'),
          imgSrc = document.createAttribute('src'),
          imgAlt = document.createAttribute('alt'),
          div = document.createElement('div'),
          divClass = document.createAttribute('class'),
          h3 = document.createElement('h3'),
          h3Text = document.createTextNode('Ingredients:'),
          faveButton = document.createElement('button'),
          ul = document.createElement('ul'),
          ulClass = document.createAttribute('class'),
          ingredients = recipe.ingredients,
          a = document.createElement('a'),
          aHref = document.createAttribute('href'),
          aTarget = document.createAttribute('target'),
          aText = document.createTextNode('Directions'),
          p = document.createElement('p'),
          pText = document.createTextNode("Publisher: " + recipe.publisher),
          h2 = document.createElement('h2'),
          h2Text = document.createTextNode(recipe.title)
          title = document.createTextNode("Add to Favorites"), // favorite text
          id = document.createAttribute("id"),
          span = document.createElement('span'),
          fa = document.createAttribute("class"),
          cls2 = document.createAttribute("class");
    let ingred;
    // create tile
    liClass.value = 'one-recipe';
    li.setAttributeNode(liClass);
    // create image
    h2.appendChild(h2Text);
    li.appendChild(h2);
    id.value = recipe['recipe_id'];
    faveButton.addEventListener('click', addFave); // assemble button
    fa.value = "fa fa-heart"
    span.setAttributeNode(fa);
    faveButton.setAttributeNode(id);
    faveButton.appendChild(span);
    
    cls2.value = 'favorite herofave';
    faveButton.setAttributeNode(cls2);
    var image_url = document.createAttribute("data_image");
    image_url.value = recipe['image_url'];// HERE
    var title = document.createAttribute("data_title");
    title.value = recipe['title'];
    faveButton.setAttributeNode(image_url);
    faveButton.setAttributeNode(title);
    li.appendChild(faveButton);
    cardClass.value = 'info';
    card.setAttributeNode(cardClass);
    imgClass.value = 'one-image';
    img.setAttributeNode(imgClass);
    imgSrc.value = recipe.image_url;
    img.setAttributeNode(imgSrc);
    imgAlt.value = recipe.title;
    img.setAttributeNode(imgAlt);
    card.appendChild(img);
    // create information
    divClass.value = 'one-info';
    div.setAttributeNode(divClass);
    h3.appendChild(h3Text);
    div.appendChild(h3);
    ulClass.value = 'one-list';
    ul.setAttributeNode(ulClass);
    for (let i=0; i<ingredients.length; i++) {
        ingred = document.createElement('li');
        let text = document.createTextNode(ingredients[i]);
        ingred.appendChild(text);
        ul.appendChild(ingred);
    }
    div.appendChild(ul);
    aHref.value = recipe.source_url;
    aTarget.value = "_blank";
    a.setAttributeNode(aHref);
    a.setAttributeNode(aTarget);
    a.appendChild(aText);
    div.appendChild(a);
    card.appendChild(div);
    li.appendChild(card);
    //p.appendChild(pText);
    //li.appendChild(p);
    
    
    imgAlt.vaule = recipe.title;
    img.setAttributeNode(imgAlt);
    const hero = document.querySelector('.hero');
    $(".one-recipe").remove();
    hero.appendChild(li);
}

       
        //faveButton.appendChild(title);
        
        
       
/* function displayRecipe(recipe) {
    // create recipe tile elements
    const li = document.createElement('li'),
          liClass = document.createAttribute('class'),
          p1 = document.createAttribute('p'),
          img = document.createElement('img'),
          imgClass = document.createAttribute('class'),
          imgSrc = document.createAttribute('src'),
          imgAlt = document.createAttribute('alt'),
          p2 = document.createElement('p'),
          ul = document.createElement('ul'),
          ulClass = document.createAttribute('class'),
          ingredients = recipe.ingredients,
          a = document.createElement('a'),
          aHref = document.createAttribute('href'),
          aTarget = document.createAttribute('target'),
          aText = document.createTextNode('Directions'),
          p3 = document.createElement('p')
          
    let ingred;
    // create tile
    liClass.value = 'one-recipe';
    li.setAttributeNode(liClass);
    p1.innerText = recipe.title;
    li.appendChild(p1.documentElement);
    // create image
    imgClass.value = 'one-image';
    img.setAttributeNode(imgClass);
    imgSrc.value = recipe.image_url;
    img.setAttributeNode(imgSrc);
    imgAlt.value = recipe.title;
    img.setAttributeNode(imgAlt);
    li.appendChild(img);
    // create h3
    p2.innerText = "Ingredients";
    li.appendChild(p2);
    ulClass.value = 'one-list';
    ul.setAttributeNode(ulClass);
    for (let i=0; i<ingredients.length; i++) {
        ingred = document.createElement('li');
        let text = document.createTextNode(ingredients[i]);
        ingred.appendChild(text);
        ul.appendChild(ingred);
    }
    li.appendChild(ul);
    aHref.value = recipe.source_url;
    a.setAttributeNode(aHref);
    aTarget.value = '_blank';
    a.setAttributeNode(aTarget);
    a.appendChild(aText);
    li.appendChild(a);
    p3.innerText = "Recipe by " + recipe.publisher; 
    p3.appendChild(pText);
    li.appendChild(p);
    
    
    

    
    
    imgAlt.vaule = recipe.title;
    img.setAttributeNode(imgAlt);
    const hero = document.querySelector('.hero');
    
    hero.appendChild(li);
} */

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
// add favorite to database and change heart red
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


// delete recipe from favorite in database and rerender favorite display.
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

// deliver list items one at a time from F2F list to renderRecipes then display on page
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

// deliver list items individually from favorite table to renderFavoriteList then display on page
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
// turn each list item from F2F into recipe tile
function renderRecipes(recipe) {
        
        // create recipe tile
        var li = document.createElement("li"); 
        // create and add class to tile
        var cls = document.createAttribute("class"); 
        cls.value = 'recipeTile ' + recipe['recipe_id'];
        li.setAttributeNode(cls);
        // add background image to tile
        li.style.backgroundImage = "url(" + recipe['image_url'] + ")";
        li.style.backgroundSize = "cover";
        li.style.backgroundPosition = "center center";
        // create favorite button and id, data_image, and data_title attributes for it
        var faveButton = document.createElement("button"); // favorite button
        var title = document.createTextNode("Add to Favorites"); // favorite text
        var id = document.createAttribute("id");
        id.value = recipe['recipe_id'];
        var image_url = document.createAttribute("data_image");
        image_url.value = recipe['image_url'];
        var title = document.createAttribute("data_title");
        
        title.value = recipe['title'];
        // add event listener to favorite button
        faveButton.addEventListener('click', addFave); // assemble button
        // create font awesome label for favorite button
        var span = document.createElement('span');
        var fa = document.createAttribute("class");
        fa.value = "fa fa-heart"
        // add attributes and label to favorite button
        span.setAttributeNode(fa);
        faveButton.setAttributeNode(id);
        faveButton.setAttributeNode(image_url);
        faveButton.setAttributeNode(title);
        faveButton.appendChild(span);
        // add class to favorite button
        var cls2 = document.createAttribute("class");
        cls2.value = 'favorite';
        faveButton.setAttributeNode(cls2);
        // create view recipe button with title, custom attribute, event listener, and class
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
        // add favorite button to tile
        li.appendChild(faveButton);
        // add view recipe button to tile
        li.appendChild(viewButton);
        // return tile to calling function to be added to page
        return li;

}

// creates recipe tiles from individual favorite recipes
// same as render recipes except faveButton event removes from favorites.
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