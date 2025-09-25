const addToBagButtons = document.querySelectorAll('.add-to-bag');
// const cartItemsContainer = document.getElementById('cart-items');
// const cartCount = document.getElementById('cart-count');

let shoppingBag = []; // Array to hold items in the shopping bag

const bagCountElement = document.getElementById('bag-count');

addToBagButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();

        const productId = this.dataset.productId;

        console.log(`Adding product with ID: ${productId} to the bag.`);

        shoppingBag.push(productId);
        console.log(shoppingBag)

        if (bagCountElement) {
            bagCountElement.textContent = shoppingBag.length;
        }

        console.log("Current bag:", shoppingBag);

        // addItemToBag(productId);
        // updateCartDisplay();
    });
});