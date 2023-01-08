const recipes = document.querySelector(".recipes");
const title = ["BREAKFAST", "LUNCH", "DINNER"];
const APIkey = "dc377628a1814736b158066c9cfab78c";

let dailyCalories;
const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
const userForm = document.getElementById("user-form");
const formBtn = document.querySelector(".form-btn");
const recipe = document.getElementById("recipe");
const mealCard = document.querySelector(".meal-card");
const mealPlan = document.getElementById("mealplan");
const recipeS = document.getElementById("recipe-s");
const ingredientS = document.getElementById("ingredients");
const steps = document.getElementById("steps");
const equipmentS = document.getElementById("equipment");

formBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const activity = document.getElementById("activity").value;

  console.log(weight, height, age, gender, activity);

  if (weight < 1 || height < 1 || age < 1) {
    alert(`Fill input field`);
  } else {
    let bmr;
    if (gender === "male") {
      bmr = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
    } else {
      bmr = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
    }

    if (activity === "light") {
      dailyCalories = bmr * 1.375;
    } else if (activity === "moderate") {
      dailyCalories = bmr * 1.55;
    } else {
      dailyCalories = bmr * 1.725;
    }
    generatemeal(bmr);
  }
});

const generatemeal = async (bmr) => {
  const url = `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${dailyCalories}&apiKey=${APIkey}&includeNutrition=true`;
  let datas;
  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      datas = data;
    });
  generateMealsCard(datas);
  document.getElementById("loader").style.display = "none";
};

const generateMealsCard = (datas) => {
  let html = ``;

  datas.meals.map(async (meal, i) => {
    const url = `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=${APIkey}&includeNutrition=false`;
    let imgURL;
    console.log(i);
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        imgURL = data.image;
      });
    html += `
            <div>
                <div class="meal-card">
                   <h1>${title[i]}</h1>
                    <img src=${imgURL} alt="${title[i]}">
                    <div class="card-body">
                        <h3>${meal.title}</h3>
                        <p class="calories p-cal">Calories : ${datas?.nutrients?.calories}</p>
                        <button class="get-recipe btn1-recipe button" onClick="getRecipe(${meal.id})" >Get Recipe</button>
                    </div>
                </div>
            </div>
            `;
    mealPlan.innerHTML = html;
  });
};

const getRecipe = async (data) => {
  recipeS.innerHTML = "";
  ingredientS.innerHTML = "";
  steps.innerHTML = "";
  equipmentS.innerHTML = "";

  const url = `https://api.spoonacular.com/recipes/${data}/information?apiKey=${APIkey}&includeNutrition=false`;
  let information;

  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      information = data;
    });

  recipeS.textContent = `${information.title} Recipe`;

  let htmlData = ``;
  let inCardDiv = document.createElement("div");
  inCardDiv.classList.add("carddesign", "card", "h-100");
  let inCardBody = document.createElement("div");
  inCardBody.classList.add("card-body");
  let inOverlay = document.createElement("div");
  inOverlay.classList.add("overlay");
  let ul = document.createElement("ul");
  information.extendedIngredients.map((ingre) => {
    htmlData += `
            <li>${ingre.original}</li>
            `;
  });
  ul.innerHTML = htmlData;
  let ingreH1 = document.createElement("h3");
  ingreH1.textContent = "INGREDIENTS";
  inCardBody.appendChild(inOverlay);
  inCardBody.appendChild(ingreH1);
  inCardBody.appendChild(ul);
  inCardDiv.appendChild(inCardBody);
  ingredientS.appendChild(inCardDiv);

  let stepsHtml = ``;
  let stCardDiv = document.createElement("div");
  stCardDiv.classList.add("carddesign", "card", "h-100");
  let stCardBody = document.createElement("div");
  stCardBody.classList.add("card-body");
  let stOverlay = document.createElement("div");
  stOverlay.classList.add("overlay");
  let stepsOl = document.createElement("ol");
  information.analyzedInstructions[0].steps.map((step) => {
    stepsHtml += `
            <li>${step.step}</li>
            `;
  });
  stepsOl.innerHTML = stepsHtml;
  let stepsH1 = document.createElement("h3");
  stepsH1.textContent = "STEPS";
  stCardBody.appendChild(stOverlay);
  stCardBody.appendChild(stepsH1);
  stCardBody.appendChild(stepsOl);
  stCardDiv.appendChild(stCardBody);
  steps.appendChild(stCardDiv);

  const urlequip = `https://api.spoonacular.com/recipes/${data}/equipmentWidget.json?apiKey=${APIkey}`;
  let html;

  await fetch(urlequip)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      equip = data;
    });

  let equipData = ``;
  let eqCardDiv = document.createElement("div");
  eqCardDiv.classList.add("carddesign", "card", "h-100");
  let eqCardBody = document.createElement("div");
  eqCardBody.classList.add("card-body");
  let eqOverlay = document.createElement("div");
  eqOverlay.classList.add("overlay");
  let equipUl = document.createElement("ul");
  equip.equipment.map((equip) => {
    equipData += `
                <li>${equip.name}</li>
                `;
  });
  equipUl.innerHTML = equipData;
  let equipH1 = document.createElement("h3");
  equipH1.textContent = "EQUIPMENT";
  eqCardBody.appendChild(eqOverlay);
  eqCardBody.appendChild(equipH1);
  eqCardBody.appendChild(equipUl);
  eqCardDiv.appendChild(eqCardBody);
  equipmentS.appendChild(eqCardDiv);
};

formBtn.addEventListener("click", formBtn);
