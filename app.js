let kittens = [];
loadKittens();

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target
  let currentKitten = {}
  let kittenName = form.kittenName.value
  currentKitten = kittens.find(kitten => kitten.name == kittenName)

  if (kittenName == "") {
    document.getElementById("add-kitten").reset()
    window.alert("You need to name your kitten!")
  }
  else {
    if (!currentKitten) {
      let newKitten = {
        id: generateId(),
        name: form.kittenName.value,
        image: `https://robohash.org/${form.kittenName.value}?set=set4`,
        mood: "Tolerant",
        affection: 5,
      }
      kittens.push(newKitten)
      saveKittens()
      kittenLimit()
    }
    else {
      window.alert("Kittens with the same name?! Enter a different one!")
    }
    document.getElementById("add-kitten").reset()
  }
}

function kittenLimit() {
  if (kittens.length > 8) {
    deleteKitten()
    window.alert("You cannot have more than eight kittens!")
  }
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittensData = JSON.parse(localStorage.getItem("kittens"))
  if (kittensData) {
    kittens = kittensData
  }
  if (!document.getElementById("welcome")) {
    drawKittens();
  } else {
    drawDeleteKittens();
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let template = ""
  if (kittens.length > 0) {
    kittens.forEach(kitten => {
      let hideButtons = ""
      let ranAwayButtons = ""
      if (kitten.mood == "Gone") {
        hideButtons = "hidden";
        ranAwayButtons =
          `
        <p>
          <p  class="text-light">Uh oh! Your kitten left you because it wasnt very happy.</p>
          <button class="btn-cancel" onclick="deleteKitten('${kitten.id}')">Delete</button>
        </p>
        `;
      }
      template += `
      <div class="card p-2 text-center bg-dark m-2">
        <div class="card p-2 text-center dark-lighten kitten ${kitten.mood}">
          <img class="kitten" src=${kitten.image} height="150" width="150" alt="Moody Kitten">
        </div>
        <div class="mt-2 text-light">
          <div class="d-flex justify-content-center word"> Name: ${kitten.name}</div>
          <div class="d-flex justify-content-center word"> Mood: ${kitten.mood}</div>
          <div class="d-flex justify-content-center word"> Affection: ${kitten.affection}</div>
        </div>
        <div id="kitten-buttons" class="${hideButtons}">
          <button onclick="pet('${kitten.id}')">Pet</button>
          <button onclick="catnip('${kitten.id}')">Catnip</button>
        </div>
        ${ranAwayButtons}
      </div>
      </div>
      `
      document.getElementById("kittens").innerHTML = template
    })
  } else {
    document.getElementById("kittens").innerHTML = template
  }
}

function drawDeleteKittens() {
  if (kittens.length > 0) {
    document.getElementById("delete-kittens").innerHTML =
      `
  <p>
  <button onclick="DeleteKittens()" class="btn-cancel">Start Over</button>
  `;
  } else {
    document.getElementById("delete-kittens").classList.add("hidden");
  }
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let petRandom = Math.random();
  let chosenKitten = findKittenById(id);
  if (petRandom > 0.7) {
    chosenKitten.affection += 1;
  } else {
    chosenKitten.affection -= 1;
  }

  setKittenMood(chosenKitten);
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to Tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let chosenKitten = findKittenById(id);
  chosenKitten.affection = 5;
  setKittenMood(chosenKitten);
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  if (kitten.affection <= 0) {
    kitten.mood = "Gone"
  }
  else if (kitten.affection <= 3) {
    kitten.mood = "Angry"
  }
  else if (kitten.affection <= 5) {
    kitten.mood = "Tolerant"
  }
  else {
    kitten.mood = "Happy"
  };
  saveKittens();
}

function getStarted() {
  document.getElementById("welcome").remove();
  document.getElementById("add-kitten").classList.remove("hidden");
  loadKittens();
}

function deleteKitten(id) {
  let kitten = kittens.indexOf(findKittenById(id));
  console.log(kitten);
  kittens.splice(kitten, 1);
  saveKittens();

}

function DeleteKittens() {
  kittens = [];
  saveKittens();
  drawDeleteKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}