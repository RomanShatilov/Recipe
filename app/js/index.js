'use strict';

//Main variables

let recipe = new Recipe();

let index               = 0;
let data                = 0;
let body                = document.querySelector('body');
let storageName         = 'recipeList';
let recipeList          = [];
let animationTransition = 400;
let recipeWrapper       = document.body.querySelector('.recipe__list');
let recipeJson          = JSON.stringify(recipeList);
let modal               = document.querySelector('.recipe__modal');
let recipeListLength    = recipeList.length;
let ingredientAdd       = document.querySelector(".ingredient-add");
let ingredientEdit      = document.querySelectorAll(".ingredient-edit");
let ingredientRemove    = document.querySelectorAll(".ingredient-remove");
let createRecipe        = document.querySelector(".recipe__add__button button");
let editRecipe          = document.querySelector(".recipe__edit__button");

data = [
  {
    "id": 1,
    "name": "Hot or Cold Vegetable Frittata",
    "description": "Not your typical zucchini quiche. This fantastic medley of fresh veggies may be served either hot or cold. You can even cut it into small pieces and serve as finger food!",
    "img": "img/recipe/img_1.png",
    "ingredients": [
      "3 tablespoons vegetable oil",
      "1 ½ cups chopped zucchini",
      "¾ cup chopped onion",
      "¾ cup chopped green bell pepper"
    ]
  },
  {
    "id": 2,
    "name": "Bacon and Egg Doughnuts",
    "description": "I've always wanted to try making some kind of sweet/savory bacon-studded fritter using pate a choux, also known as that stuff you make cream puffs with. I went full breakfast theme, and topped mine with a little maple syrup, but feel free to get your beignet on, and cover them with a pile of powdered sugar.",
    "img": "img/recipe/img_4.png",
    "ingredients": [
      "1 cup cold water",
      "2 tablespoons cold water",
      "½ cup butter",
      "2 tablespoons white sugar",
      "¼ teaspoon salt",
      "⅛ teaspoon freshly grated nutmeg",
      "1 cup all-purpose flour"
    ]
  },
  {
    "id": 3,
    "name": "Easy Shakshuka",
    "description": "This is a slightly modified version of a popular Middle Eastern breakfast dish. I love this recipe because it is easy, healthy, and satisfying. You can also make this with fresh tomato and jalapeno, but I like to use the canned version so I can make it whenever I want with ingredients from my pantry.",
    "img": "img/recipe/img_3.png",
    "ingredients": [
      "1 tablespoon olive oil",
      "2 cloves garlic, minced",
      "1 onion, cut into 2 inch pieces",
      "1 green bell pepper, cut into 2 inch pieces",
      "1 (28 ounce) can whole peeled plum tomatoes with juice",
      "1 teaspoon paprika, or to taste",
      "2 slices pickled jalapeno pepper, finely chopped",
      "4 eggs"
    ]
  }
];

//Texts

let addTitleText = 'Add new recipe';
let addButtonText = 'Add';

let editTitleText = 'Edit recipe';
let editButtonText = 'Save';

let viewTitleText = 'View recipe';

//General functions

function toggleClass(item, name) {
  if (item.classList.contains(name)) {
    item.classList.remove(name);
  } else {
    item.classList.add(name);
  }
  return false;
}

function masonry() {
  let colCount = 3;
  if (window.innerWidth < 1200 && window.innerWidth > 768) {
    colCount = 2;
  } else if (window.innerWidth < 768) {
    colCount = 1;
  }
  let colHeights = [];
  for (let i = 0; i <= colCount; i++) {
    colHeights.push(0);
  }
  for (let i = 0; i < recipeWrapper.children.length; ++i) {
    let order = (i + 1) % colCount || colCount;
    let width = recipeWrapper.offsetWidth / colCount;
    recipeWrapper.children[i].style.order = order;
    recipeWrapper.children[i].style.width = `${width}px`;
    colHeights[order] += parseFloat(recipeWrapper.children[i].offsetHeight);
  }
  let highest = Math.max.apply(Math, colHeights);
  recipeWrapper.style.height = `${highest}px`;
}

