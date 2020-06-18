let index = null;
let localStorageName = 'recipeList';

let recipeList = new RecipeList();


function buttonRemove(id) {
  let indexId = +id;
  let itemId = 'recipe-' + indexId;

  recipeList.removeRecipe(itemId);

  return null;
}
document.querySelectorAll('.recipe__list__item__title__buttons__remove').forEach((item) => {
  item.onclick = function() {
    buttonRemove(this.getAttribute('id'));
  };
});