
//defining buttons
const changelangEng = document.getElementById("englishButton");
const changelangSe = document.getElementById("swedishButton");
const veganButton = document.getElementById("btncheck1");
const filterButtons = document.querySelectorAll('.btn-check'); //Looks for all buttons with the btn-check class

const sortButtons = [
  document.getElementById("btncheck8"),
  document.getElementById("btncheck9")
]

//defining buttons
const meatbuttons = [
  document.getElementById("btncheck2"),
  document.getElementById("btncheck3"),
  document.getElementById("btncheck4"),
  document.getElementById("btncheck5")
];

const checkoutbutton = document.getElementById("checkout");
//defining variables-
let basket = []
let foodDataLangSelect = 0;

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

//function for fetching json data, takes location
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

//fetching JSON data
const foodData = await fetchData("./index.json");
let outputFoodData = foodData;
const langEn = await fetchData("./english.json");
const langSe = await fetchData("./swedish.json");

//updating page on laod
document.onload = outputToDiv();

/* ------ FILTER FUNCTIONS ------- */

filterButtons.forEach(button => {
  button.addEventListener("input", function () {
    filterupdate();
  });
});


//filters food items
function filterupdate() {
  //checks what buttons is checked or not
  const buttonStates = Array.from(filterButtons).map(state => {
    return state.checked
  });
  //disables buttons depending on whats already checked
  disableButtonUpdate(buttonStates);
  //new array for storing the collected food items
  let collectedItems = [];
  //loops through all the button states and collects the items for every checked category 
  for (let i = 0; i < 5; i++) {
    if (buttonStates[i]) {
      switch (i) {
        //adds vegan dishes to "collectedItems"
        case 0:
          collectedItems = collectedItems.concat(getAllVegan());
          break;
        //adds chicken dishes food to "collectedItems"
        case 1:
          collectedItems = collectedItems.concat(getAllChicken());
          break;
        //adds pork dishes food to "collectedItems"
        case 2:
          collectedItems = collectedItems.concat(getAllPork());
          break;
        //adds beef dishes food to "collectedItems"
        case 3:
          collectedItems = collectedItems.concat(getAllBeef());
          break;
        //adds fish dishes food to "collectedItems"
        case 4:
          collectedItems = collectedItems.concat(getAllFish());
          break;
      }
    }
  }
  //checks if any items were collected and displays them, otherwise shows all dishes
  if (collectedItems.length > 0) {
    //removes dublicated times in the array
    collectedItems = removeDuplicates(collectedItems);
    outputFoodData = collectedItems;
  } else outputFoodData = foodData;

  //checks and removes lactose and/or gluten dishes
  if (buttonStates[6]) {
    outputFoodData = removeLactose(outputFoodData);
  }
  if (buttonStates[5]) {
    outputFoodData = removeGluten(outputFoodData);
  }

  //---------- if sort price -> sortprice()
  updateMenu()
}
//takes array and removes duplicates and sends array back
function removeDuplicates(inputArray) {
  const uniqueArray = [];
  inputArray.forEach(element => {
    if (!uniqueArray.includes(element)) {
      uniqueArray.push(element);
    }
  });
  return uniqueArray;
}

//disable buttons depending on what filters is already set
function disableButtonUpdate(button) {
  //disable all meat dishes if vegan filter is activ
  if (button[0]) {
    meatbuttons.forEach(element => {
      element.setAttribute("disabled", "");
    });
  } else {
    //"undisable" all meat buttons
    meatbuttons.forEach(element => {
      element.removeAttribute("disabled", "");
    });
  }
  //disable vegan dishes if any meat filter is activ
  if (button[1] || button[2] || button[3] || button[4]) {
    veganButton.setAttribute("disabled", "");
  } else {
    veganButton.removeAttribute("disabled", "");
  }
}