function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    let image = document.querySelector('.form__input__img img');
    reader.onload = function (e) {
      image.setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function inputValid(input) {
  document.querySelectorAll(input).forEach(function (item) {
    item.onchange = function () {
      if (this.value !== '') {
        this.classList.add('valid');
      } else {
        this.classList.remove('valid');
      }
    };
    if (item.value !== '') {
      item.classList.add('valid');
    } else {
      item.classList.remove('valid');
    }
  });
  return null;
}

//Recipe start
function createCORSRequest(method, url){
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open(method, url, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        rawFile.responseText
      }
    };
  return rawFile;
}

function recipeItemHtml(id, img, name, description, ingredients) {

  let ingredientsList = [];
  ingredients.forEach(function (item) {
    ingredientsList.push(`<div class="recipe__list__item__ingredients__item">${item}</div>`);
  });

  let itemData = `
  data-id="${id}" 
  data-img="${img}" 
  data-name="${name}" 
  data-description="${description}" 
  `;

  let recipeItemElement = `<div id="recipe-${id}" data-id="${id}" class="recipe__list__item__inner">`;
  recipeItemElement += `<div class="recipe__list__item__data" ${itemData}></div>`;
  recipeItemElement += `<div class="recipe__list__item__bg" style="background-image: url('${img}')"></div>`;
  recipeItemElement += `<div class="recipe__list__item__wrapper">`;
  recipeItemElement += `<div class="recipe__list__item__title" data-id="${id}">`;
  recipeItemElement += `<div class="recipe__list__item__title__text"><h2>${name}</h2></div>`;
  recipeItemElement += `<div class="recipe__list__item__title__buttons">`;
  recipeItemElement += `<div class="recipe__list__item__title__buttons__edit"><button data-id="${id}">Edit</button></div>`;
  recipeItemElement += `<div class="recipe__list__item__title__buttons__remove"><button data-id="${id}">Remove</button></div>`;
  recipeItemElement += `</div>`;
  recipeItemElement += `</div>`;
  recipeItemElement += `<div class="recipe__list__item__content"><p>${description.substring(0, 250)}...</p></div>`;
  recipeItemElement += `<div class="recipe__list__item__ingredients">${ingredientsList}</div>`;
  recipeItemElement += '</div>';
  recipeItemElement += '</div>';
  recipeItemElement += '</div>';

  return recipeItemElement;
}

//Load recipes from JSON file
function loadRecipes(getRecipes) {
  let arr = {};

  for (let item in getRecipes) {
    if (getRecipes.hasOwnProperty(item)) {
      let recipe = getRecipes[item];
      let id = recipe.id;
      let name = recipe.name;
      let img = recipe.img;
      // let img = 'img/recipe/img_1.png';
      let description = recipe.description;
      let ingredients = recipe.ingredients;
      let recipeItem = document.createElement('div');


      recipeItem.setAttribute('class', 'recipe__list__item');

      recipeItemHtml(id, name, img, description, ingredients);

      recipeItem.innerHTML = recipeItemHtml(id, img, name, description, ingredients);
      // recipeWrapper.prepend(recipeItem);
      recipeWrapper.appendChild(recipeItem);

      arr = {
        'id': id,
        'name': name,
        'img': img,
        'description': description,
        'ingredients': {}
      };

      index++;

      recipeList.push(arr);
    }
  }
  return null;
}

function closeModal(item) {
  document.querySelectorAll(item).forEach(function (button) {
    button.onclick = function () {
      let name = document.querySelector('#name-recipe-add');
      let img = document.querySelector('.form__input__img img');
      let description = document.querySelector('#description-recipe-add');
      let ingredients = document.querySelectorAll('.recipe__add .ingredients__item');

      setTimeout(function () {
        name.value = '';
        img.setAttribute('src', 'img/empty.jpg');
        description.value = '';
        ingredients.forEach(function (ingredient) {
          ingredient.remove();
        });
        modal.classList.remove('recipe__view');
        modal.classList.remove('recipe__add');
      }, animationTransition);
      body.classList.remove('modal_active');
    };
  })
}

