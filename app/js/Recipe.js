class Recipe {

  constructor({id, name, img, description, ingredients} = {}) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.description = description;
    this.ingredients = ingredients;
  }

  // getRecipeFile(file) {
  //   let rawFile = new XMLHttpRequest();
  //   rawFile.overrideMimeType("application/json");
  //   rawFile.open("GET", file, false);
  //   rawFile.onreadystatechange = function () {
  //     if (rawFile.readyState === 4 && rawFile.status == "200") {
  //       rawFile.responseText
  //     }
  //   };
  //   return rawFile;
  // }

  getRecipe(){
    return [this.id, this.name, this.img, this.description, this.ingredients];
  }

  getRecipeId(id){
    return document.getElementById(id);
  }

  editRecipe(id){
    let RecipeId = this.getRecipeId(id);
    return RecipeId;
  }

  removeRecipe(id){
    let RecipeId = this.getRecipeId(id);
    RecipeId.parentElement.remove();
  }
}