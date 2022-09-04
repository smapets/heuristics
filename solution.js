// Traveling Salesperson with Genetic Algorithm
const fs = require("fs");
const parser = require("./parser.js");
const promptSync = require("prompt-sync");
const hf = require("./helper.js");
let [pointsCoord, pointsDistance] = parser();
let cities = [];
let popSize = 10;
let population = []; // to be filled with individuals
let fitness = [];
let iterations = 10;
let totalCities = pointsCoord.length;
let foundAt;
let foundFirst;
let writeLine = line => fs.appendFileSync("log.txt", `\n ${line}`);
let recordDistance = Infinity;
let totalBest;
let generationBest;
console.log(
  "The solution(using genetic Algorithm) for Travelling salesman problem for the cities(coordinates):"
);
writeLine(
  "The solution(using genetic Algorithm) for Travelling salesman problem for the cities(coordinates):"
);
console.log(pointsCoord);
setup(); //create initial population
for (let i = 0; i < iterations; i++) {
  foundFirst = i + 1;
  draw();
}
console.log(
  "The best solution is the following permutation of the destinations: " +
    totalBest +
    ". Total distance covered in this path will be: " +
    recordDistance +
    "m"
);
writeLine(
  "The best solution is the following permutation of the destinations: " +
    totalBest +
    ". Total distance covered in this path will be: " +
    recordDistance +
    "m"
);
console.log(
  "The best solution was found at the " +
    foundAt +
    " iteration, out of " +
    iterations
);
writeLine(
  "The best solution was found at the " +
    foundAt +
    " iteration, out of " +
    iterations
);

//Create an individual: the whole population will be based on said individual
//individual solution representation: by order of cities
//eg: for the first individual: [0,1,2,...N], if N=total number of cities
function setup() {
  let order = [];
  for (let i = 0; i < pointsCoord.length; i++) {
    let v = [pointsCoord[i][0], pointsCoord[i][1]];
    cities[i] = v; //wont change, keeps a reference to the cities coordinates as a pair of points
    order[i] = i;
  }
  let newIndividual;
  //create population randomly
  for (let i = 0; i < popSize; i++) {
    newIndividual = hf.shuffle(order);
    population[i] = hf.stringify(newIndividual);
  }
}

function draw() {
  console.log("Current generation is: " + population);
  writeLine("Current generation is: " + population);
  // Genetic Algorithm functions
  calculateFitness();
  normalizeFitness();
  console.log("The total best is:" + totalBest);
  writeLine("The total best is:" + totalBest);
  console.log("The generation best is:" + generationBest + "\n");
  writeLine("The generation best is:" + generationBest + "\n");
  nextGeneration();
}
//calculate the total distance of a path, as described by a certain
//order/permutation of the destinations. Returns said distance
function calcDistance(pointsDistance, path) {
  let sum = 0;
  for (let i = 0; i < path.length - 1; i++) {
    let cityAIndex = Number(path[i]);
    let cityBIndex = Number(path[i + 1]);
    let d = pointsDistance[cityAIndex][cityBIndex];
    sum += d;
  }
  return sum;
}

