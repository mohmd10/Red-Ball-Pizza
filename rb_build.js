"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Case Problem 3

   Author: Mohamed Mohamed
   Date:   10/07/2022
   
   Filename: rb_build.js

*/


var pizzaPrice = {
   size12 : 11,
   size14 : 13,
   size16 : 16,
   stuffed : 3,
   pan : 2,
    doubleSauce : 1.50,
    dobleCheese : 1.50
};

/* Constructor function for the class of cart objects */
function cart() {
   this.totalCost = 0;
   this.items = [];
}

/* Constructyor function for individal food items */
function foodItem() {
   this.price;
   this.qty;
}

/* Method to calculate the cost of each item ordered */
foodItem.prototype.calcItemCost = function() {
   return this.price*this.qty;
};

/* Mathod to return the total cost of the items in the cart */
cart.prototype.calcCartTotal = function() {
   var cartTotal = 0;
   console.log(this.items);
   this.items.forEach(function(item) {
      cartTotal += item.price*item.qty;
   });
   this.totalCost = cartTotal;
   return this.totalCost;
};

/* Method to add the food item to a cart */
foodItem.prototype.addToCart = function(cart) {
   cart.items.push(this);   
};

/* Method to remove a food item from a cart */
foodItem.prototype.removeFromCart = function(cart) {
   for (var i = 0; i < cart.items.length; i++) {
      if (this === cart.items[i]) {
         cart.items.splice(i,1);
         break;
      }
   }
};
/* Constructor function for the class of pizza objects */
function pizza() {
    this.size;
    this.crust;
    this.doubleSauce;
    this.doubleCheese;
    this.toppings = [];
}
/* Constructor function for the class of pizza toppings */
function topping() {
   this.name;
   this.side;
}

/* Make both pizza and topping part of the foodItem prototype chain */

pizza.prototype = new foodItem();
topping.prototype= new foodItem();

/* Method to add a topping to a pizza */
pizza.prototype.addTopping = function(topping) {
  this.toppings.push(topping); //
}; 

pizza.prototype.calcPizzaPrice = function() {

   if (this.size === "12") {
      this.price = pizzaPrice.size12;
   } 
     if (this.size === "14") {
      this.price = pizzaPrice.size14;
   } 
     if (this.size === "16") {
      this.price = pizzaPrice.size16;
   } 
   
   if (this.crust === "stuffed") {
      this.price += pizzaPrice.stuffed;
   } 
   
   if (this.doubleSauce) {
       this.price +=pizzaPrice.doubleSauce;
   }  
   if (this.doubleCheese) {
       this.price +=pizzaPrice.dobleCheese;
   }
   console.log(this);
   for (var i = 0; i < this.toppings.length; i++) {
      this.price += this.toppings[i].qty * this.toppings[i].price ; //
   }
    
   return this.price;
};

function handleToppings(e) {
    handleToppingImage(e);
}