//returns an array with all VEGAN food items
function getAllVegan() {
  return foodData.filter(Food => Food.vegan === true);
}
//returns an array with all CHICKEN food items
function getAllChicken() {
  return foodData.filter(Food => Food.chicken === true);
}
//returns an array with all PORK food items
function getAllPork() {
  const returnArray = [];
  return foodData.filter(Food => Food.pork === true);
}
//returns an array with all BEEF food items
function getAllBeef() {
  return foodData.filter(Food => Food.beef === true);
}
//returns an array with all FISH food items
function getAllFish() {
  return foodData.filter(Food => Food.fish === true);
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

/* ------ SORT FUNCTIONS ------- */
/*Returns an array with food objects sorted after price
If no array is passed as a parameter, 
the functions returns ALL food items sorted after price */
function sortAfterPrice(arrayToSort = foodData) {
  let sortedArray = [];

  //Compares two values in the array and sorts them accordingly
  sortedArray = foodData.sort(function (firstValue, secondValue) {
    return firstValue.price - secondValue.price
  });

  return sortedArray;

}

/* ------ GENERAL FUNCTIONS ------- */
//Event for changing language to english
changelangEng.addEventListener("click", function () {
  //Set the var for selecting the right language in the json file.
  clearMenuCard()
  foodDataLangSelect = 1;
  outputToDiv()
  changeLang(langEn);
});

//Event for changing language to english
changelangSe.addEventListener("click", function () {
  //Set the var for selecting the right language in the json file.
  clearMenuCard()
  foodDataLangSelect = 0;
  outputToDiv()
  changeLang(langSe);
});

//takes language file and finds all elements with a translate key and changes its text to the maching key in the language file.
function changeLang(languageFile) {
  for (var key in languageFile) {
    if (languageFile.hasOwnProperty(key)) {
      var elements = document.querySelectorAll("[data-translate=" + key + "]");
      for (var i = 0; i < elements.length; i++) {
        elements[i].textContent = languageFile[key];
        console.log(key);
      }
    }
  }
}


/*------------HTML-------------*/
// Function to create a menu card for a dish
function createMenuCard(dish) {
  const menuCard = document.createElement("div");         // Create a div for the menu card
  menuCard.classList.add("col-sm-6");                     // Add CSS classes to style the card

  const cardBody = document.createElement("div");         // Create a div for the card body
  cardBody.classList.add("card-body");                    // Add CSS classes for card body styling

  const mbDiv = document.createElement("div");            // Create a div for margin bottom
  mbDiv.classList.add("mb-3");                            // Add CSS classes for margin styling

  // Generate HTML content for menu details using dish data
  let menuDetailsHTML;

  if (dish.price.length > 1) {
    // If a half-price is defined, display it along with the regular price
    menuDetailsHTML = `
    <h2>${dish.disheName[foodDataLangSelect]} <img src="./assets/img/half_full.png" alt="half circle">
     ${dish.price[0]}kr <img src="./assets/img/full.png" alt="full circle"> ${dish.price[1]}kr
     ${dish.vegan ? '<img src="./assets/img/vegan.png" alt="Vegan icon" class="float-end>' : ''}</h2>
    <p>${dish.about[foodDataLangSelect]}</p>
    <button class="btn btn-outline-primary" data-translate="addToCartHalf" data-price="${dish.price[0]}">Lägg till i varukorgen (Halv)</button>
    <button class="btn btn-outline-primary" data-translate="addToCartFull" data-price="${dish.price[1]}">Lägg till i varukorgen (Hel)</button>
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
      console.log("Item added to cart: " + dish.disheName[foodDataLangSelect] + " " + price + "kr");
    });
  });
  const divOutput = document.getElementById("output");
  divOutput.appendChild(menuCard);
}

// takes a dish object and displays it in the toast window
function displayBasket(dish) {
  const displayBasket = document.createElement("div");
  displayBasket.classList.add("col-sm-6");
  let basketDetailsHTML = `
  <p>${dish.disheName[foodDataLangSelect]}  ${dish.price} kr<p> 
`;
  const button = document.createElement("button");
  button.textContent = "Remove";
  button.classList.add("btn", "btn-outline-primary", "flex-wrap");

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


//Takes food array and puts them in to divs in the HTML file 
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
//updates the dishes on the menu
function updateMenu() {
  clearMenuCard();
  outputToDiv();
}
//takes dish and adds it to customers basket
function addToBasket(dish, price) {
  // Create a copy of the dish with the selected price
  const dishCopy = { ...dish, price };

  // Add the new dish to the basket
  basket.push(dishCopy);

  updateBasket(basket);
}

//takes a dish input and removes it to customers basket
function removeFromBasket(dish) {
  for (let index = 0; index < basket.length; index++) {
    const element = basket[index];
    if (element == dish) {
      basket.splice(index, 1);
    }
  }
  updateBasket(basket)
}
//takes an array of dishes, removes all objects in the toast window and reprints everything in the input array.
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
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
  }
  //prints total price
  document.getElementById("total-price").textContent = "Total: " + calcTotalPrice() + " kr";
}
//calculate the total price of items in the basket 
function calcTotalPrice() {
  let total = 0;
  basket.forEach(element => {
    total += parseInt(element.price); // Use parseFloat to handle potential string inputs
  });
  return total;
}
checkoutbutton.addEventListener("click", function () {
  alert("Function is still in development");
});
