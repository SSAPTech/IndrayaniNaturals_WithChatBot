// =====================
// Recipes Page JavaScript
// =====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize recipe filters
    initializeRecipeFilters();
    
    // Initialize recipe search
    initializeRecipeSearch();
});

// =====================
// Recipe Filtering
// =====================
function initializeRecipeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipes = document.querySelectorAll('.recipe-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter recipes
            recipes.forEach(recipe => {
                const category = recipe.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    recipe.style.display = 'block';
                } else {
                    recipe.style.display = 'none';
                }
            });
        });
    });
}

// =====================
// Recipe Search
// =====================
function initializeRecipeSearch() {
    const searchInput = document.querySelector('#recipeSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const recipes = document.querySelectorAll('.recipe-card');
        
        recipes.forEach(recipe => {
            const title = recipe.querySelector('.recipe-title').textContent.toLowerCase();
            const description = recipe.querySelector('.recipe-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                recipe.style.display = 'block';
            } else {
                recipe.style.display = 'none';
            }
        });
    });
}

// =====================
// Smooth Scroll for Anchor Links
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 