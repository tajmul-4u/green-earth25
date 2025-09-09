// Categories Container fetch

const categoriesContainer = document.getElementById("categories-container")
const categoriesLoading = document.getElementById("categories-loading");
const treesContainer = document.getElementById("trees-container");
const treesLoading = document.getElementById("trees-loading");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const treeModal = document.getElementById("tree-modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

// Global Variable
let categories = [];
let plants = [];
let cart = [];
let currentCategory = 'all';

// Load Categories
async function loadCategories()
{
    try
    {
        const response = await fetch(`https://openapi.programming-hero.com/api/categories`)
        const data = await response.json();
        categories = data.categories || [];
        // console.log("Loaded Categories:", categories);
        renderCategories();
        loadAllPlants();
    }
    catch (error)
    {
        console.error(`Error loading Categories:`, error);
        categoriesContainer.innerHTML = `<p class="text-red-500">Failed to load categories</P>`
        categoriesLoading.style.display = 'none';

    }

}
loadCategories();
// Render Categories in sidebar
function renderCategories()
{
    categoriesLoading.style.display = 'none';
    let categoriesHTML = `<button class="category-btn text-left w-full px-4 py-2 rounded-lg hover:bg-green-600 active-category" data-category="all">All Trees</button>
`;
    categories.forEach(category =>
    {
        categoriesHTML += ` <button class="category-btn text-left w-full px-4 py-2 rounded-lg hover:bg-green-600" data-category="${category.id}">${category.category_name}</button>
`;


    });
    categoriesContainer.innerHTML = categoriesHTML;

    //Add click listener to category buttons
    document.querySelectorAll('.category-btn').forEach(btn =>
    {
        btn.addEventListener('click', (e) =>
        {
            const categoryId = e.target.dataset.category;
            selectCategory(categoryId, e.target);

        });
    });
}

// Handle Category Section
function selectCategory(categoryId, clickedBtn)
{
    // Update categories section
    console.log({ categoryId, clickedBtn });
    // return;
    document.querySelectorAll('.category-btn').forEach(btn =>
    {
        btn.classList.remove("bg-green-600", "text-white", "active-category");
        btn.classList.add("bg-gray-200");
        btn.classList.remove('active-category');
    });
    // buttonElement.classList.add('active-category');

    clickedBtn.classList.remove("bg-gray-200");
    clickedBtn.classList.add("bg-green-600", "text-white", "active-category");

    currentCategory = categoryId;
    // Always show loading when switching categories
    showTreesLoading();

    if (categoryId === 'all')
    {
        loadAllPlants();
        fetch('https://openapi.programming-hero.com/api/plants')
            .then(res => res.json())
            .then(data =>
            {
                plants = data.plants;
                renderTrees(plants);
            });
    } else
    {
        loadPlantsByCategory(categoryId);
    }

}

//Load all Plants
async function loadAllPlants()
{
    // showTreesLoading();
    try
    {
        const response = await fetch(`https://openapi.programming-hero.com/api/plants`);
        const data = await response.json();
        plants = data.plants || [];
        // console.log("All plants:", plants);
        const getRandomPlantsList = getRandomPlants(plants, 6)
        renderTrees(getRandomPlantsList);
    }
    catch (error)
    {
        console.error('Error loading plants:', error);
        // hideTreesloading();
        treesContainer.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load plants</p>`;

    }
}
// Random tree show when the page load
function getRandomPlants(allplants, count)
{
    const shuffled = [...allplants].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

//Load plants by category
async function loadPlantsByCategory(categoryId)
{
    showTreesLoading();
    try
    {
        const response = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
        const data = await response.json();
        plants = data.plants || [];
        console.log(`Plants in category ${categoryId}:`, plants);
        renderTrees(plants);
    }
    catch (error)
    {
        console.error('Error loading plants:', error);
        hideTreesloading();
        treesContainer.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load plants</p>`;

    }
}

// Show loading spinner for trees
function showTreesLoading()
{
    treesLoading.classList.remove('hidden');
    treesContainer.classList.add('hidden');
}
//Hide loading spinner for trees
function hideTreesloading()
{
    treesLoading.classList.add('hidden');
    treesContainer.classList.remove('hidden');
}
// Render trees in the grid

function renderTrees(treesData)
{

    // console.log(treesData);
    // return;

    hideTreesloading();
    if (!treesData || treesData.length === 0)
    {
        treesContainer.innerHTML = `<p class="text-gray-600 text-center col-span-full">No trees found</p>`;
        return;
    }

    let treesHTML = '';
    treesData.forEach(tree =>
    {
        //Get Category Name

        const categoryName = getCategoryName(tree.category_id);
        // console.log(categoryName);
        treesHTML += `
                 <div class="bg-white rounded-lg shadow-lg overflow-hidden fade-in">
                <img src="${tree.image}" 
                     alt="${tree.name}" 
                     class="w-full h-48 object-cover">
                
                <div class="p-4">
                    <h3 class="text-lg font-semibold mb-2 cursor-pointer hover:text-green-600 transition-colors" 
                        onclick="openTreeModal(${tree.id})">
                        ${tree.name}
                    </h3>
                    
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                        ${tree.description || 'A beautiful tree that contributes to our environment.'}
                    </p>
                    
                    <div class="flex items-center justify-between mb-3">
                        <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        ${tree.category || "Unknown"}
                        </span>
                        <span class="font-semibold text-lg">৳${tree.price || 500}</span>
                    </div>
                    
                    <button onclick="addToCart(${tree.id})" 
                            class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    });
    treesContainer.innerHTML = treesHTML;
}

//Get category name by id
function getCategoryName(categoryId)
{
    const category = categories.find(cat => cat.id == categoryId);
    return category ? category.name : 'Tree';
}
// Add tree to cart

function addToCart(treeId)
{
    const tree = plants.find(p => p.id == treeId);
    if (!tree)
        return;
    //Check if tree is already in cart
    const existingItem = cart.find(item => item.id == treeId);
    if (existingItem)
    {
        existingItem.quantity += 1;
    }
    else
    {
        cart.push({
            id: tree.id,
            name: tree.name,
            price: tree.price || 500,
            quantity: 1
        });
    }
    renderCart();
    // Show the success message
    showNotification(`${tree.name} added to card!`);
}

// Remove tree from cart
function removeFromCart(treeId)
{
    cart = cart.filter(item => item.id != treeId);
    renderCart();

    showNotification('Item removed from cart');
}

// Render cart items
function renderCart()
{
    if (cart.length === 0)
    {
        cartItems.innerHTML = `<p class="text-gray-500 text-center">Your cart is empty</p>`;
        cartTotal.textContent = '৳0';
        return;
    }
    let cartHTML = '';
    let total = 0;

    cart.forEach(item =>
    {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
        <div class="bg-green-50 p-3 rounded-lg">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-medium text-sm">${item.name}</h4>
                    <p class="text-gray-600 text-xs">৳${item.price} x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 ml-2">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        `;
    });
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = `৳${total}`;
}
// Setup event listeners
function setupEventListeners()
{
    // Close modal when clicking the X button
    closeModal.addEventListener('click', () =>
    {
        treeModal.classList.remove('hidden');
    });
    // Close modal when clicking outside
    treeModal.addEventListener('click', (e) =>
    {
        if (e.target === treeModal)
        {
            treeModal.classList.remove('hidden');
        }
    });
    // Handle donation form submission
    donationForm.addEventListener('submit', handleDonationSubmit);
}
// Open tree details modal
// Setup modal event listeners
function setupEventListeners()
{
    // Close on X
    closeModal.addEventListener('click', () =>
    {
        treeModal.classList.add('hidden');
    });

    // Close when clicking outside modal content
    treeModal.addEventListener('click', (e) =>
    {
        if (e.target === treeModal)
        {
            treeModal.classList.add('hidden');
        }
    });
}

// Open tree modal
async function openTreeModal(treeId)
{
    console.log("Tree clicked:", treeId);
    treeModal.classList.remove('hidden'); // Show modal
    modalTitle.textContent = "Loading...";
    modalContent.innerHTML = '<p class="text-gray-500 py-8 text-center">Loading...</p>';

    try
    {
        const response = await fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`);
        const data = await response.json();
        console.log("API Data:", data);

        const tree = data.plants;
        if (!tree)
        {
            modalContent.innerHTML = '<p class="text-red-500 text-center">Tree details not found</p>';
            return;
        }

        const categoryName = tree.category || "Unknown";

        modalTitle.textContent = tree.name;
        modalContent.innerHTML = `
            <img src="${tree.image}" class="w-full h-64 object-cover rounded-lg mb-4" alt="${tree.name}">
            <div class="flex justify-between mb-4">
                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">${categoryName}</span>
                <span class="text-2xl font-bold text-green-600">৳${tree.price || 500}</span>
            </div>
            <p class="text-gray-600 mb-4">${tree.description || 'No description available.'}</p>
            ${tree.benefits ? `<p class="text-gray-600 mb-4"><strong>Benefits:</strong> ${tree.benefits}</p>` : ''}
            <button onclick="addToCart(${tree.id}); treeModal.classList.add('hidden');" 
                    class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                Add to Cart
            </button>
        `;
    } catch (error)
    {
        console.error('Error loading tree details:', error);
        modalContent.innerHTML = '<p class="text-red-500 text-center">Failed to load tree details</p>';
    }
}

// Call setup
setupEventListeners();
// Show Notificaton

function showNotification(message, type = 'success')
{
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;

    notification.textContent = message;
    // Add to dom
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() =>
    {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);

    // Remove after tree seconds
    setTimeout(() =>
    {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() =>
        {
            document.body.removeChild(notification);
        }, 300);

    }, 300);
}
