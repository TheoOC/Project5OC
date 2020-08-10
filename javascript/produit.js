let id = getPageId();
let requestURL = "http://localhost:3000/api/teddies/" + id;
console.log(requestURL);

main();

async function main() {
    //connect to api
    await makeRequest(requestURL)
        //add html dynamically
        .then(function (request) {
            let response = JSON.parse(request.response);
            console.log("request success");
            let name = response.name;
            let imageURL = response.imageUrl;
            let description = response.description;
            let price = response.price + "€";
            let colors = response.colors;
            let stringHTML = createTeddy(name, imageURL, description, price, colors);
            let displayTeddy = document.getElementById("teddyProduct");
            displayTeddy.insertAdjacentHTML("afterbegin", stringHTML);
        }).catch(function (posts) {
            console.log("request failed");
            console.log(
                "something went wrong!! status: " +
                posts.status +
                " statusText " +
                posts.statusText
            );
        });
    console.log("finished make request");
    //add product in local storage

    //add to the basket when clicked
    let test = document.getElementById("addBasket");
    test.addEventListener("click", function () {
        console.log("clicked");
    });
}

let product = {
    colors:[],
    id:"",
    name:"",
    price:"",
    imageUrl:"",
    description:"",
};

//{"colors":["Tan","Chocolate","Black","White"],"_id":"","name":"","price":2900,"imageUrl":"","description":""}




function makeRequest(url) {
    let request = new XMLHttpRequest();

    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                resolve(request);
                return;
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                })
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
        '<div class="col-8 col-md-6 col-xl-4">' +
        '<div class="card box-shadow">' +
        '<div class="card-header">' +
        '<h4 class="my-0 font-weight-normal">nameTemp</h4>' +
        "</div>" +
        '<img class="card-img-top" src="imageURLTemp" alt="Card image cap">' +
        '<div class="card-body">' +
        '<h4 class="card-title pricing-card-title">priceTemp</h4>' +
        '<p class="card-text ">descriptionTemp</p>' +
        '<div class="form-group">' +
        '<label for="colorsSelect ">Colors (select one):</label>' +
        '<select class="form-control btn-primary" id="colorsSelect">' +
        colorList +
        "</select>" +
        '<a target="_blank" rel="noopener noreferrer" class="btn btn-lg btn-block btn-outline-primary mt-2" href="..." id="addBasket">Ajouter au panier</a>' +
        "</div>" +
        "</div>";

    string = string.replace("nameTemp", name);
    string = string.replace("imageURLTemp", imageURL);
    string = string.replace("priceTemp", price);
    string = string.replace("descriptionTemp", description);
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
