let bagItemsObjects;

onLoad();

function onLoad() {
    loadBagItemsObjects();
    displayBagItems();
    displayBagSummary();
}

function displayBagSummary() {
    let bagSummaryElement = document.querySelector('.bag-summary');
    let totalItem = bagItemsObjects.length;
    let totalMRP = 0;
    let totalDiscount = 0;

    bagItemsObjects.forEach(bagItem => {
        totalMRP += bagItem.original_price;
        totalDiscount += bagItem.original_price - bagItem.current_price;
    });

    let finalPayment = totalMRP - totalDiscount + 99;

    bagSummaryElement.innerHTML = `<div class="bag-details-container">
        <div class="price-header">PRICE DETAILS (${totalItem} items)</div>
        <div class="price-item">
            <span class="price-item-tag">Total MRP</span>
            <span class="price-item-value">₹ ${totalMRP}</span>
        </div>
        <div class="price-item">
            <span class="price-item-tag">Discount on MRP</span>
            <span class="price-item-value priceDetail-base-discount">-₹ ${totalDiscount}</span>
        </div>
        <div class="price-item">
            <span class="price-item-tag">Convenience Fee</span>
            <span class="price-item-value">₹ 99</span>
        </div>
        <hr />
        <div class="price-footer">
            <span class="price-item-tag">Total Amount</span>
            <span class="price-item-value">₹ ${finalPayment}</span>
        </div>
    </div>
    <button class="btn-place-order" onclick="placeOrder()">
        <div class="css-xjhrni">PLACE ORDER</div>
    </button>`;
}

function loadBagItemsObjects() {
    console.log(bagItems);
    bagItemsObjects = bagItems.map(itemId => {
        for (let i = 0; i < items.length; i++) {
            if (itemId == items[i].id) {
                return items[i];
            }
        }

        // If the item is not found in skincare items, try finding it in haircare items
        for (let i = 0; i < haircareItems.length; i++) {
            if (itemId == haircareItems[i].id) {
                return haircareItems[i];
            }
        }
    });
    console.log(bagItemsObjects);
}

function displayBagItems() {
    let containerElement = document.querySelector('.bag-items-container');
    let innerHTML = '';
    bagItemsObjects.forEach(bagItem => {
        // Add a check to ensure bagItem is defined
        if (bagItem) {
            innerHTML += generateItemHTML(bagItem);
        }
    });
    containerElement.innerHTML = innerHTML;
}

function removeFromBag(itemId) {
    bagItems = bagItems.filter(bagItemId => bagItemId != itemId);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    loadBagItemsObjects();
    displayBagIcon();
    displayBagItems();
    displayBagSummary();
}

function placeOrder() {
    alert("Your order has been placed!");

    // Clear the items from the cart
    bagItems = [];
    localStorage.setItem('bagItems', JSON.stringify(bagItems));

    // Reload bag items and update the display
    loadBagItemsObjects();
    displayBagIcon();
    displayBagItems();
    displayBagSummary();
}

function generateItemHTML(item) {
    // Add a check to ensure item and item.image are defined
    if (item && item.image && item.company && item.item_name && item.current_price && item.original_price && item.discount_percentage && item.return_period && item.delivery_date) {
        return `<div class="bag-item-container">
            <div class="item-left-part">
                <img class="bag-item-img" src="${item.image}">
            </div>
            <div class="item-right-part">
                <div class="company">${item.company}</div>
                <div class="item-name">${item.item_name}</div>
                <div class="price-container">
                    <span class="current-price">Rs ${item.current_price}</span>
                    <span class="original-price">Rs ${item.original_price}</span>
                    <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
                </div>
                <div class="return-period">
                    <span class="return-period-days">${item.return_period} days</span> ↩ return available
                </div>
                <div class="delivery-details">
                    ✅ Delivery by ${item.delivery_date}
                    <span class="delivery-details-days">10 Oct 2023</span>
                </div>
            </div>
            <div class="remove-from-cart" onclick="removeFromBag(${item.id})">X</div>
        </div>`;
    } else {
        // Return an empty string or handle the case where any required detail is missing
        console.error("Item details are incomplete:", item);
        return '';
    }
}