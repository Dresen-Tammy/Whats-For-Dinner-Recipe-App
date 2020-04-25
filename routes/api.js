const express = require('express');
const axios = require('axios');
const url = require('url');
const f2f_get_url = `http://food2fork.com/api/get?key=${process.env.FTF_KEY}&`;
const f2f_search_url = `http://food2fork.com/api/search?key=${process.env.FTF_KEY}`;
const sp_search_url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients';
const sp_get_url = '';
const session = require('express-session');
// custom module that has all the logic of server
const router = express.Router();




/* GET recipes from Food2Fork API*/

// get recipe search.
router.get('/searchRecipes/:keyword/:page', function(req,res,next) {
    console.log("Getting recipe Search from API")
    req.session.page = req.params.page;
    const keyword = req.params.keyword;
    const page = req.params.page;
    req.session.page = req.params.page;
    const request = f2f_search_url+"&q="+keyword+"&page="+page;
    axios.get(request)
         .then((response)=> {
             res.json({success: true, recipes: response.data, page: req.session.page});
         }).catch((error)=> {
             console.log("error getting recipes.");
             res.status(401)
                .json({success: false});
         })
})

router.get('/searchSpRecipes/:keyword/:offset', function(req,res,next) {
    console.log("getting recipe Search from Spoonacular API");
    const offset = req.params.offset;
    const request = {
        method:'get',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=10&offset=${req.params.offset}&query=${req.params.keyword}`,
        headers: {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
	        "x-rapidapi-key": "00a7c14d1amsh293bb083aeeb886p1025b3jsn587e35775a3d"
        },
    }
    console.log("****request", request, "****done");
    axios(request)
    .then((response)=> {
        console.log("****in response");
        console.log( response.data);
        console.log("results", response.data.results);
        res.status(200)
            .json({success: true, recipes: response.data.results, offset: req.session.offset});
        console.log('here', res.json);
    }).catch((error)=> {
        console.log("error getting recipes.");
        res.status(401)
           .json({success: false});
    })

// res.json({success: true, offset: offset, recipes: [ { id: 226493,
//             title: 'Chocolate con Arequipe (Dulce de Leche Hot Chocolate)',
//             readyInMinutes: 45,
//             servings: 4,
//             sourceUrl:
//              'http://www.mycolombianrecipes.com/chocolate-con-arequipe-dulce-de-leche-hot-chocolate',
//             openLicense: 0,
//             image:
//              'Chocolate-con-Arequipe-(Dulce-de-Leche-Hot-Chocolate)-226493.jpg' },
//           { id: 717440,
//             title:
//              'Chocolate Cupcakes with Mint Chocolate Chip Buttercream Frosting',
//             readyInMinutes: 45,
//             servings: 14,
//             sourceUrl:
//              'http://www.ihearteating.com/2016/02/20/chocolate-cupcakes-with-mint-chocolate-chip-buttercream-frosting/',
//             openLicense: 0,
//             image:
//              'chocolate-cupcakes-with-mint-chocolate-chip-buttercream-frosting-717440.jpg' },
//           { id: 913916,
//             title: 'Chocolate Sour Cream Zucchini Cake with Chocolate Glaze',
//             readyInMinutes: 45,
//             servings: 16,
//             sourceUrl:
//              'http://www.epicurious.com/recipes/food/views/chocolate-sour-cream-zucchini-cake-with-chocolate-glaze?mbid=nl_08102017_Daily_CTN_PM+(1)',
//             openLicense: 0,
//             image:
//              'chocolate-sour-cream-zucchini-cake-with-chocolate-glaze-913916.jpg' },
//           { id: 139618,
//             title: 'Chocolate Bread Pudding with Walnuts and Chocolate Chips',
//             readyInMinutes: 45,
//             servings: 6,
//             sourceUrl:
//              'http://www.epicurious.com/recipes/food/views/Chocolate-Bread-Pudding-with-Walnuts-and-Chocolate-Chips-236881',
//             openLicense: 0,
//             image:
//              'chocolate-bread-pudding-with-walnuts-and-chocolate-chips-2-139618.jpg' },
//           { id: 506506,
//             title: 'Easy Chocolate Truffles Dipped in White Chocolate',
//             readyInMinutes: 120,
//             servings: 54,
//             sourceUrl:
//              'http://www.thismamacooks.com/2013/12/easy-chocolate-truffles-white-chocolate.html',
//             openLicense: 0,
//             image:
//              'easy-chocolate-truffles-dipped-in-white-chocolate-506506.jpg' },
//           { id: 517669,
//             title: 'Chocolate- Chocolate Chip Cookie Dough Truffles',
//             readyInMinutes: 52,
//             servings: 32,
//             sourceUrl:
//              'http://www.recipegirl.com/2013/02/04/chocolate-chocolate-chip-cookie-dough-truffles/',
//             openLicense: 0,
//             image: 'Chocolate--Chocolate-Chip-Cookie-Dough-Truffles-517669.jpg' },
//           { id: 497750,
//             title: 'German Chocolate Cupcakes with Chocolate Ganache',
//             readyInMinutes: 45,
//             servings: 36,
//             sourceUrl:
//              'http://www.afarmgirlsdabbles.com/2012/03/16/layered-german-chocolate-cupcakes-with-chocolate-ganache/',
//             openLicense: 0,
//             image:
//              'German-Chocolate-Cupcakes-with-Chocolate-Ganache-497750.jpg' },
//           { id: 513308,
//             title: 'Chocolate Chocolate Chip Oreo Cookies',
//             readyInMinutes: 30,
//             servings: 24,
//             sourceUrl:
//              'http://recipesfoodandcooking.com/2013/09/04/chocolate-chocolate-chip-oreo-cookies/',
//             openLicense: 0,
//             image: 'Chocolate-Chocolate-Chip-Oreo-Cookies-513308.jpg' },
//           { id: 477878,
//             title: 'Chocolate Chocolate Chip Bread',
//             readyInMinutes: 45,
//             servings: 16,
//             sourceUrl:
//              'http://www.barbarabakes.com/2010/04/chocolate-chocolate-chip-bread/',
//             openLicense: 0,
//             image: 'Chocolate-Chocolate-Chip-Bread-477878.jpg' },
//           { id: 516999,
//             title: 'Chocolate Cupcakes w/ Chocolate Ganache',
//             readyInMinutes: 50,
//             servings: 36,
//             sourceUrl:
//              'http://www.recipegirl.com/2007/03/08/chocolatey-cupcakes-dipped-in-chocolate-ganache/',
//             openLicense: 0,
//             image: 'Chocolate-Cupcakes-w--Chocolate-Ganache-516999.jpg' } ]});
 });
 
/* GET recipe search */
router.get('/viewRecipe/:recipe_id', function(req, res, next) {
    console.log("Getting Recipe from Spoonacular API")
    let request = {
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${req.params.recipe_id}/information`,
        method: 'get',
        headers: {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
	        "x-rapidapi-key": "00a7c14d1amsh293bb083aeeb886p1025b3jsn587e35775a3d"
        }
    }
            
    axios(request)

         .then((response) => {
             const data = response.data;
             console.log('title', data.title)
             console.log('ingreds', data.extendedIngredients[0]);
             let ingredients = [];
            //  for (let i = 0; i > data.extendedIngredients.length; i++) {
            //      ingredients.push(ingredient.originalString);
            //      console.log('ingred', ingredients[i]);
            //  };
             // id, title, sourceUrl, image, summary, instructions, creditsText, extended ingredients
             let recipe = {
                 id: data.id,
                 title: data.title,
                 source: data.sourceUrl,
                 image: data.image,
                 summary: data.summary,
                 ingredients: data.extendedIngredients,
                 instructions: data.extendedInstructions,
                 credit: data.creditsText
             }
             console.log('recipe', recipe);
             res.status(200)
                .json({recipe: recipe});
         }).catch((error)=> {
             console.log('error', error);
            res.status(401)
            .json({success: false});
         })

        // res.status(200)
        //     .json( { 
        //         success: true,
        //         recipe: {
        //             id: 226493,
        //             title: 'Chocolate con Arequipe (Dulce de Leche Hot Chocolate)',
        //             source:
        //             'http://www.mycolombianrecipes.com/chocolate-con-arequipe-dulce-de-leche-hot-chocolate',
        //             image: 'https://spoonacular.com/recipeImages/226493-556x370.jpg',
        //             summary:
        //             'Chocolate con Arequipe (Dulce de Leche Hot Chocolate) is a <b>gluten free</b> side dish. For <b>$1.4 per serving</b>, this recipe <b>covers 14%</b> of your daily requirements of vitamins and minerals. This recipe makes 4 servings with <b>464 calories</b>, <b>11g of protein</b>, and <b>27g of fat</b> each. Head to the store and pick up chocolate, ground cinnamon, milk, and a few other things to make it today. 479 people have made this recipe and would make it again. From preparation to the plate, this recipe takes about <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 57%</b>. This score is pretty good. Similar recipes include <a href="https://spoonacular.com/recipes/dulce-de-leche-milkshake-malteada-de-arequipe-o-dulce-de-leche-226960">Dulce de Leche Milkshake (Malteada de Arequipe o Dulce de Leche)</a>, <a href="https://spoonacular.com/recipes/pan-de-banano-y-arequipe-banana-and-dulce-de-leche-bread-470802">Pan de Banano y Arequipe) Bananan and Dulce de Leche Bread</a>, and <a href="https://spoonacular.com/recipes/dulce-de-leche-and-coconut-roll-pionono-de-arequipe-y-coco-227419">Dulce de Leche and Coconut Roll (Pionono de Arequipe Y Coco)</a>.',
        //             ingredients:
        //             [ { id: 19904,
        //                 aisle: 'Sweet Snacks',
        //                 image: 'dark-chocolate-pieces.jpg',
        //                 consistency: 'solid',
        //                 name: 'dark chocolate',
        //                 original: '4 oz dark chocolate, finely chopped',
        //                 originalString: '4 oz dark chocolate, finely chopped',
        //                 originalName: 'dark chocolate, finely chopped',
        //                 amount: 4,
        //                 unit: 'oz',
        //                 meta: [Array],
        //                 metaInformation: [Array],
        //                 measures: [Object] },
        //             { id: 1012010,
        //                 aisle: 'Spices and Seasonings',
        //                 image: 'cinnamon.jpg',
        //                 consistency: 'solid',
        //                 name: 'ground cinnamon',
        //                 original: '1/2 teaspoon ground cinnamon',
        //                 originalString: '1/2 teaspoon ground cinnamon',
        //                 originalName: 'ground cinnamon',
        //                 amount: 0.5,
        //                 unit: 'teaspoon',
        //                 meta: [],
        //                 metaInformation: [],
        //                 measures: [Object] },
        //             { id: 1077,
        //                 aisle: 'Milk, Eggs, Other Dairy',
        //                 image: 'milk.png',
        //                 consistency: 'liquid',
        //                 name: 'milk',
        //                 original: '4 cups milk',
        //                 originalString: '4 cups milk',
        //                 originalName: 'milk',
        //                 amount: 4,
        //                 unit: 'cups',
        //                 meta: [],
        //                 metaInformation: [],
        //                 measures: [Object] },
        //             { id: 10019146,
        //                 aisle: 'Baking',
        //                 image: 'chocolate-chips.jpg',
        //                 consistency: 'solid',
        //                 name: 'milk chocolate chips',
        //                 original: '4 oz milk chocolate chips',
        //                 originalString: '4 oz milk chocolate chips',
        //                 originalName: 'milk chocolate chips',
        //                 amount: 4,
        //                 unit: 'oz',
        //                 meta: [],
        //                 metaInformation: [],
        //                 measures: [Object] },
        //             { id: 2047,
        //                 aisle: 'Spices and Seasonings',
        //                 image: 'salt.jpg',
        //                 consistency: 'solid',
        //                 name: 'salt',
        //                 original: 'Pinch of salt',
        //                 originalString: 'Pinch of salt',
        //                 originalName: 'Pinch of salt',
        //                 amount: 1,
        //                 unit: 'pinch',
        //                 meta: [],
        //                 metaInformation: [],
        //                 measures: [Object] },
        //             { id: 2050,
        //                 aisle: 'Baking',
        //                 image: 'vanilla.jpg',
        //                 consistency: 'solid',
        //                 name: 'vanilla',
        //                 original: '1 teaspoon vanilla',
        //                 originalString: '1 teaspoon vanilla',
        //                 originalName: 'vanilla',
        //                 amount: 1,
        //                 unit: 'teaspoon',
        //                 meta: [],
        //                 metaInformation: [],
        //                 measures: [Object] } ],
        //             instructions: undefined,
        //             credit: 'My Colombian Recipes' }
        //     });
            console.log('here');
});


module.exports = router;
