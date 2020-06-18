class RecipeList {

  constructor(id, status, title, description) {
    this.id = id;
    this.status = status;
    this.title = title;
    this.description = description;
  }

  getRecipe(){
    return [this.id, this.status, this.title, this.description];
  }

  getRecipeById(id){
    return document.getElementById(id);
  }

  removeRecipe(id){
    console.log(id);
    let RecipeId = this.getRecipeById(id);
    RecipeId.remove();
  }
}