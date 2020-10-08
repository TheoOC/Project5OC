let orderId = document.getElementById("orderId");
let totalPrice = document.getElementById("totalPrice");

orderId.insertAdjacentHTML("afterbegin", JSON.parse(localStorage.orderId));
totalPrice.insertAdjacentHTML("afterbegin", getPrixTotal());

function getPrixTotal() {
    let temp = 0;
    let items = JSON.parse(localStorage["cart"]);
    console.log(items);
    for (let i = 0; i < items.length; ++i) {
        for (let j = 0; j < items[i].count; ++j) {
            temp += items[i].price / 100;
        }
    }
    temp += ' €';
    return temp;
}