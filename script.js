//Imports data to the foodData object as an object from the JSON file
import foodData from "./index.json" assert { type: "json" };








/* ------ Filter functions ------- */

//returns an array with all vegan food items
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

