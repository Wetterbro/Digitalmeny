
async function fetchJsonData() {
    try {
      const response = await fetch("index.json");
      const dishesData = await response.json();
    
      dishesData.forEach(element => {
        if (element.vegan === true) {
          console.log(element.disheName);
          console.log("This dish is vegan.");
        } else {
          console.log(element.disheName);
          console.log("This dish is not vegan.");
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  fetchJsonData();

