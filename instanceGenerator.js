const fs = require("fs");
const promptSync = require("prompt-sync");
module.exports = function generator() {
  let fs = require("fs");
  let writeLine = line => fs.appendFileSync("log.txt", `\n ${line}`);
  const prompt = promptSync();
  let numberOfCities = prompt("Fill in the total number of destinations: ");
  console.log(
    `You will attempt to solve the travelling salesman problem for  ${numberOfCities} destinations`
  );
  writeLine(
    `\n New Instance: \nYou will attempt to solve the travelling salesman problem for  ${numberOfCities} destinations`
  );
  //user input is parsed as string. Convert it to number
  numberOfCities = Number(numberOfCities);
  //initialize an empty array of size #numberOfCities
  //and map over each element of the array to create the x,y coordinates of the city
  let xCoord = Array.from(Array(numberOfCities)).map(x => {
    //range for x,y coordinates: [0,10] with 2 decimal points
    let num = Math.random() * 10;
    num = Math.round((num + Number.EPSILON) * 100) / 100;
    return num;
  });
  let yCoord = Array.from(Array(numberOfCities)).map(y => {
    let num = Math.random() * 10;
    num = Math.round((num + Number.EPSILON) * 100) / 100;
    return num;
  });
  //print pair of (x,y) coordinates for each city
  console.log(
    `The coordinates randomly picked for these ${numberOfCities} cities are:`
  );
  writeLine(
    `The coordinates randomly picked for these ${numberOfCities} cities are:`
  );
  for (let i = 0; i < numberOfCities; i++) {
    console.log(xCoord[i], yCoord[i]);
    writeLine([xCoord[i], yCoord[i]]);
  }
  //write the coordinates to file , to be parsed by the parser
  fs.writeFileSync("xCoordinates.json", JSON.stringify(xCoord));
  fs.writeFileSync("yCoordinates.json", JSON.stringify(yCoord));
  return [xCoord, yCoord];
};
