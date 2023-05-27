console.log("js");

// GET
function getKoalas() {
  console.log("in getKoalas");
  let addKoala = document.querySelector("#viewKoalas");
  addKoala.innerHTML = "";
  fetch("/koalas")
    .then((response) => response.json())
    .then((koalas) => {
      let addKoala = document.querySelector("#viewKoalas");
      console.log('updating the DOM');

      let i = 0;
      for (let koala of koalas) {
        if (koala.ready_to_transfer === "Y") {
          addKoala.innerHTML += `
          <tr>
            <td>${koala.name}</td>
            <td>${koala.age}</td>
            <td>${koala.gender}</td>
            <td>${koala.ready_to_transfer}</td>
            <td>${koala.notes}</td>
            <td></td>
            <td><button onclick="delKoala(${i})">Delete</button></td>
          </tr>      
        `;
          i++;
        } else {
            addKoala.innerHTML += `
            <tr>
              <td>${koala.name}</td>
              <td>${koala.age}</td>
              <td>${koala.gender}</td>
              <td>${koala.ready_to_transfer}</td>
              <td>${koala.notes}</td>
              <td><button id="markReady" onclick="makeReadyToTransfer(${i})">Mark Ready</button></td>
              <td><button onclick="delKoala(${i})">Delete</button></td>
            </tr>      
            `;
          i++;
        }
      }
    })
    .catch(function (error) {
      console.log("Error: ", error);
      alert("Error!");
    });
}

// POST
function saveKoala() {
  console.log("in saveKoala");
  // event.preventDefault();

  // get input values and create new koala object

  let name = document.querySelector("#nameIn").value;
  let age = document.querySelector("#ageIn").value;
  let gender = document.querySelector("#genderIn").value;
  let rtT = document.querySelector("#readyForTransferIn").value;
  let notes = document.querySelector("#notesIn").value;

  let koalaToAdd = JSON.stringify({
    name: name,
    age: age,
    gender: gender,
    ready_to_transfer: rtT,
    notes: notes,
  });

  fetch("/koalas", {
    method: "POST",
    body: koalaToAdd,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      // let addKoala = document.querySelector("#viewKoalas");
      // addKoala.innerHTML = "";
      document.querySelector("#nameIn").value = "";
      document.querySelector("#ageIn").value = "";
      document.querySelector("#genderIn").value = "";
      document.querySelector("#readyForTransferIn").value = "";
      document.querySelector("#notesIn").value = "";
      getKoalas();
    })
    .catch((error) => {
      console.log("Error: ", error);
      alert("Error!");
    });
}

// filter koalas array for non-rtt koalas

function makeReadyToTransfer(index) {
  let updatedKoala = {
    ready_to_transfer: "Y",
  };

  fetch(`/koalas/${index}`, {
    method: "PUT",
    body: JSON.stringify(updatedKoala),
    headers: {
      "Content-Type": "application/json",
    },
  })
    // get the updated koalas
    .then(() => {
      getKoalas();
    })
    .catch((error) => {
      console.log("Error: ", error);
      alert("Error!");
    });
}

function delKoala(index, event) {
  fetch(`/koalas/${index}`, {method: 'DELETE'})
  .then(deletedResponse => deletedResponse.json())
  .then(deletedKoala => {
    getKoalas();
  });
}

// page load GET
getKoalas();
