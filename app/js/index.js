'use strict';

function toggleClass(item, name) {
  if (item.classList.contains(name)) {
    item.classList.remove(name);
  } else {
    item.classList.add(name);
  }
  return false;
}

function masonry(wrapper) {
  let colCount = 3;
  if (window.innerWidth < 1200) {
    colCount = 2;
  } else if (window.innerWidth < 768) {
    colCount = 2;
  }
  let colHeights = [],
    container = document.querySelector(wrapper);
  for (let i = 0; i <= colCount; i++) {
    colHeights.push(0);
  }
  for (let i = 0; i < container.children.length; i++) {
    let order = (i + 1) % colCount || colCount;
    container.children[i].style.order = order;
    colHeights[order] += parseFloat(container.children[i].offsetHeight);
  }
  let highest = Math.max.apply(Math, colHeights);
  container.style.height = `${highest}px`;
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

function header() {
  let header = document.querySelector('.header');
  let headerSize = header.offsetHeight + 50;
  if (pageYOffset > headerSize) {
    header.classList.add('scroll');
  } else {
    header.classList.remove('scroll');
  }
}

document.querySelector('.header__button button').onclick = function () {
  let add = document.querySelector('.recipe__add');
  let body = document.querySelector('body');
  toggleClass(add, 'active');
  toggleClass(body, 'modal_active');
};

window.addEventListener('scroll', () => {
  // header();
});

window.addEventListener('load', () => {
  // header();
  document.querySelector('.main').style.marginTop = `${document.querySelector('.header').offsetHeight}px`;
  document.querySelector('.recipe__add').style.top = `${document.querySelector('.header').offsetHeight}px`;
});

let recipeList = new Recipe();

let index = null;
let data = null;
let recipeWrapper = document.body.querySelector('.recipe__list');

recipeList.getRecipeFile("/json/recipes.json", function (text) {
  data = JSON.parse(text);
});

function buttonRemove(id) {
  let indexId = +id;
  let itemId = 'recipe-' + indexId;

  recipeList.removeRecipe(itemId);

  return null;
}

function loadRecipes(getRecipes) {

  for (let item in getRecipes) {
    if (data.hasOwnProperty(item)) {

      let recipe = data[item];
      let id = recipe.id;
      let name = recipe.name;
      let img = recipe.img;
      let description = recipe.description;
      let recipeItem = document.createElement('div');

      recipeItem.setAttribute('class', 'recipe__list__item');

      let recipeItemElement = `<div id="recipe-${id}" class="recipe__list__item__inner">`;
      recipeItemElement += `<div class="recipe__list__item__bg" style="background-image: url('${img}')"></div>`;
      recipeItemElement += `<div class="recipe__list__item__wrapper">`;
      recipeItemElement += `<div class="recipe__list__item__title">`;
      recipeItemElement += `<div class="recipe__list__item__title__text"><h2>${name}</h2></div>`;
      recipeItemElement += `<div class="recipe__list__item__title__buttons">`;
      recipeItemElement += `<div class="recipe__list__item__title__buttons__edit"><button>Edit</button></div>`;
      recipeItemElement += `<div class="recipe__list__item__title__buttons__remove"><button>Remove</button></div>`;
      recipeItemElement += `</div>`;
      recipeItemElement += `</div>`;
      recipeItemElement += `<div class="recipe__list__item__content"><p>${description}</p></div>`;
      recipeItemElement += '</div>';
      recipeItemElement += '</div>';
      recipeItemElement += '</div>';

      recipeItem.innerHTML = recipeItemElement;
      // recipeWrapper.prepend(recipeItem);
      recipeWrapper.appendChild(recipeItem);
    }
  }
  return null;
}

document.body.onload = loadRecipes(data);
masonry('.recipe__list');
window.onresize = () => {
  masonry('.recipe__list');
};

document.querySelectorAll('.recipe__list__item__title__buttons__remove').forEach((item) => {
  item.onclick = function () {
    buttonRemove(this.getAttribute('id'));
  };
});

function inputValid(input) {
  document.querySelectorAll(input).forEach(function (item) {
    item.onchange = function () {
      if (this.value !== '') {
        this.classList.add('valid');
      } else {
        this.classList.remove('valid');
      }
    };
  });
  return null;
}

inputValid('input[type="text"]');
inputValid('textarea');


document.querySelector(".form__input__img input").onchange = function () {
  readURL(this);
};

let ingredientAdd = document.querySelector(".ingredients__add");
let ingredientEdit = document.querySelectorAll(".ingredient__edit");
let ingredientRemove = document.querySelectorAll(".ingredient__remove");

function addIngredient() {
  let ingredientsWrapper = document.querySelector('.ingredients');
  let input = document.querySelector('#ingredients__add');
  let ingredientItem = document.createElement('div');
  if(input.value !== '' && input.value !== undefined) {
    input.parentElement.classList.remove('error');
    ingredientItem.setAttribute('class', 'form__input ingredients__item');

    let ingredientItemElement = `<input value="${input.value}" disabled>`;
    ingredientItemElement += `<div class="ingredient__add__button__wrapper">`;
    ingredientItemElement += `<button class="ingredient__button ingredient__edit">Edit</button>`;
    ingredientItemElement += `<button class="ingredient__button ingredient__remove">Remove</button>`;
    ingredientItemElement += `</div>`;

    ingredientItem.innerHTML = ingredientItemElement;
    // recipeWrapper.prepend(recipeItem);
    ingredientsWrapper.appendChild(ingredientItem);

    ingredientEdit = document.querySelectorAll(".ingredient__edit");
    ingredientRemove = document.querySelectorAll(".ingredient__remove");
  } else {
    input.parentElement.classList.add('error');
    return false;
  }
}

function editIngredient(item){
  let input = item.parentElement.parentElement.firstChild;
  if(!input.classList.contains('edit')){
    input.removeAttribute('disabled');
    input.classList.add('edit');
    item.innerHTML = 'Save';
  } else {
    input.setAttribute('disabled', 'disabled');
    input.classList.remove('edit');
    item.innerHTML = 'Edit';
  }
}

function removeIngredient(item){
  let input = item.parentElement.parentElement;
  input.remove();
}

ingredientAdd.onclick = function (e) {
  e.preventDefault();
  addIngredient();
  ingredientEdit.forEach(function (item) {
    item.onclick = function (e) {
      e.preventDefault();
      editIngredient(item);
    }
  });
  ingredientRemove.forEach(function (item) {
    item.onclick = function (e) {
      e.preventDefault();
      removeIngredient(item);
    }
  });
};
