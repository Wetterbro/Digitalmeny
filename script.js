
/* ---------------------------------- CONSTS ------------------------------------- */
const changelangEng = document.getElementById("englishButton");
const changelangSe = document.getElementById("swedishButton");

const filterButtonArray = document.querySelectorAll('.btn-check'); //Looks for buttons with the btn-check class
const veganButton = document.getElementById("btncheck1");
const sortingButtons = [document.getElementById("btncheck8"), document.getElementById("btncheck9")]
const checkoutbutton = document.getElementById("checkout");
const basketbutton = document.getElementById("showBasketButton");
//TODO Change name
const basketWindow = document.getElementById('liveToast')
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
const foodData = await fetchData("./food.json");
let outputFoodData = [...foodData];
const langEn = await fetchData("./english.json");
const langSe = await fetchData("./swedish.json");


/* ---------------------------------- BUTTONS / EVENTLISTENERS ------------------------------------- */

// -------- Filtering buttons --------- 
//Unchecks all meat buttons if vegan button is clicked.
veganButton.addEventListener("input", () => {
  meatbuttons.forEach(button => {
    button.checked = false
  });
});
//Unchecks vegan button if meat button is clicked

meatbuttons.forEach(button => {
  button.addEventListener("input", () => {
    veganButton.checked = false
  });
});
//checks if any of the filter buttens is changed.
filterButtonArray.forEach(button => {
  button.addEventListener("input", () => {
    filterupdate();
  });
});

// -------- Sorting buttons --------- 
//TODO Change name 
sortingButtons[0].addEventListener("input", () => {
  sortingButtons[1].checked = false
  filterupdate();
});
//TODO Change name 
sortingButtons[1].addEventListener("input", () => {
  sortingButtons[0].checked = false
  filterupdate();
});

// -------- Language selection buttons --------- 
//Event for changing language to english
changelangEng.addEventListener("click", () => {
  //Set the let for selecting the right language in the json file.
  clearMenuCard()
  foodDataLangSelect = 1;
  outputToHTML()
  updateBasket(basket)
});

//Event for changing language to english
changelangSe.addEventListener("click", () => {
  //Set the let for selecting the right language in the json file.
  clearMenuCard()
  foodDataLangSelect = 0;
  outputToHTML()
  updateBasket(basket);
});

