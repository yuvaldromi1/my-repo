// Fetch cocktail data and update UI
"use strict";
// Main JS for Cocktail Info Project
// Author: Yuval Dromi
// This file contains all logic for fetching, displaying, and validating cocktail data.

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('drinkForm');
    const errorMsg = document.getElementById('errorMsg');
    const drinkInfo = document.getElementById('drinkInfo');
    const drinkSelector = document.getElementById('drinkSelector');
    const clearBtn = document.getElementById('clearBtn');
    const loader = document.getElementById('loader');
    // Fixed list of cocktail names
    const drinksList = [
        "Margarita",
        "Martini",
        "Mojito",
        "Old Fashioned",
        "Daiquiri",
        "Negroni",
        "Manhattan",
        "Whiskey Sour",
        "Mai Tai",
        "Cosmopolitan",
        "Pina Colada",
        "Bloody Mary",
        "Gin Tonic",
        "Long Island Tea",
        "Caipirinha"
    ];
    // Populate selector only once
    drinksList.forEach(drink => {
        if (!Array.from(drinkSelector.options).some(opt => opt.value === drink)) {
            const option = document.createElement('option');
            option.value = drink;
            option.textContent = drink;
            drinkSelector.appendChild(option);
        }
    });
    drinkSelector.addEventListener('change', function () {
        const selected = drinkSelector.value;
        if (selected) {
            document.getElementById('drinkName').value = selected;
        }
    });
    // Clear form and info
    clearBtn.addEventListener('click', function () {
        form.reset();
        drinkInfo.innerHTML = "";
        errorMsg.style.display = 'none';
        document.getElementById('drinkName').focus();
    });
    // Form submit
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        errorMsg.style.display = 'none';
        drinkInfo.innerHTML = "";
        loader.style.display = 'block';
        const drinkName = document.getElementById('drinkName').value.trim();
        if (!drinkName) {
            errorMsg.textContent = 'Please enter a drink name.';
            errorMsg.style.display = 'block';
            document.getElementById('drinkName').focus();
            loader.style.display = 'none';
            return;
        }
        try {
            const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkName)}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            loader.style.display = 'none';
            if (!data.drinks) {
                errorMsg.textContent = 'No drinks found with that name.';
                errorMsg.style.display = 'block';
                document.getElementById('drinkName').focus();
                return;
            }
            const drink = data.drinks[0];
            drinkInfo.innerHTML = `
              <div class="card drink-card">
                <div class="media">
                  <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                </div>
                <div class="content">
                  <h5 class="card-title">${drink.strDrink}</h5>
                  <p class="meta"><strong>Category:</strong> ${drink.strCategory} · <strong>Glass:</strong> ${drink.strGlass}</p>
                  <p class="card-text"><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
                </div>
                <div class="reveal">
                  <h6>Instructions</h6>
                  <p class="card-text">${drink.strInstructions}</p>
                  <h6>Ingredients</h6>
                  <ul>${getIngredients(drink).map(i => `<li>${i}</li>`).join('')}</ul>
                </div>
              </div>
            `;
        } catch (err) {
            loader.style.display = 'none';
            errorMsg.textContent = 'An error occurred. Please try again.';
            errorMsg.style.display = 'block';
        }
    });
    /**
     * Returns an array of ingredients and measures for a drink object.
     * @param {Object} drink - The drink object from the API
     * @returns {string[]} Array of formatted ingredient strings
     */
    function getIngredients(drink) {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`] || '';
            if (ingredient) {
                ingredients.push(`${ingredient} ${measure}`.trim());
            }
        }
        return ingredients;
    }
});
