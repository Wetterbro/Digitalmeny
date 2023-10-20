
/* ---------------------------------- CONSTS ------------------------------------- */
const changelangEng = document.getElementById("englishButton");
const changelangSe = document.getElementById("swedishButton");

const filterButtonArray = document.querySelectorAll('.btn-check'); //Looks for buttons with the btn-check class
const veganButton = document.getElementById("btncheck1");
const sortingButtons = [document.getElementById("btncheck8"), document.getElementById("btncheck9")]
const checkoutbutton = document.getElementById("checkout");

const toastTrigger = document.getElementById('liveToastBtn')
//TODO Change name
const toastWindow = document.getElementById('liveToast')
//Protein Buttons for filtering
const meatbuttons = [
  document.getElementById("btncheck2"),
  document.getElementById("btncheck3"),
  document.getElementById("btncheck4"),
  document.getElementById("btncheck5")
];
//defining variables-
let basket = []
let foodDataLangSelect = 0;



/* ---------------------------------- FETCHING JSON DATA ------------------------------------- */
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
//fetching JSON data
const foodData = await fetchData("./index.json");
let outputFoodData = [...foodData];
const langEn = await fetchData("./english.json");
const langSe = await fetchData("./swedish.json");


/* ---------------------------------- BUTTONS / EVENTLISTENERS ------------------------------------- */

// -------- Filtering buttons --------- 
veganButton.addEventListener("input", function () {
  meatbuttons.forEach(button => {
    button.checked = false
  });
});

meatbuttons.forEach(button => {
  button.addEventListener("input", function () {
    veganButton.checked = false
  });
});

filterButtonArray.forEach(button => {
  button.addEventListener("input", function () {
    filterupdate();
  });
});

// -------- Sorting buttons --------- 
//TODO Change name 
sortingButtons[0].addEventListener("input", function () {
  sortingButtons[1].checked = false
  filterupdate();
});
//TODO Change name 
sortingButtons[1].addEventListener("input", function () {
  sortingButtons[0].checked = false
  filterupdate();
});

// -------- Language selection buttons --------- 
//Event for changing language to english
changelangEng.addEventListener("click", function () {
  //Set the let for selecting the right language in the json file.
  clearMenuCard()
  foodDataLangSelect = 1;
  outputToDiv()
  changeLang(langEn);
  updateBasket(basket)
});

//Event for changing language to english
changelangSe.addEventListener("click", function () {
  //Set the let for selecting the right language in the json file.
  clearMenuCard()
  foodDataLangSelect = 0;
  outputToDiv()
  changeLang(langSe);
  updateBasket(basket);
});

// -------- Checkout button --------- 
checkoutbutton.addEventListener("click", function () {
  alert("Function is still in development");
});


/* ---------------------------------- FILTER FUNCTIONS ------------------------------------- */


//filters food items and updates menu
function filterupdate() {

  //checks what buttons is checked or not
  const buttonStates = Array.from(filterButtonArray).map(state => {
    return state.checked
  });


  //new array for storing the collected food items
  let collectedItems = [];
  //loops through all the button states and collects the items for every checked category 
  for (let i = 0; i < 5; i++) {
    if (buttonStates[i]) {
      switch (i) {
        //adds vegan dishes to "collectedItems"
        case 0:
          collectedItems = collectedItems.concat(foodData.filter(Food => Food.vegan === true));
          break;
        //adds chicken dishes food to "collectedItems"
        case 1:
          collectedItems = collectedItems.concat(foodData.filter(Food => Food.chicken === true));
          break;
        //adds pork dishes food to "collectedItems"
        case 2:
          collectedItems = collectedItems.concat(foodData.filter(Food => Food.pork === true));
          break;
        //adds beef dishes food to "collectedItems"
        case 3:
          collectedItems = collectedItems.concat(foodData.filter(Food => Food.beef === true));
          break;
        //adds fish dishes food to "collectedItems"
        case 4:
          collectedItems = collectedItems.concat(foodData.filter(Food => Food.fish === true));
          break;
      }
    }
  }
  //checks if any items were collected and displays them, otherwise shows all dishes
  if (collectedItems.length > 0) {
    //removes dublicated times in the array
    collectedItems = removeDuplicates(collectedItems);
    outputFoodData = collectedItems;
  } else outputFoodData = [...foodData];




  //checks and removes lactose and/or gluten dishes
  if (buttonStates[6]) {
    outputFoodData = removeLactose(outputFoodData);
  }
  if (buttonStates[5]) {
    outputFoodData = removeGluten(outputFoodData);
  }

if(sortingButtons[0].checked || sortingButtons[1].checked){
  sortingSelector();
}

  //---------- if sort price -> sortprice()
  updateMenu();

}