// -------- Checkout button --------- 
checkoutbutton.addEventListener("click", () => {
  alert(CheckoutMessage(basket)); 
});
// -------- Shows basket if clicked ---------
basketbutton.addEventListener("click", () => {
  updateBasket(basket);
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
  for (let i = 0; i < buttonStates.length; i++) {
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

  if (sortingButtons[0].checked || sortingButtons[1].checked) {
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
// looks if any of the sorting buttons is checked and calls the matching sorting function.
function sortingSelector() {
  for (let i = 0; i < sortingButtons.length; i++) {
    if (sortingButtons[i].checked) {
      switch (i) {
        //sorts array high to low
        case 0:
          outputFoodData = sortAfterPrice(outputFoodData);
          outputFoodData = outputFoodData.reverse();
          break;

        //sorts array low to high
        case 1:
          outputFoodData = sortAfterPrice(outputFoodData);
          break;
      }

      updateMenu();
    }
  }
  //if none of the sorting buttons is checked, updates   
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
document.onload = outputToHTML();


/* ---------------------------------- GENERAL FUNCTIONS ------------------------------------- */

//takes language file and finds all elements with a translate key and changes its text to the matching key in the language file.
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
//Takes an array of dishes and makes a checkout message ready for sending in an alert
function CheckoutMessage(basket) {
  if (basket.length === 0) {
    return "The site is still under development. \n Please add items to your basket.";
  }

  let message = "The site is still under development \nItems in your basket:\n";
  basket.forEach((item) => {
    message += `${item.dishName [foodDataLangSelect]} - ${item.price} kr\n`;
  });

  message += `Total: ${calcTotalPrice()} kr`;

  return message;
}




/* ---------------------------------- HTML FUNCTIONS ------------------------------------- */

// Function to create a menu card for a dish
function createMenuCard(dish) {
  const menuCard = document.createElement("div");         // Create a div for the menu card
  menuCard.classList.add("col-sm-6");                     // Add CSS classes to style the card

  const cardBody = document.createElement("div");          // Create a div for the card body
  cardBody.classList.add("card-body" , "mb-3");                    // Add CSS classes for card body styling

  // Generate HTML content for menu details using dish data
  let menuDetailsHTML;

  if (dish.price.length > 1) {
    // If a half-price is defined, display it along with the regular price
    menuDetailsHTML = `
    <h2>${dish.dishName[foodDataLangSelect]} <i class="fa-solid fa-circle-half-stroke fa-2xs"></i>
    </i>
     ${dish.price[1]}kr <i class="fa-solid fa-circle fa-2xs"></i> ${dish.price[0]}kr
     ${dish.vegan ? '<img src="./assets/img/vegan.png" alt="Vegan icon" class="float-end>' : ''}</h2>
    <p>${dish.about[foodDataLangSelect]}</p>
    <button class="btn btn-outline-primary" data-translate="addToCartHalf" data-price="${dish.price[1]}">Lägg till i varukorgen (Halv)</button>
    <button class="btn btn-outline-primary" data-translate="addToCartFull" data-price="${dish.price[0]}">Lägg till i varukorgen (Hel)</button>
  `;
  } else {
    // If no half-price is defined, display the regular price
    menuDetailsHTML = `
    <h2>${dish.dishName[foodDataLangSelect]} ${dish.price}kr ${dish.vegan ? '<img src="./assets/img/vegan.png" alt="Vegan icon" class="float-end">' : ''}</h2>
    <p>${dish.about[foodDataLangSelect]}</p>
    <button class="btn btn-outline-primary" data-translate="addToCart" data-price="${dish.price[0]}">Lägg till i varukorgen</button>
  `;
  }

  cardBody.insertAdjacentHTML("beforeend", menuDetailsHTML); // Insert the HTML content
                             
  menuCard.appendChild(cardBody);                         // Append the card body to the menu card
  // Add event listeners to handle button clicks
  const buttons = cardBody.querySelectorAll("button");
  buttons.forEach(button => {
    button.addEventListener("click", (event) => {
      const price = event.target.getAttribute("data-price");
      addToBasket(dish, price);
    });
  });
  const divOutput = document.getElementById("output");
  divOutput.appendChild(menuCard);

  if (foodDataLangSelect == 0) {
    changeLang(langSe)
  } else {
    changeLang(langEn)
  }
}

// Creates a message if there is no dishes with current filter configuration
function noDishesFound() {
  clearMenuCard()
  const noDishesElement = `<h3>${foodDataLangSelect === 0 ? langSe.noDishes : langEn.noDishes}</h3>` 
  const viewToDiv = document.getElementById("output");
  viewToDiv.insertAdjacentHTML("beforeEnd" , noDishesElement)
 
}
//Takes food array and puts them in to divs in the HTML file 
function outputToHTML() {
  if (outputFoodData.length <= 0) {
    noDishesFound()
  } else {
    outputFoodData.forEach(element => {
      createMenuCard(element)
    });
  }
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
  outputToHTML();
}

/* ---------------------------------- BASKET FUNCTIONS ------------------------------------- */
// takes a dish object and displays it in the toast window
//Updates the view for the user with HTML elements 
function displayBasket(dish) {
  //Creates html div and set classes 
  const displayBasket = document.createElement("div");
  displayBasket.classList.add("col-sm-6");
  //Create HTML for dish details
  let basketDetailsHTML = `
  <p>${dish.dishName[foodDataLangSelect]}  ${dish.price} kr<p> 
  `;
  //creates a trash button for removing items in basket
  const button = document.createElement("button");
  button.innerHTML = '<i class="fas fa-trash"></i>';
  button.classList.add("btn", "btn-outline-danger", "flex-wrap");
  button.setAttribute("aria-label", "remove item");

  button.addEventListener("click", () => {
    removeFromBasket(dish);
  });
  //outputs content to page
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
  if(basket.length > 0){
    basketbutton.disabled = false;
  }
}

//takes a dish input and removes it from the customers basket
function removeFromBasket(dish) {
  // Find the item we want to remove and "cuts it out" of the array

  for (let index = 0; index < basket.length; index++) {
    const element = basket[index];
    if (element == dish) {
      basket.splice(index, 1);
    }
  }

  // update user's shopping basket
  updateBasket(basket)
  if(basket.length == 0){
    basketbutton.disabled = true;
  }
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
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(basketWindow)
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
