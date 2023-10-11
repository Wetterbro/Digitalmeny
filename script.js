
const changelangEng = document.getElementById("englishButton");
const changelangSe = document.getElementById("swedishButton");

//Fetches json data
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
const foodData = await fetchData("./index.json");

//If is better then remove
//const langEn = await fetchData("./english.json");
//const langSe = await fetchData("./swedish.json");
//console.log(foodData);

/* ------ FILTER FUNCTIONS ------- */

//returns an array with all VEGAN food items
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
changelangEng.addEventListener("click", function() {
  
  changeLang(langEn);
  //Set the var for selecting the right language in the json file
});

changelangSe.addEventListener("click", function() {
  changeLang(langSe);
  //Set the var for selecting the right language in the json file
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


