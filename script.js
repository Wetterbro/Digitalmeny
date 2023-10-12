
const changelangEng = document.getElementById("englishButton");
const changelangSe = document.getElementById("swedishButton");
/* const veganButton = document.getElementById("btncheck1");
const chickenButton = document.getElementById("btncheck2");
const porkButton = document.getElementById("btncheck3");
const beefButton = document.getElementById("btncheck4");
const fishButton = document.getElementById("btncheck5");
const glutenFreeButton = document.getElementById("btncheck6");
const lactoseFreeButton = document.getElementById("btncheck7"); */






//Fetches json data
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
const foodData = await fetchData("./index.json");
let foodDataLangSelect = 0;
const langEn = await fetchData("./english.json");
const langSe = await fetchData("./swedish.json");
let outputFoodData = foodData;
document.onload = outputToDiv();


/* ------ FILTER FUNCTIONS ------- */
//returns an array with all VEGAN food items

const filterButtonArray = document.querySelectorAll('.btn-check'); //Looks for buttons with the btn-check class

filterButtonArray.forEach(button => {
  button.addEventListener("input", function () {
    console.log(filterButtonArray);
    filterupdate();
  });
});

function filterupdate() {
 const buttonStates = Array.from(filterButtonArray).map(state => {
  return state.checked
 });

  let  collectedItems = [];

  for (let i = 0; i < 4; i++) {
    if (buttonStates[i]) {
      switch (i) {
        case 0:
          collectedItems = collectedItems.concat(getAllVegan());
          break;
        case 1:
          collectedItems = collectedItems.concat(getAllChicken());
          break;
        case 2:
          collectedItems = collectedItems.concat(getAllPork());
          break;
        case 3:
          collectedItems = collectedItems.concat(getAllBeef());
          break;
        case 4:
          collectedItems = collectedItems.concat(getAllFish());
          break;
      }
    }
  }
  if (collectedItems.length > 0) {
  outputFoodData=collectedItems;
  }else outputFoodData = foodData;

  if(buttonStates[6]){
    outputFoodData = removeLactose(outputFoodData);
  }
  if(buttonStates[5]){
    outputFoodData = removeGluten(outputFoodData);
  }

  //---------- if sort price -> sortprice()
  updateMenu()
}

function getAllVegan() {
  const veganDishArray = [];

  for (let index = 0; index < foodData.length; index++) {
    const currentFood = foodData[index]
    if (currentFood.vegan === true) {
      veganDishArray.push(currentFood)
    }
  }

  return veganDishArray

}
//returns an array with all CHICKEN food items
function getAllChicken() {
  const returnArray = [];

  for (let index = 0; index < foodData.length; index++) {
    const currentFood = foodData[index]
    if (currentFood.chicken === true) {
      returnArray.push(currentFood)
    }
  }

  return returnArray

}
//returns an array with all PORK food items
function getAllPork() {
  const returnArray = [];

  for (let index = 0; index < foodData.length; index++) {
    const currentFood = foodData[index]
    if (currentFood.pork === true) {
      returnArray.push(currentFood)
    }
  }

  return returnArray

}
//returns an array with all BEEF food items
function getAllBeef() {
  const returnArray = [];

  for (let index = 0; index < foodData.length; index++) {
    const currentFood = foodData[index]
    if (currentFood.beef === true) {
      returnArray.push(currentFood)

    }
  }

  return returnArray

}
//returns an array with all FISH food items
function getAllFish() {
  const returnArray = [];

  for (let index = 0; index < foodData.length; index++) {
    const currentFood = foodData[index]
    if (currentFood.fish === true) {
      returnArray.push(currentFood)
    }
  }

  return returnArray

}
//Returns an array with all food items containing LACTOSE
function getAllLactose() {
  const returnArray = [];

  for (let index = 0; index < foodData.length; index++) {
    const currentFood = foodData[index]
    //Checks if GLUTEN free is false, if so the food contains lactose
    if (currentFood.lactoseFree === false) {
      returnArray.push(currentFood)
    }
  }

  return returnArray

}
//Returns an array with all food items containing GLUTEN
function getAllGluten() {
  const returnArray = [];

  for (let index = 0; index < foodData.length; index++) {
    const currentFood = foodData[index]
    //Checks if GLUTEN free is false, if so the food contains lactose
    if (currentFood.glutenFree === false) {
      returnArray.push(currentFood)
    }
  }

  return returnArray

}

function removeGluten(foodArray) {
  // Use the filter method to create a new array without gluten foods
  const withoutGluten = foodArray.filter(food => food.glutenFree);

  return withoutGluten;
}
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
changelangEng.addEventListener("click", function () {
  changeLang(langEn);
  //Set the var for selecting the right language in the json file
  clearMenuCard()
  foodDataLangSelect = 1;
  outputToDiv()
});

changelangSe.addEventListener("click", function () {
  changeLang(langSe);
  //Set the var for selecting the right language in the json file
  clearMenuCard()
  foodDataLangSelect = 0;
  outputToDiv()
});
function changeLang(languageFile) {
  for (var key in languageFile) {
    if (languageFile.hasOwnProperty(key)) {
      var elements = document.querySelectorAll('[data-translate="' + key + '"]');
      for (var i = 0; i < elements.length; i++) {
        elements[i].textContent = languageFile[key];
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
      <h3>${dish.disheName},  ${dish.price[0]}kr /  ${dish.price[1]}kr</h3>
      <p>${dish.about}</p>
    `;
  } else {
    // If no half-price is defined, display the regular price
    menuDetailsHTML = `
      <h3>${dish.disheName[foodDataLangSelect]} ${dish.price}kr</h3>
      <p>${dish.about[foodDataLangSelect]}</p>
    `;
  }

  mbDiv.insertAdjacentHTML("beforeend", menuDetailsHTML); // Insert the HTML content
  cardBody.appendChild(mbDiv);                            // Append the margin div to the card body
  menuCard.appendChild(cardBody);                         // Append the card body to the menu card
  const divOutput = document.getElementById("output");
  divOutput.appendChild(menuCard);
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
function updateMenu(){
  clearMenuCard();
  outputToDiv();
}