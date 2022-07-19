//qry.gs

//qry(col1String, col2String, dataType = 1, sheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getSheetName()) 

//-----------------------------------------------------------------------------------------------
// qry
//-----------------------------------------------------------------------------------------------
function qry(colStringRaw, dataType = 1, sheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getSheetName()) {

  const asciiAdj = 64;
  const alphabet = 26;
  var data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
  var column = [];
  
  var colString = colStringRaw.split(",");
  for(var s = 0; s < colString.length; s++) { //parse columns

    colString[s].toString().toUpperCase();
    column.push(0);

    var iterations = 0;
    for(var c = colString[s].length - 1; c >= 0; c--) {

      var letter = colString[s][c];
      var colNum = letter.charCodeAt() - asciiAdj;
      column[s] += colNum + (alphabet * iterations);
      iterations++;
    }

    column[s] -= 1; //so they're 0-indexed
  }

  var values = [];

  for(var a = 0; a < data.length; a++) { //combinig data i think

    while(data[a] == "")
      a++;
 
    var colVals = [];
    for(var c = 0; c < column.length; c++) {

      if(c < column.length - 1) //if it's one of the category cols
        colVals.push(data[a][column[c]].toString().trim());

      else if(dataType == 1 && c == column.length - 1) { //if it's the last index (ie the number column) and we're summing

        var val = 0;
        var valString = data[a][column[c]].toString().trim();

        if(valString[0] == "$")
          valString.splice(0, 1);
          
        if(valString != "" && valString != null)
          val = parseFloat(valString);

        colVals.push(val);
      }

      else if(dataType == 0 && c == column.length - 1) { //if it's the last index (ie the number column) and we're counting

        var val = " ";
        if(data[a][column[c]].toString().trim() != "" && data[a][column[c]].toString().trim() != null)
          val = data[a][column[c]].toString().trim();

        colVals.push(val);
      }
    }

    values.push([]);
    for(var c = 0; c < colVals.length; c++) {

      values[values.length - 1].push(colVals[c]);
    }
  }

  //sort values except the last col
  var dataOrganized = [];

  for(var row = 0; row < values.length; row++) { //loop through values rows

    var combine = true;
    var compColVals = [];
    dataOrganized.push([]);

    for(var col = 0; col < values[row].length; col++) {

      compColVals.push(values[row][col]);
      dataOrganized[dataOrganized.length - 1].push(values[row][col]);
    }

    var i = 1;
    while(row + i < values.length && combine == true) {

      for(var col = 0; col < values[row].length - 1; col++) {
        Logger.log(`${compColVals[col]} != ${values[row + i][col]} is ${(compColVals[col] != values[row + i][col])}`)
        if(compColVals[col] != values[row + i][col])
          combine = false;
      }


    if(row + i < values.length && combine == true) {

      var lastRow = dataOrganized.length - 1;
      var lastCol = dataOrganized[lastRow].length - 1;

      if(dataType == 1)
        dataOrganized[lastRow][lastCol] += values[row + i][lastCol];
      else if(dataType == 0)
        dataOrganized[lastRow][lastCol] += 1;
    }
    i++;
    }
    row += 1;
  }
 
  //loop through values col
    //if all except the last
  Logger.log(dataOrganized);
  return dataOrganized;
}