//calculates fitness for every individual of the population
function calculateFitness() {
  let currentRecord = Infinity;
  //for every individual of the population
  //calculate distance of the corresponding path
  //and convert it to a fitness value
  for (let i = 0; i < population.length; i++) {
    //calculate the distance of each path
    let path = hf.convertToArray(population[i]);
    let d = calcDistance(pointsDistance, path);
    if (d < recordDistance) {
      recordDistance = d;
      totalBest = population[i];
      foundAt = foundFirst;
    }
    if (d < currentRecord) {
      currentRecord = d;
      console.log(
        "The current record of this generation is:" + currentRecord + "m"
      );
      writeLine(
        "The current record of this generation is:" + currentRecord + "m"
      );
      generationBest = population[i];
      console.log(
        "The corresponding best path of this generation is:" + generationBest
      );
      writeLine(
        "The corresponding best path of this generation is:" + generationBest
      );
    }

    fitness[i] = 1 / d;
  }
}
//normalize fitness: returns fitness as a percentage of the whole
function normalizeFitness() {
  let sum = 0;
  for (let i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (let i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}
//calculate the fitness of the new population/ population of the next generation
//returns the normalized fitness of the new population
function newPopFitness(pop) {
  let newPopFitness = [];
  let sum = 0;
  for (let i = 0; i < pop.length; i++) {
    let path = hf.convertToArray(pop[i]);
    let d = calcDistance(pointsDistance, pop[i]);
    newPopFitness[i] = 1 / d;
    sum += newPopFitness[i];
  }
  //normalize fitness
  for (let i = 0; i < pop.length; i++) {
    newPopFitness[i] = newPopFitness[i] / sum;
  }
  return newPopFitness;
}
//create next generation of population
//returns the population of the next generation
function nextGeneration() {
  let newPopulation = [];
  for (let i = 0; i < population.length; i++) {
    //first pick new parents
    let parentA = hf.pickParent(population, fitness);
    let parentB = hf.pickParent(population, fitness);
    while (
      parentA == parentB //check if parents are the same: the parents should be different
    )
      parentB = hf.pickParent(population, fitness);
    //create an offspring from two parents with order OX crossover
    let offspring = hf.crossOver(parentA, parentB);
    //run mutation
    hf.mutate(offspring, 0.01, totalCities);
    offspring = hf.stringify(offspring);
    while (hf.noDoublesCheck(newPopulation, offspring)) {
      offspring = hf.crossOver(parentA, parentB);
      hf.mutate(offspring, 0.01, totalCities);
      offspring = hf.stringify(offspring);
    }
    newPopulation[i] = offspring;
  }
  let newFitness = newPopFitness(newPopulation);
  let finalNewPop = sortGenerations(newPopulation, newFitness); // the final new Population will be a combination of the new and the old population
  // let finalNewPop = sortGenerationsAndReplaceWorst(newPopulation, newFitness); // the final new Population will be a combination of the new and the old population
  population = finalNewPop;
}

//merge the previous and the new generation's population
//, sort them by fitness and keep fittest (survival of the best individuals)
function sortGenerations(newPop, newPopFit) {
  let finalNewPop = [];
  let mergedPop = population.concat(newPop); //first merge old and new population into one array in ascending order
  let mergedFit = fitness.concat(newPopFit); //do same for fitness arrays
  mergedPop.sort(function(a, b) {
    //then sort merged array of individuals based on fitness values
    return mergedFit[mergedPop.indexOf(a)] - mergedFit[mergedPop.indexOf(b)];
  });
  for (let i = 0; i < popSize; i++) {
    while (hf.noDoublesCheck(finalNewPop, mergedPop[mergedPop.length - 1])) {
      //if the next best individual on the mergedPop array is already on the final new population, then pop said individual of mergedPop array
      mergedPop.pop();
    }
    finalNewPop.push(mergedPop.pop());
  }
  return finalNewPop;
}
//replace the worst individuals of the old generation (50%)
//with the fittest of the new generation (survival of the best individuals)
function sortGenerationsAndReplaceWorst(newPop, newPopFit) {
  let finalNewPop = [];
  population.sort(function(a, b) {
    // sort  array of previous population based on fitness values in descending order
    return fitness[population.indexOf(b)] - fitness[population.indexOf(a)];
  });
  newPop.sort(function(a, b) {
    // sort  array of new population based on fitness values in ascending order
    return newPopFit[newPop.indexOf(a)] - newPopFit[newPop.indexOf(b)];
  });
  finalNewPop = population.slice(0, Math.floor(popSize / 2));
  //fill up 50% of the new  final population with the fittest individuals of the previous population
  while (finalNewPop.length < popSize) {
    //fill up the rest spots
    while (hf.noDoublesCheck(finalNewPop, newPop[newPop.length - 1])) {
      //if the next best individual on the new population array is already on the final new population, then pop said individual of new population array
      newPop.pop();
    }
    finalNewPop.push(newPop.pop());
  }
  return finalNewPop;
}
