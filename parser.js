const generator = require("./instanceGenerator");
const fs = require("fs");
// run the generator to create a new instance of the problem. DONT FORGET:comment out lines 6-16, uncomment line 4
let [xCoord, yCoord] = generator();
module.exports = function parser() {
  // let xCoord, yCoor;
  // //parse the coordinates syncronously
  // try {
  //   xCoord = fs.readFileSync("./xCoordinates.json", "utf8");
  //   yCoord = fs.readFileSync("./yCoordinates.json", "utf8");
  // } catch (e) {
  //   console.log("Error:", e.stack);
  // }
  //
  // xCoord = JSON.parse(xCoord);
  // yCoord = JSON.parse(yCoord);
  let lengthOfArr = xCoord.length;
  let pointsCoord = []; //initialize array for  pair (x,y) for each city(point)
  for (let i = 0; i < lengthOfArr; i++) {
    pointsCoord.push([Number(xCoord[i]), Number(yCoord[i])]);
  }
  //print the coordinates (x,y) of each point/city
  // console.log(pointsCoord);
  //initialize a nxn array, where n=#points
  let pointsDistance = Array(lengthOfArr)
    .fill()
    .map(() => Array(lengthOfArr).fill(0));
  let dx, dy, dist;
  //calculate distance of each point from all the rest. Fill in the array
  for (let i = 0; i < lengthOfArr; i++) {
    for (let j = 0; j < lengthOfArr; j++) {
      dx = Math.abs(pointsCoord[i][0] - pointsCoord[j][0]);
      dy = Math.abs(pointsCoord[i][1] - pointsCoord[j][1]);
      dist = Math.sqrt(dx * dx + dy * dy);
      dist = Math.round((dist + Number.EPSILON) * 100) / 100;
      pointsDistance[i][j] = dist;
    }
  }
  //print the array with the distance of each point from all the rest
  return [pointsCoord, pointsDistance];
};
