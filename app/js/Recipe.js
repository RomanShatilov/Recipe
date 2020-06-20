class Recipe {

  constructor(id, status, title, description) {
    this.id = id;
    this.status = status;
    this.title = title;
    this.description = description;
  }

  getRecipeFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    };
    rawFile.send(null);
  }

  getRecipe(){
    return [this.id, this.status, this.title, this.description];
  }

  getRecipeById(id){
    return document.getElementById(id);
  }

  removeRecipe(id){
    let RecipeId = this.getRecipeById(id);
    RecipeId.remove();
  }
}