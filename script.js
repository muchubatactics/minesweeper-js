let height, width, mines;
let URLParams = new URLSearchParams(window.location.search);
height = URLParams.get("param1");
width = URLParams.get("param2");
mines = URLParams.get("param3");

console.log(height, width, mines);