window.addEventListener("load", function(event) {
    
    // Preview image of the pizza 
   var pizzaPreviewBox = document.getElementById("previewBox"); 
   // Summary of the pizza order
   var pizzaSummary =  document.getElementById("pizzaSummary");
   // Pizza size selection list
   var pizzaSizeBox = document.getElementById("pizzaSize");
   // Pizza crust selection list
   var pizzaCrustBox = document.getElementById("pizzaCrust");
   // Pizza double sauce checkbox
   var pizzaDoubleSauceBox =  document.getElementById("doubleSauce");
   // Pizza double cheese checkbox
   var pizzaDoubleCheeseBox = document.getElementById("doubleCheese");
   // Pizza topping option buttons
   var toppingOptions = document.querySelectorAll("input[type=radio][class='topping']");   // Pizza quantity selection list
   var pizzaQuantityBox = document.getElementById("pizzaQuantity");
   // Add to cart button
   var addToCartButton = document.getElementById("addToCart");
   // Order table displaying the items in the shopping cart
   var cartTableBody =  document.getElementById("cartTable");  
   // Shopping cart total box
   var cartTotalBox = document.getElementById("cartTotal");
    
    
    // Event handlers to draw the pizza image
   pizzaSizeBox.onchange = drawPizza;
   pizzaCrustBox.onchange = drawPizza;
   pizzaDoubleSauceBox.onclick = drawPizza;   
   pizzaDoubleCheeseBox.onclick = drawPizza; 
   pizzaQuantityBox.onchange = drawPizza;   
   for (var i = 0; i < toppingOptions.length; i++) {
      toppingOptions[i].onchange = drawPizza; //
   }
    
    // Create a shopping cart object 
   var myCart = new cart();    
   addToCartButton.onclick = addPizzaToCart;

   
   // Function to build the pizza
   function buildPizza(newPizza) {
      
      newPizza.qty = pizzaQuantityBox.selectedValue();      
      newPizza.size = pizzaSizeBox.selectedValue();
      newPizza.crust = pizzaCrustBox.selectedValue();
      newPizza.doubleSauce = pizzaDoubleSauceBox.checked; //
      newPizza.doubleCheese = pizzaDoubleCheeseBox.checked; //

      console.log('Double Sauce:', newPizza.doubleSauce);
      console.log('Double Cheese:', newPizza.doubleCheese);
      
      var checkedToppings = document.querySelectorAll("input.topping:checked");      
      for (var i = 0; i < checkedToppings.length; i++) {
         if (checkedToppings[i].value !== "none") {                       
            var myTopping = new topping() ;            
            myTopping.name = checkedToppings[i].name;
            myTopping.side = checkedToppings[i].value;
            myTopping.price=1.5;      
            if (checkedToppings[i].value === "full") {
               myTopping.qty = 1; //
            } else {
               myTopping.qty = 0.5; //
            }
            newPizza.addTopping(myTopping);   
         }
      }
      

   }
    
    // Function to add the built pizza to the shopping cart
   function addPizzaToCart() { 
      var myPizza = new pizza();     
      buildPizza(myPizza);//
      myPizza.addToCart(myCart); //
      

      var newItemRow = document.createElement("tr");
      cartTableBody.appendChild(newItemRow);
      
      var summaryCell = document.createElement("td");
      summaryCell.textContent = pizzaSummary.textContent;
      newItemRow.appendChild(summaryCell);
      
      var qtyCell = document.createElement("td");
      qtyCell.textContent = pizzaQuantityBox.selectedValue(); //
      newItemRow.appendChild(qtyCell); //
      
      var priceCell = document.createElement("td");
      priceCell.textContent = myPizza.calcPizzaPrice().toLocaleString('en-US', {style: "currency", currency: "USD"});
      newItemRow.appendChild(priceCell);
      
      var removeCell = document.createElement("td");
      var removeButton = document.createElement("input");   
      removeButton.value = "X";
      removeButton.type = "button";      
      removeCell.appendChild(removeButton);
      newItemRow.appendChild(removeCell);
   
      cartTotalBox.value = myCart.calcCartTotal().toLocaleString('en-US', {style: "currency", currency: "USD"});
      
      console.log(myCart);
    
    removeButton.onclick = function() {
         myPizza.removeFromCart(myCart);
         cartTableBody.removeChild(newItemRow);
         cartTotalBox.value = myCart.calcCartTotal().toLocaleString('en-US', {style: "currency", currency: "USD"});
         console.log(myCart);
      };  
      resetDrawPizza();  
      
   } 
    /* Function to draw the pizza image on the page */
   function drawPizza() {
      pizzaPreviewBox.removeChildren();  //    
      var pizzaDescription = "";
      
      pizzaDescription += pizzaSizeBox.selectedValue() + '" pizza ';
      pizzaDescription += pizzaCrustBox.selectedValue() + ", ";
      
    if (pizzaDoubleSauceBox.checked) {
         var sauceImg = document.createElement("img");
         sauceImg.src = "rb_doublesauce.png";
         pizzaPreviewBox.appendChild(sauceImg);
         pizzaDescription += "double sauce, ";
      }
      if (pizzaDoubleCheeseBox.checked) {
          var sauceImg = document.createElement("img");
         sauceImg.src = "rb_doubleCheese.png";
         pizzaPreviewBox.appendChild(sauceImg);
         pizzaDescription += "double sauce, ";
      } 
     var checkedToppings = document.querySelectorAll("input.topping:checked");    
      for (var i = 0; i < checkedToppings.length; i++) {
         if (checkedToppings[i].value !== "none") {
            
            pizzaDescription += checkedToppings[i].name + "(" + checkedToppings[i].value + "), ";
            var toppingImage = document.createElement("img");
            toppingImage.src = "rb_" + checkedToppings[i].name + ".png";
            pizzaPreviewBox.appendChild(toppingImage); //                                 
            
            if (checkedToppings[i].value === "left") {
               toppingImage.style.clip = "rect(0px, 150px, 300px, 0px)";
            }  else if (checkedToppings[i].value === "right") {
               toppingImage.style.clip = "rect(0px, 300px, 300px, 150px)";
            }
         }
      }   
      
      pizzaSummary.textContent = pizzaDescription;
   }
    
     // Function to reset the pizza drawing 
   function resetDrawPizza() {
      
    // Object collection of all topping option buttons with a value of 'none'
      var noTopping = document.querySelectorAll("input.topping[value='none']");
      
      pizzaSizeBox.selectedIndex = 1;
      pizzaCrustBox.selectedIndex = 0;
      pizzaDoubleSauceBox.checked = false;
      pizzaDoubleCheeseBox.checked = false;
      
      for (var i = 0; i < noTopping.length; i++) {
         noTopping[i].checked = true;
      }      
      pizzaSummary.textContent = pizzaSizeBox.selectedValue() + '" pizza, ' + pizzaCrustBox.selectedValue();
      pizzaPreviewBox.removeChildren(); //
      pizzaQuantityBox.value = 1; //
   }
   
});

/*-------------------- Custom Methods --------------------*/

/* Method added to any DOM element that removes all child nodes of element */
HTMLElement.prototype.removeChildren = function() {
   while (this.firstChild) {
      this.removeChild(this.firstChild);
   }   
};

/* Method added to the select element to return the value of the selected option */
HTMLSelectElement.prototype.selectedValue = function() {
   var sIndex = this.selectedIndex;
   return this.options[sIndex].value;
};