function createRecipeItem(getRecipe) {

  let recipe = getRecipe;
  let id = recipe[0];
  let name = recipe[1];
  let img = recipe[2];
  let description = recipe[3];
  let ingredients = recipe[4];
  let recipeItem = document.createElement('div');

  recipeItem.setAttribute('class', 'recipe__list__item');
  recipeItemHtml(id, name, img, description, ingredients);
  recipeItem.innerHTML = recipeItemHtml(id, img, name, description, ingredients);
  // recipeWrapper.prepend(recipeItem);
  recipeWrapper.appendChild(recipeItem);

  return null;
}

function editRecipeItem(getRecipe) {

  let recipe = getRecipe;
  let id = `recipe-${recipe[0]}`;
  let name = recipe[1];
  let img = recipe[2];
  let description = recipe[3];
  let ingredients = recipe[4];

  let data = new Recipe();
  let item = data.getRecipeId(id);

  return item;
}

function buttonRemove(id) {
  let indexId = +id;
  let itemId = 'recipe-' + indexId;
  recipe.removeRecipe(itemId);
  return null;
}

function buttonEdit(id) {
  let indexId = +id;
  let itemId = 'recipe-' + indexId;
  return recipe.editRecipe(itemId);
}

function removeRecipeItem() {
  document.querySelectorAll('.recipe__list__item__title__buttons__remove button').forEach((item) => {
    item.onclick = function () {
      buttonRemove(this.getAttribute('data-id'));
      masonry();
    };
  });
}

createRecipe.onclick = function (e) {

  e.preventDefault();
  let arr = {};
  let recipeEditStatus = e.target.classList.contains('recipe__edit__button');
  let name = document.querySelector('#name-recipe-add');
  let description = document.querySelector('#description-recipe-add');
  let imageInput = document.querySelector('#img-recipe-add');
  let imageForm = document.querySelector('.form__input__img img');
  let ingredients = document.querySelectorAll('.ingredients__item');
  let ingredientsInput = document.querySelectorAll('.ingredients__item input');
  let ingredientsArr = [];
  let nameVal = (name.value !== '') ? name.value : null;
  let file = [];
  let reader = new FileReader();
  reader.onload = (e) => {
    imageForm.setAttribute('src', e.target.result);
    file.push(e.target.result);
    reader.readAsDataURL(imageInput.files[0]);
  };
  let imgVal = (imageForm.getAttribute('src') !== '') ? imageForm.getAttribute('src') : 'img/recipe/img_1.png';

  ingredientsInput.forEach(function (item) {
    ingredientsArr.push(item.value);
  });

  let descriptionVal = (description.value !== '') ? description.value : null;

  if (nameVal !== null && descriptionVal !== null) {
    if (recipeEditStatus) {
      let item = buttonEdit(this.getAttribute('data-id'));
      let itemData = item.querySelector('.recipe__list__item__data');

      let id = e.target.getAttribute('data-id');
      arr = {'id': id, 'name': nameVal, 'img': imgVal, 'description': descriptionVal, 'ingredients': ingredientsArr};

      recipe = new Recipe(arr);
      let recipeItem = editRecipeItem(recipe.getRecipe());

      let name = recipeItem.querySelector('.recipe__list__item__title__text h2');
      let image = recipeItem.querySelector('.recipe__list__item__bg');
      let description = recipeItem.querySelector('.recipe__list__item__content p');
      let ingredients = recipeItem.querySelector('.recipe__list__item__ingredients');
      let ingredientsCurrent = recipeItem.querySelectorAll('.recipe__list__item__ingredients__item');
      ingredientsCurrent.forEach(function (item) {
        item.remove();
      });
      name.innerHTML = nameVal;
      description.innerHTML = `${descriptionVal.substring(0, 250)}...`;
      image.setAttribute('style', `background-image: url("${imgVal}"`);

      let ingredientsList = [];
      ingredientsArr.forEach(function (item) {
        ingredientsList.push(`<div class="recipe__list__item__ingredients__item">${item}</div>`);
      });
      ingredients.innerHTML = ingredientsList;
      itemData.setAttribute('data-name', nameVal);
      itemData.setAttribute('data-description', descriptionVal);
      itemData.setAttribute('data-img', imgVal);
      if (editRecipeItem) {
        setTimeout(function () {
          document.querySelector('.recipe__modal .form').reset();
          recipeItem.querySelectorAll('.ingredients__item').forEach(function (item) {
            item.remove();
          });
          imageForm.setAttribute('src', 'img/empty.jpg');
          imageInput.value = '';
          body.classList.remove('modal_active');
          removeRecipeItem();
        }, animationTransition);
      }

    } else {
      index++;
      arr = {'id': index, 'name': nameVal, 'img': imgVal, 'description': descriptionVal, 'ingredients': ingredientsArr};
      recipeList.push(arr);

      // recipeJson = JSON.stringify(recipeList);
      // localStorage.setItem(storageName, recipeJson);

      recipe = new Recipe(arr);
      createRecipeItem(recipe.getRecipe());
      if (createRecipeItem) {
        setTimeout(function () {
          document.querySelector('.recipe__modal .form').reset();
          ingredients.forEach(function (item) {
            item.remove();
          });
          imageForm.setAttribute('src', 'img/empty.jpg');
          imageInput.value = '';
          body.classList.remove('modal_active');
          masonry();
          removeRecipeItem();
        }, animationTransition);
      }
    }
    return true;
  }
  return false;
};

