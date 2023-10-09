
// impoterar JSON filen och sparar den.
//impoterar "File system" modulen 
let fs = require("fs");
const fromJSON = fs.readFileSync("./test.json")
const dishesData = JSON.parse(fromJSON);

/*
const selectedDish = dishesData[1]; 
dishesData.forEach(element => {
    if (element.vegan === true) {
        console.log(element.disheName);
        console.log("This dish is vegan.");
    } else {
        console.log(element.disheName);
        console.log("This dish is not vegan.");
    }  
});
*/

