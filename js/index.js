/// <reference types="../@types/jquery" />

$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(1000)
        $("body").css("overflow", "visible");
    })
});

//////////////////////////////////////////////////////////////////////////////////////

function openSideNav() {
    $("#sidebar").animate({left: 0}, 500);
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");
    
    for (let i = 0; i < 5; i++) {
        $("#sidebar .content .links li").eq(i).animate({top: 0}, (i + 5) * 100);
    }
}

function closeSideNav() {
    let sidebarContentWidth = $(".sidebar .content .text").outerWidth();
    $(".sidebar").animate({left: -sidebarContentWidth}, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon ").removeClass("fa-x");


    $("#sidebar .content .links li").animate({top: 500}, 500);
}
closeSideNav();

$(".sidebar .content .icons .openColse").on("click", () => {
    if ($(".sidebar").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

///////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////

let mealContainer = document.querySelector("#mealContainer");
let mealContent = document.querySelector("#mealContainer #mealContent");

let rowData = document.querySelector("#rowData")

let mealCategories = document.querySelector("#mealContainer #mealCategories");
let categoriesIcon = document.querySelector("#categoriesIcon");

///////////////////////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////////////////////////////

function displayMeals(idx) {
    let cartoona = "";

    for (let i = 0; i < idx.length; i++) {
        cartoona += `
                    <div class="col-md-3">
                        <div onclick="getMealDetails('${idx[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 mb-3">
                            <img class="w-100" src="${idx[i].strMealThumb}" alt="" srcset="">
                            <div class="meal-layer position-absolute d-flex align-items-center bottom-0 start-0 end-0 bg-white text-black p-2">
                                <h3>${idx[i].strMeal}</h3>
                            </div>
                        </div>
                    </div>
                `;
    }
    rowData.innerHTML = cartoona;
}

async function getMealDetails(mealID) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(500);
    searchContent.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0]);
    $(".inner-loading-screen").fadeOut(500);

}


function displayMealDetails(meal) {
    
    searchContent.innerHTML = "";
    let ingredients = ``;

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let boxDetails = `
                    <div class="col-md-4">
                        <img class="w-100 rounded-3" src="${meal.strMealThumb}"alt="">
                        <h2>${meal.strMeal}</h2>
                    </div>

                    <div class="col-md-8">
                        <h2>Instructions</h2>
                        <p>${meal.strInstructions}</p>
                        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                        <h3>Recipes :</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">
                            ${ingredients}
                        </ul>

                        <h3>Tags :</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">
                            ${tagsStr}
                        </ul>

                        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                    </div>
                `;

    rowData.innerHTML = boxDetails;
}

///////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////////////////////////////////////////////////////

let searchContent = document.querySelector("#searchContent");
let searchIcon = document.querySelector("#searchIcon");

function showSearchInputs() {
    searchContent.innerHTML = `
                                <div class="inputs">
                                    <div class="row py-4 ">
                                        <div class="col-md-6 ">
                                            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
                                        </div>
                                        <div class="col-md-6">
                                            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
                                        </div>
                                    </div>
                                </div>
                            `;

    rowData.innerHTML = "";
}

searchIcon.addEventListener("click", function () {
    showSearchInputs();
    closeSideNav();
});

async function searchByName(term) {
    closeSideNav();
    rowData.innerHTML = ``;
    $(".inner-loading-screen").fadeIn(500);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(500);

}

async function searchByFLetter(term) {
    closeSideNav();
    rowData.innerHTML = ``;
    $(".inner-loading-screen").fadeIn(500);

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    $(".inner-loading-screen").fadeOut(500);
}


///////////////////////////////////////////////////////////////////////////////////









///////////////////////////////////////////////////////////////////////////////////


async function getCategories() {
    rowData.innerHTML = ``;
    $(".inner-loading-screen").fadeIn(500);
    searchContent.innerHTML = ``;

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();

    displayCategories(response.categories);
    $(".inner-loading-screen").fadeOut(500);

}
categoriesIcon.addEventListener("click", function() {
    closeSideNav();
    getCategories();
});

function displayCategories(idx) {
    let boxCategories = "";

    for (let i = 0; i < idx.length; i++) {
        boxCategories += `
                        <div class="col-md-3">
                            <div onclick="getCategoryMeals('${idx[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 mb-3">
                                <img class="w-100" src="${idx[i].strCategoryThumb}" alt="">
                                <div class="meal-layer position-absolute text-center bottom-0 start-0 end-0 bg-white text-black p-2">
                                    <h3>${idx[i].strCategory}</h3>
                                    <p>${idx[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                                </div>
                            </div>
                        </div>
                    `;
    }

    rowData.innerHTML = boxCategories;
}

async function getCategoryMeals(category) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(500);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();


    displayMeals(response.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(500);

}



///////////////////////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////////////////////////////

let areaIcon = document.querySelector("#areaIcon");
async function getArea() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(500);
    searchContent.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayArea(respone.meals)
    $(".inner-loading-screen").fadeOut(500);

}
areaIcon.addEventListener("click", function () {
    getArea();
    closeSideNav();
});


function displayArea(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
                    <div class="col-md-3">
                        <div onclick="getAreaMeals('${arr[i].strArea}')" class="mealArea rounded-2 text-center mb-3">
                                <i class="fa-solid fa-house-laptop fa-4x"></i>
                                <h3>${arr[i].strArea}</h3>
                        </div>
                    </div>
                `;
    }

    rowData.innerHTML = cartoona
}


async function getAreaMeals(area) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(500);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(500);

}

///////////////////////////////////////////////////////////////////////////////////








///////////////////////////////////////////////////////////////////////////////////

let ingredientsIcon = document.querySelector("#ingredientsIcon");

async function getIngredients() {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(500);
    searchContent.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayIngredients(respone.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(500)

}
ingredientsIcon.addEventListener("click", function () {
    getIngredients();
    closeSideNav();
});


function displayIngredients(arr) {
    let boxIngredients = "";

    for (let i = 0; i < arr.length; i++) {
        boxIngredients += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = boxIngredients;
}

async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(500);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(500);

}


///////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////////////////////////////////////////////////////

let submitBtn;
let contactIcon = document.querySelector("#contactIcon");

function showContacts() {
    rowData.innerHTML = `
                        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
                            <div class="container w-75 text-center">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Special characters and numbers not allowed
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Email not valid *exemple@yyy.zzz
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid Phone Number
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid age
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid repassword 
                                        </div>
                                    </div>
                                </div>
                                <button id="submitBtn" disabled class="submitBtn btn btn-outline-danger px-2 mt-5">Submit</button>
                            </div>
                        </div> 
                    `;
    submitBtn = document.getElementById("submitBtn");


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true;
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true;
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true;
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true;
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true;
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true;
    })
}
contactIcon.addEventListener("click", function () {
    showContacts();
    closeSideNav();
});


let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block");

        }
    }

    if (emailInputTouched) {
        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none");;
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block");
        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
        }
    }


    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() &&repasswordValidation()) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
}


function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value));
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value));
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value));
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value));
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value));
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
}



///////////////////////////////////////////////////////////////////////////////////