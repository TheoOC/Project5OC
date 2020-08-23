let items;
let unparsedCart = localStorage.panier;
//parse the panier in localStorage
if (unparsedCart) {
    items = sortItems(JSON.parse(localStorage["panier"]));
}
console.log(items);

/* ---------------display HTML-----------------*/
let cartList = document.getElementById('cartList');
//if cartList empty don t need to display the cart
if (cartList) {
    displayCart(items, cartList);
}

/* -------------------buttons--------------------*/
//add button
$("#cartList").on("click", ".add-item", function (event) {
    //get the name in the data-name attribute of the button with class .add-item in the cartList id
    let name = $(this).attr("data-name");
    addItem(name);
    displayCart(items, cartList);
});

//subtract button
$("#cartList").on("click", ".subtract-item", function (event) {
    let name = $(this).attr("data-name");
    removeItemFromCart(name);
    displayCart(items, cartList);
});
//remove button
$("#cartList").on("click", ".remove-item", function (event) {
    let name = $(this).attr("data-name");
    removeAllItemsFromCart(name);
    displayCart(items, cartList);
});
//clear button
let clearCart = document.getElementById("clearCart");
clearCart.addEventListener("click", function (event) {
    //if array not empty, empty the array
    if (items) {
        items.splice(0, items.length);
    }
    saveCart();
    displayCart(items, cartList);
});
//buy button
$("#contactForm").submit(function (event) {
    console.log("clicked");
    try {
        //get contact infos
        let contact = getContact();
        //get items ids
        let products = getIds();
        let data = {
            contact,
            products
        }
        let url = "http://localhost:3000/api/teddies/order";
        postRequest(url, JSON.stringify(data))
            .then(function (request) {
                let response = JSON.parse(request.response);
                //get the id of the cart
                let orderId = response.orderId;
                console.log("order id : " + orderId);
                //save the orderId in the localStorage
                saveOrderId(orderId);
            });
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
        event.preventDefault();
    }

});


//----------------functions-------------------------

function saveOrderId(orderId){
    //remove previous id if there is already one
    if(localStorage.orderId){
        localStorage.removeItem("orderId");
    }
    //replace it with the new one
    localStorage.setItem("orderId", JSON.stringify(orderId));
}

function getIds() {
    //array of ids
    let temp = [];
    for (let i = 0; i < items.length; i++) {
        //push the same items in the array of ids
        for (let j = 0; j < items[i].count; j++) {
            temp.push(items[i].id);
        }
    }
    //if there is nothing in the basket throw an error
    if (temp.length == 0) {
        throw new Error("no item in basket");
    }
    return temp;
}

function postRequest(url, data) {
    let request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        request.open('POST', url);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onreadystatechange = function () {
            if (request.readyState !== XMLHttpRequest.DONE) return;

            if (request.readyState == XMLHttpRequest.DONE && request.status == 201) {
                resolve(request);
                return;
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                })
                return;
            }
        }
        request.send(data);
    });
}

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */

function getContact() {
    //get all the contact infos from if available else show an alert
    let tfn = document.getElementById("inputFirstName");
    if (!tfn.value) {
        displayErrorForm(tfn, "missing First Name");
    }
    let tln = document.getElementById("inputLastName");
    if (!tln.value) {
        displayErrorForm(tln, "missing Last Name");
    }
    let tadd = document.getElementById("inputAddress");
    if (!tadd.value) {
        displayErrorForm(tadd, "missing Address");
    }
    let tcity = document.getElementById("inputCity");
    if (!tcity.value) {
        displayErrorForm(tcity, "missing City");
    }
    let temail = document.getElementById("inputEmail");
    if (!temail.value) {
        displayErrorForm(temail, "missing Email");

    }
    let contact = {
        firstName: tfn.value,
        lastName: tln.value,
        address: tadd.value,
        city: tcity.value,
        email: temail.value
    };
    //if one of the contact infos is missing throw an error 
    if (!contact.firstName || !contact.lastName || !contact.address || !contact.city || !contact.email) {
        throw new Error("contact infos not filled in");
    }
    //else return contact object
    return contact;
}
function displayErrorForm(elementId, msg) {
    //verify element Id is available
    if (elementId) {
        //get last element
        let lastChild = elementId.parentElement.lastElementChild;
        //check if there already is an alert 
        if (lastChild.classList.contains("alert")) {
            console.log("already an alert");
        }
        //if no alert insert it after the element
        else {
            let string = '<div class="alert alert-danger alert-dismissible fade show mt-1" role="alert">' +
                '<strong>' + msg + '</strong> ' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>';
            elementId.insertAdjacentHTML('afterend', string);
        }
    }
    else {
        console.log("error elementId not initialized or not available");
    }


}

function addItem(name) {
    //loop throught items
    for (let i in items) {
        //check name
        if (items[i].name == name) {
            //add 1 count
            items[i].count += 1;
            break;
        }
    }
    saveCart();
}
function removeItemFromCart(name) {
    for (let i in items) {
        //check name
        if (items[i].name == name) {
            items[i].count--;
            if (items[i].count <= 0) {
                items.splice(i, 1);
            }
            //exit loop
            break;
        }
    }
    saveCart();
}
function removeAllItemsFromCart(name) {
    for (let i in items) {
        if (items[i].name == name) {
            items.splice(i, 1);
            break;
        }
    }
    saveCart();
}

function displayCart(items, elementId) {
    //clear html first
    elementId.textContent = "";
    for (let i = 0; i < items.length; i++) {
        let tempString =
            '<tr>' +
            '<th>' +
            '<p>' + items[i].name + '</p>' +
            '</th>' +
            '<td class="w-25">' +
            '<img class="d-inline img-fluid img-thumbnail" src="' + items[i].imageUrl + '">' +
            '</td>' +
            '<td>' +
            '<p class="d-inline">' + items[i].description + '</p>' +
            '</td>' +
            '<td>' +
            '<h4>' + items[i].count + '</h4>' +
            '</td>' +
            '<td>' +
            '<h4>' + items[i].price * items[i].count + '</h4>' +
            '</td>' +
            '<td>' +
            '<button type="button" data-name="' + items[i].name + '" class="subtract-item d-block btn btn-warning btn-lg btn-block">-</button>' +
            '<button type="button" data-name="' + items[i].name + '" class="add-item d-block btn btn-primary btn-lg btn-block ">+</button>' +
            '<button type="button" data-name="' + items[i].name + '" class="remove-item d-block btn btn-danger btn-lg btn-block ">x Remove</button>' +
            '</td>' +
            '</tr>';
        displayItem(elementId, tempString);
    }
}

function displayItem(elementId, stringHtml) {
    elementId.insertAdjacentHTML('afterbegin', stringHtml);
}
//sort in reverse
function sortItems(itemsArray) {
    //check if array is null
    if (itemsArray) {
        let tempArray = itemsArray;
        //sort by name
        tempArray.sort(function (a, b) {
            if (a.name > b.name) {
                return -1;
            }
            if (a.name < b.name) {
                return 1;
            }
            return 0;
        });
        return tempArray;
    }
}

function saveCart() {
    let storage = localStorage;
    storage.setItem("panier", JSON.stringify(items));
}

