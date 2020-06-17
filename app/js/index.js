//
// function resizeGridItem(item){
//   let grid = document.getElementsByClassName("recipe__list")[0];
//   let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
//   let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
//   let rowSpan = Math.ceil((item.querySelector('.recipe__list__item__wrapper').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
//   item.style.gridRowEnd = "span " + rowSpan;
//   console.log(rowSpan);
// }
// let allItems = document.getElementsByClassName("recipe__list__item");
//
// function resizeAllGridItems(){
//   for(let x = 0; x < allItems.length; x++){
//     resizeGridItem(allItems[x]);
//   }
// }
//
// function resizeInstance(instance){
//   let item = instance.elements[0];
//   resizeGridItem(item);
// }
//
// window.onload = resizeAllGridItems();
// window.addEventListener("resize", resizeAllGridItems);
//
// allItems = document.getElementsByClassName("recipe__list__item");