//removes all dishes including gluten and returns the rest
function removeGluten(foodArray) {
  // Use the filter method to create a new array without gluten foods
  const withoutGluten = foodArray.filter(food => food.glutenFree);

  return withoutGluten;
}
//removes all dishes including lactose and returns the rest
function removeLactose(foodArray) {
  // Use the filter method to create a new array without gluten foods
  const withoutLactose = foodArray.filter(food => food.lactoseFree);

  return withoutLactose;
}

//takes an array and removes duplicate-dishes and returns new array back
function removeDuplicates(inputArray) {
  const uniqueArray = [];
  inputArray.forEach(element => {
    if (!uniqueArray.includes(element)) {
      uniqueArray.push(element);
    }
  });
  return uniqueArray;
}




/* ---------------------------------- SORTING FUNCTIONS ------------------------------------- */

function sortingSelector() {
  for (let i = 0; i < sortingButtons.length; i++) {
    if (sortingButtons[i].checked) {
      switch (i) {
        case 0:
          outputFoodData = sortAfterPrice(outputFoodData);
          outputFoodData = outputFoodData.reverse();
          break;
        case 1:
          outputFoodData = sortAfterPrice(outputFoodData);
          break;
      }

      updateMenu();
    }
  }


  if (sortingButtons[0].checked === false && sortingButtons[1].checked === false) {
    filterupdate();
  }

}

/*Returns an array with food objects sorted after price
If no array is passed as a parameter, 
the functions returns ALL food items sorted after price */
function sortAfterPrice(arrayToSort = foodData) {
  let sortedArray = [];

  //Compares two values in the array and sorts them accordingly
  sortedArray = arrayToSort.sort(function (firstValue, secondValue) {
    return firstValue.price[0] - secondValue.price[0]
  });
  return sortedArray;
}




/* ---------------------------------- LOADING SETUP ------------------------------------- */
//Load html elements to the page
document.onload = outputToDiv();


/* ---------------------------------- GENERAL FUNCTIONS ------------------------------------- */


//takes language file and finds all elements with a translate key and changes its text to the maching key in the language file.
function changeLang(languageFile) {
  for (var key in languageFile) {
    if (languageFile.hasOwnProperty(key)) {
      var elements = document.querySelectorAll("[data-translate=" + key + "]");
      for (var i = 0; i < elements.length; i++) {
        elements[i].textContent = languageFile[key];
      }
    }
  }
}



/* ---------------------------------- HTML FUNCTIONS ------------------------------------- */

