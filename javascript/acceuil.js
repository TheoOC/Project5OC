let teddyList = document.getElementById("teddy-list");

getRequest("http://localhost:3000/api/teddies")
  .then(function (request) {
    let response = JSON.parse(request.response);
    let arrayLength = response.length;
    console.log(arrayLength);

    //creer chaques cartes
    for (let i = 0; i < arrayLength; i++) {
      let stringTemp = createCard(response[i].name,
        (response[i].price) / 100 + " €", //convertir le prix de centimes en euros
        "buy",
        response[i].imageUrl,
        response[i]._id);
      teddyList.insertAdjacentHTML('beforeend', stringTemp);
    }
  })
  .catch(function (error) {
    console.log(
      "something went wrong!! status: " +
      error.status +
      " statusText " +
      error.statusText
    );
  })

function getRequest(url) {
  return new Promise(function (resolve, reject) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState !== XMLHttpRequest.DONE) return;
      if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        console.log("succeeded");
        resolve(request);
        return;
      }
      else {
        reject({
          status: request.status,
          statusText: request.statusText,
        })
        return;
      }
    };
    request.open('GET', url);
    request.send();
  });
}

function createCard(title, text, buttonTEXT, imageURL, id) {
  let string = '<div class="col-sm-12 col-md-6 col-lg-4 mb-4">' +
    '<div class="card h-100">' +
    '<img class="card-img-top" src="' +
    imageURL +
    '" alt="Card image cap">' +
    '<div class="card-body">' +
    '<h4 class="card-title">' +
    title +
    '</h4>' +
    '<h5 class="card-text">' +
    text +
    '</h5>' +
    '<a class="btn btn-primary btn-lg btn-block" href="../html/produit.html?id=' +
    id +
    '">' +
    buttonTEXT +
    '</a>' +
    '</div>' +
    '</div>' +
    '</div>';
  return string;
}


