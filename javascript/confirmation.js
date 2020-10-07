let orderId = document.getElementById("orderId");
let prixTotal = document.getElementById("prixTotal");

orderId.insertAdjacentHTML("afterbegin", JSON.parse(localStorage.orderId));
prixTotal.insertAdjacentHTML("afterbegin", getPrixTotal());

function getPrixTotal() {
    let temp = 0;
    let items = JSON.parse(localStorage["panier"]);
    console.log(items);
    for (let i = 0; i < items.length; ++i) {
        for (let j = 0; j < items[i].count; ++j) {
            temp += items[i].price / 100;
        }
    }
    temp += ' €';
    return temp;
}