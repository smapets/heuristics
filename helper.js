/*-----------------------Helper Functions for TSP with Genetic Algorithm--------------*/
//shuffle the order of the representation for each individual
// to create population with different individuals

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice();
}
//swap two array elements
function swap(a, i, j) {
  let temp = a[i];
  a[i] = a[j];
  a[j] = temp;
  return a;
}
//convert an array representation of a permutation (e.g. [0,1,2,3])
//to a string without the brackets or the commas (e.g. "0123")
function stringify(arr) {
  let dataArray = arr.map(function(e) {
    return JSON.stringify(e);
  });
  let dataString = dataArray.join("");
  return dataString;
}
//convert a string representation of a permutation (e.g. "0123")
//to an array of numbers (e.g. [0,1,2,3])
function convertToArray(str) {
  let arr = str.split("");
  arr = arr.map(e => Number(e));
  return arr;
}

//pick new parents with roulette roule
function pickParent(population, fitness) {
  let index = 0;
  let r = Math.random(); //pick a random number between 0 and 1
  while (r > 0) {
    r = r - fitness[index];
    index++;
  }
  index--;
  return population[index];
}
//create the offspring
function crossOver(parentA, parentB) {
  parentA = convertToArray(parentA);
  parentB = convertToArray(parentB);
  let start = Math.floor(Math.random() * parentA.length);
  let offspring = parentA.slice(start, parentA.length);
  for (let i = 0; i < parentB.length; i++) {
    let city = parentB[i];
    if (!offspring.includes(city)) {
      offspring.push(city);
    }
  }
  return offspring;
}

//check that there are no doubles of a certain gene/permutation in a generation
function noDoublesCheck(population, order) {
  let result = false;
  for (let i = 0; i < population.length; i++) {
    if (population[i] == order) {
      result = true;
      break;
    }
  }
  return result;
}
//mutate the offspring (inorder mutation)
function mutate(order, mutationRate, totalCities) {
  for (let i = 0; i < totalCities; i++) {
    if (Math.random() < mutationRate) {
      let indexA = Math.floor(Math.random() * order.length);
      let indexB = (indexA + 1) % totalCities;
      order = swap(order, indexA, indexB);
    }
  }
}
module.exports = {
  shuffle,
  swap,
  stringify,
  convertToArray,
  pickParent,
  crossOver,
  noDoublesCheck,
  mutate
};