// Function to create a menu card for a dish
function createMenuCard(dish) {
  const menuCard = document.createElement("div");         // Create a div for the menu card
  menuCard.classList.add("col-sm-6");                     // Add CSS classes to style the card

  const cardBody = document.createElement("div");          // Create a div for the card body
  cardBody.classList.add("card-body");                    // Add CSS classes for card body styling

  const mbDiv = document.createElement("div");           // Create a div for margin bottom
  mbDiv.classList.add("mb-3");                            // Add CSS classes for margin styling

  // Generate HTML content for menu details using dish data
  let menuDetailsHTML;

  if (dish.price.length > 1) {
    // If a half-price is defined, display it along with the regular price
    menuDetailsHTML = `
    <h2>${dish.disheName[foodDataLangSelect]} <img src="./assets/img/half_full.png" alt="full circle">
     ${dish.price[1]}kr <img src="./assets/img/full.png" alt="half circle"> ${dish.price[0]}kr
     ${dish.vegan ? '<img src="./assets/img/vegan.png" alt="Vegan icon" class="float-end>' : ''}</h2>
    <p>${dish.about[foodDataLangSelect]}</p>
    <button class="btn btn-outline-primary" data-translate="addToCartHalf" data-price="${dish.price[1]}">Lägg till i varukorgen (Halv)</button>
    <button class="btn btn-outline-primary" data-translate="addToCartFull" data-price="${dish.price[0]}">Lägg till i varukorgen (Hel)</button>
  `;
  } else {
    // If no half-price is defined, display the regular price
    menuDetailsHTML = `
    <h2>${dish.disheName[foodDataLangSelect]} ${dish.price}kr ${dish.vegan ? '<img src="./assets/img/vegan.png" alt="Vegan icon" class="float-end">' : ''}</h2>
    <p>${dish.about[foodDataLangSelect]}</p>
    <button class="btn btn-outline-primary" data-translate="addToCart" data-price="${dish.price[0]}">Lägg till i varukorgen</button>
  `;
  }



  mbDiv.insertAdjacentHTML("beforeend", menuDetailsHTML); // Insert the HTML content
  cardBody.appendChild(mbDiv);                            // Append the margin div to the card body
  menuCard.appendChild(cardBody);                         // Append the card body to the menu card
  // Add event listeners to handle button clicks
  const buttons = mbDiv.querySelectorAll("button");
  buttons.forEach(button => {
    button.addEventListener("click", (event) => {
      const price = event.target.getAttribute("data-price");
      addToBasket(dish, price);
    });
  });
  const divOutput = document.getElementById("output");
  divOutput.appendChild(menuCard);

  if(foodDataLangSelect == 0){
    changeLang(langSe)
  }else{
    changeLang(langEn)
  }
}



//Takes food array and puts them in to divs in the HTML file 
//TODO Change namne
function outputToDiv() {
  outputFoodData.forEach(element => {
    createMenuCard(element)
  });
}

//Clears the menu
function clearMenuCard() {
  const divOutput = document.getElementById("output");
  while (divOutput.firstChild) {
    divOutput.removeChild(divOutput.firstChild);
  }
}

//Updates the dishes on the menu
function updateMenu() {
  clearMenuCard();
  outputToDiv();
}

/* ---------------------------------- BASKET FUNCTIONS ------------------------------------- */
// takes a dish object and displays it in the toast window
//Updates the view for the user with HTML elements 
function displayBasket(dish) {
  const displayBasket = document.createElement("div");
  displayBasket.classList.add("col-sm-6");
  let basketDetailsHTML = `
  <p>${dish.disheName[foodDataLangSelect]}  ${dish.price} kr<p> 
  `;
  const button = document.createElement("button");
  button.innerHTML = '<i class="fas fa-trash"></i>';
  button.classList.add("btn", "btn-outline-danger", "flex-wrap");

  button.addEventListener("click", () => {
    removeFromBasket(dish);
  });

  const hr = document.createElement("hr");
  displayBasket.insertAdjacentHTML("beforeend", basketDetailsHTML)
  const divBasket = document.getElementById("basket");
  divBasket.appendChild(displayBasket);
  divBasket.appendChild(button);
  divBasket.appendChild(hr);
}


//takes dish and adds it to customers basket
function addToBasket(dish, price) {
  // Create a copy of the dish with the selected price
  const dishCopy = { ...dish, price };
  // Add the new dish to the basket
  basket.push(dishCopy);
  updateBasket(basket);
}

//takes a dish input and removes it from the customers basket
function removeFromBasket(dish) {
  for (let index = 0; index < basket.length; index++) {
    const element = basket[index];
    if (element == dish) {
      basket.splice(index, 1);
    }
  }
  updateBasket(basket)
}

//takes an array of dishes, removes all objects in the toast window and updates everything in the input array.
function updateBasket(dishlist) {
  const divBasket = document.getElementById("basket");
  while (divBasket.firstChild) {
    divBasket.removeChild(divBasket.firstChild);
  }
  dishlist.forEach(element => {
    displayBasket(element);
  });
  //displayes toast window if basket contains any items
  if (basket.length > 0) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow)
    toastBootstrap.show()
  }
  //prints total price
  document.getElementById("total-price").textContent = "Total: " + calcTotalPrice() + " kr";
}
//calculate the total price of items in the basket and returns the total
function calcTotalPrice() {
  let total = 0;
  basket.forEach(element => {
    total += parseInt(element.price); // Use parseFloat to handle potential string inputs
  });
  return total;
}