function openModalRecipeItem() {
  document.querySelectorAll('.recipe__list__item__title').forEach((item) => {
    item.onclick = function (e) {
      e.preventDefault();
      if(e.target.tagName !== 'BUTTON'){
        document.querySelector('.modal__title__text h2').innerHTML = viewTitleText;
        createRecipe.innerHTML = editButtonText;
        modal.classList.add('recipe__view');

        body.classList.add('modal_active');

        let item = buttonEdit(this.getAttribute('data-id'));
        let itemData = item.querySelector('.recipe__list__item__data');
        let name = document.querySelector('.form__content__title h2');
        let img = document.querySelector('.form__content__img img');
        let description = document.querySelector('.form__content__description p');
        let ingredients = document.querySelector('.form__content__ingredients ul');

        let itemName = itemData.getAttribute('data-name');
        let itemImg = itemData.getAttribute('data-img');
        let itemDescription = itemData.getAttribute('data-description');
        let itemIngredients = item.querySelectorAll('.recipe__list__item__ingredients__item');

        name.innerHTML = itemName;
        img.setAttribute('src', itemImg);
        description.innerHTML = itemDescription;

        ingredients.querySelectorAll('li').forEach(function (e) {
          e.remove();
        });
        itemIngredients.forEach(function (ingredient) {
          let item = document.createElement("LI");
          let text = document.createTextNode(ingredient.innerHTML);
          item.appendChild(text);
          ingredients.appendChild(item);
        });
      } else {
        return false;
      }
    };
  });
}

function editModalRecipeItem() {
  document.querySelectorAll('.recipe__list__item__title__buttons__edit button').forEach((item) => {
    item.onclick = function (e) {
      e.preventDefault();

      document.querySelector('.modal__title__text h2').innerHTML = editTitleText;
      createRecipe.innerHTML = editButtonText;
      createRecipe.classList.add('recipe__edit__button');
      createRecipe.setAttribute('data-id', this.getAttribute('data-id'));

      setTimeout(function () {
        modal.classList.remove('recipe__view');
      }, animationTransition);
      body.classList.add('modal_active');

      let item = buttonEdit(this.getAttribute('data-id'));
      let itemData = item.querySelector('.recipe__list__item__data');
      let name = document.querySelector('#name-recipe-add');
      let img = document.querySelector('.form__input__img img');
      let description = document.querySelector('#description-recipe-add');
      let ingredientsList = document.querySelectorAll('.ingredients__item');

      let itemName = itemData.getAttribute('data-name');
      let itemImg = itemData.getAttribute('data-img');
      let itemDescription = itemData.getAttribute('data-description');
      let itemIngredients = item.querySelectorAll('.recipe__list__item__ingredients__item');

      name.value = itemName;
      img.setAttribute('src', itemImg);
      description.value = itemDescription;
      ingredientsList.forEach(function (ingredient) {
        ingredient.remove();
      });
      itemIngredients.forEach(function (ingredient) {
        addIngredient(ingredient.innerHTML)
      });
      ingredientActions(ingredientEdit, ingredientRemove);
      inputValid('input[type="text"]');
      inputValid('textarea');
      //checkpoint
      // itemIngredients.forEach(function (item) {
      //   item.remove();
      //   console.log(item);
      // });
    };
  });
}

