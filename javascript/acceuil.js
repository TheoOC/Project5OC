let request = new XMLHttpRequest();
request.open("get", "http://localhost:3000/api/teddies");
request.send();

let teddyList = document.getElementById("teddy-list");

request.onreadystatechange = function () {
  if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
    console.log("succeeded");
    let response = JSON.parse(this.response);
    let arrayLength = response.length;
    console.log(arrayLength);

    let stringHTML = "";
    for (let i = 0; i < arrayLength; i++) {
      let name = response[i].name;
      let imageURL = response[i].imageUrl;
      let price = response[i].price;
      let buttonTEXT = "buy";
      let id = response[i]._id;

      let stringTemp = createCard(name, price, buttonTEXT, imageURL, id);
      stringHTML += stringTemp;
    }
    teddyList.innerHTML = stringHTML;
  }
  else {
    console.log("failed");
  }
}



function createCard(title, text, buttonTEXT, imageURL, id) {
  let string = '<div class="col-md-4">' +
    '<div class="card mb-2">' +
    '<img class="card-img-top" src="urlTemp" alt="Card image cap">' +
    '<div class="card-body">' +
    '<h4 class="card-title">titleTemp</h4>' +
    '<p class="card-text">textTemp</p>' +
    '<a class="btn btn-primary" href="./html/produit.html?id=idTemp">buttonTemp</a>' +
    '</div>' +
    '</div>' +
    '</div>';
  string = string.replace("titleTemp", title);
  string = string.replace("textTemp", text);
  string = string.replace("buttonTemp", buttonTEXT);
  string = string.replace("urlTemp", imageURL);
  string = string.replace("idTemp", id);

  return string;

}


