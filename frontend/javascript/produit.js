let id = getPageId();
let requestURL = "http://localhost:3000/api/teddies/" + id;
console.log(requestURL);

main();

async function main() {
    let curItem;
    let name;
    //connect to api
    await makeRequest(requestURL)
        //add html dynamically
        .then(function (request) {
            let response = JSON.parse(request.response);
            let stringHTML = createTeddy(
                response.name,
                response.imageUrl,
                response.description,
                response.price,
                response.colors
            );
            let displayTeddy = document.getElementById("teddyProduct");
            //add the html to the page
            displayTeddy.insertAdjacentHTML("afterbegin", stringHTML);
            return response;
        })
        .then(function (response) {
            //check if there is already a cart in the localStorage
            let bItem = false;
            if (localStorage.cart) {
                let cart = JSON.parse(localStorage["cart"]);
                let length = cart.length;
                for (let i = 0; i < length; i++) {
                    //check if there is already the same item in the cart
                    if (cart[i].name == response.name) {
                        bItem = true;
                        name = response.name;
                        console.log(name);
                    }
                }
            }
            //else create a new item
            if (bItem == false) {
                console.log("creating new item");
                curItem = new item(
                    response.colors,
                    response._id,
                    response.name,
                    response.price,
                    response.imageUrl,
                    response.description,
                    1
                );
            }
        })
        .catch(function (posts) {
            console.log("request failed");
            console.log(
                "something went wrong!! status: " +
                posts.status +
                " statusText " +
                posts.statusText
            );
        });
    console.log("finished make request");

    //add to the basket when clicked
    let cart = document.getElementById("addBasket");
    cart.addEventListener("click", function () {
        //if it was not in the cart add the item to the storage
        if (curItem) {
            console.log("adding to storage");
            addToStorage(curItem, localStorage);
        }
        //else update the count of the item
        else {
            console.log("updating item");
            updateItem(name, localStorage);
        }
        console.log("added to basket");
        console.log(localStorage.cart);
    });
}

//update the count of item
function updateItem(name, storage) {
    if (storage) {
        let cart = JSON.parse(storage["cart"]);
        console.log(cart);
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].name == name) {
                cart[i].count += 1;
            }
        }
        storage.setItem("cart", JSON.stringify(cart));
    }
}

function addToStorage(item, storage) {
    let cart;
    //check if cart is defined
    if (!storage["cart"]) {
        cart = [];
    } else {
        cart = JSON.parse(storage["cart"]);
    }
    console.log(cart);
    cart.push(item);
    storage.setItem("cart", JSON.stringify(cart));
}

function item(colors, id, name, price, imageUrl, description, count) {
    this.colors = colors;
    this.id = id;
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.count = count;
}

function makeRequest(url) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                resolve(request);
                return;
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                });
                return;
            }
        };
        request.open("get", url);
        request.send();
    });
}

function createTeddy(name, imageURL, description, price, colors) {
    let colorList = createColorList(colors);

    let string =
        '<div class="col-10 col-md-8 col-lg-6 col-xl-4">' +
        '<div class="card box-shadow">' +
        '<div class="card-header">' +
        '<h4 class="my-0 font-weight-normal">' +
        name +
        "</h4>" +
        "</div>" +
        '<img class="card-img-top" src="' +
        imageURL +
        '" alt="Card image cap">' +
        '<div class="card-body">' +
        '<h4 class="card-title pricing-card-title">' +
        price / 100 +
        " €" +
        "</h4>" +
        '<p class="card-text ">' +
        description +
        "</p>" +
        '<div class="form-group">' +
        '<label for="colorsSelect ">Colors (select one):</label>' +
        '<select class="form-control btn-primary" id="colorsSelect">' +
        colorList +
        "</select>" +
        '<a  class="btn btn-lg btn-block btn-outline-primary mt-2" href="panier.html" id="addBasket">Ajouter au panier</a>' +
        "</div>" +
        "</div>";
    return string;
}

function createColorList(colors) {
    let string = "";
    for (let color of colors) {
        let tempString = "<option>" + color + "</option>";
        string += tempString;
    }
    return string;
}

function getPageId() {
    let url = window.location.search.substring(1);
    let query = url.split("=");
    let id = query[1];
    console.log(id);
    return id;
}