function addIngredient(item = null) {
  let ingredientsWrapper = document.querySelector('.ingredients');
  let input = document.querySelector('#ingredient-add');
  let ingredientItem = document.createElement('div');
  let inputVal = (item) ? item : input.value;

  if (inputVal !== '' && inputVal !== undefined) {
    input.parentElement.classList.remove('error');
    ingredientItem.setAttribute('class', 'form__input ingredients__item');

    let ingredientItemElement = `<input id="ingredient" value="${inputVal}" disabled>`;
    ingredientItemElement += `<div class="ingredient__add__button__wrapper">`;
    ingredientItemElement += `<button class="ingredient__button ingredient__edit">Edit</button>`;
    ingredientItemElement += `<button class="ingredient__button ingredient__remove">Remove</button>`;
    ingredientItemElement += `</div>`;

    ingredientItem.innerHTML = ingredientItemElement;
    ingredientsWrapper.appendChild(ingredientItem);

    ingredientEdit = document.querySelectorAll(".ingredient__edit");
    ingredientRemove = document.querySelectorAll(".ingredient__remove");
    return true;
  } else {
    input.parentElement.classList.add('error');
    return false;
  }
}

function editIngredient(item) {
  let input = item.parentElement.parentElement.firstChild;
  if (!input.classList.contains('edit')) {
    input.removeAttribute('disabled');
    input.classList.add('edit');
    item.innerHTML = 'Save';
  } else {
    input.setAttribute('disabled', 'disabled');
    input.classList.remove('edit');
    item.innerHTML = 'Edit';
  }
}

function removeIngredient(item) {
  let input = item.parentElement.parentElement;
  input.remove();
}

function ingredientActions(edit = null, remove = null) {
  let editBtn = (edit) ? edit : ingredientEdit;
  let removeBtn = (remove) ? remove : ingredientRemove;
  editBtn.forEach(function (item) {
    item.onclick = function (e) {
      e.preventDefault();
      editIngredient(item);
    }
  });
  removeBtn.forEach(function (item) {
    item.onclick = function (e) {
      e.preventDefault();
      removeIngredient(item);
    }
  });
}

ingredientAdd.onclick = function (e) {
  e.preventDefault();
  addIngredient();
  ingredientActions();
};

document.querySelector('.header__button button').onclick = function () {
  toggleClass(body, 'modal_active');
  toggleClass(modal, 'recipe__add');
  document.querySelector('.modal__title__text h2').innerHTML = addTitleText;
  createRecipe.innerHTML = addButtonText;
  createRecipe.classList.remove('recipe__edit__button');
  let ingredients = document.querySelectorAll('.recipe__add .ingredients__item');
  let input = document.querySelectorAll('.valid');
  ingredients.forEach(function (item) {
    item.remove();
  });
  input.forEach(function (item) {
    item.classList.remove('valid');
  });
};

closeModal('.recipe__modal__close');

document.querySelector(".form__input__img input").onchange = function () {
  readURL(this);
};

//Callbacks

window.onresize = () => {
  masonry();
};

document.body.onload = function () {
  inputValid('input[type="text"]');
  inputValid('textarea');
  loadRecipes(data);
  index = (data.length) ? data.length : 0;
  recipeJson = JSON.stringify(recipeList);
  localStorage.setItem(storageName, recipeJson);
  masonry();
  removeRecipeItem();
  editModalRecipeItem();
  openModalRecipeItem();
};