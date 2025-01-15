/******************************************************
helperFunctions

//-----------------------------------------
// Parse Data for Python Scripts
//-----------------------------------------
parseTableIntoPythonData(sheet)
  -takes the data in a sheet and formats it into a string that can be use by a python script
correctVariableName(rawString)
  -return cleanString
  -converts non alphanumeric chars in a string to "_"

//-----------------------------------------
// Row Insertion
//-----------------------------------------
insertRows(sheet, headerRow, firstRow)
copyFormulas(sheet, sourceRow, targetRow, rows)

//-----------------------------------------
// Finding Data in a Google Sheet
//-----------------------------------------
hMatch(arr, rowToSearch, lookUpPhrase)
  -return columnIndex //should be renamed to rowIndex i think
  -hLookup re-creation
vMatch(arr, colToSearch, lookUpPhrase)
  -return columnIndex
  -vLookup re-creation

//-----------------------------------------
// Time
//-----------------------------------------
createTimeStamp()
  -returns a string timestamp of current date (new Date()) as YYYY-MM-DD hh_mm_ss

*******************************************************/

//-----------------------------------------
// Parse Data for Python Scripts
//-----------------------------------------

//parseTableIntoPythonData
function parseTableIntoPythonData(ss)
{
  let ssId = ss.getId();

  ///////////////////////////////
  //SET UP DATA
  ///////////////////////////////
  let pythonData = "\n"
  pythonData += "#SET UP DATA" + "\n";
  pythonData += "_HEADER_ROW_ = " + String(CONST.headerRow) + "\n";
  pythonData += "_FIRST_ROW_ = "  + String(CONST.firstRow) + "\n";

  pythonData += "core_login_url = '" + String(CONST.coreLoginUrl) + "'" + "\n";
  pythonData += "core_create_new_po_url = '" + String(CONST.coreCreateNewPoUrl) + "'" + "\n";
  pythonData += "core_claim_po_url = '" + String(CONST.coreClaimPoUrl) + "'" + "\n";
  pythonData += "core_complete_po_url = '" + String(CONST.coreCompletePoUrl) + "'" + "\n";

  pythonData += "google_sheet_id = '" + String(ssId) + "'" + "\n";

  //user data
  let pathData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONST.pathsSheetName).getDataRange().getValues();
  let pathRowIndex = vMatch(pathData, CONST.whosRunningThisColIndex.toString().toLowerCase(), CONST.whosRunningThisFlag);

  let exePath = pathData[pathRowIndex][CONST.exePathColIndex];
  let driverPath = pathData[pathRowIndex][CONST.driverPathColIndex];
  pythonData += "exe_path=r'" + String(exePath) + "'" + "\n";
  pythonData += "driver_path=r'" + String(driverPath) + "'" + "\n";

  let coreLogin = pathData[pathRowIndex][CONST.coreUsernameColIndex];
  let corePassword = pathData[pathRowIndex][CONST.corePasswordColIndex];
  if(coreLogin == "") {CONST.coreLoginEmail}
  if(corePassword == "") {CONST.coreLoginPassword}
  pythonData += "username = '" + String(coreLogin) + "'" + "\n";
  pythonData += "password = '" + String(corePassword) + "'" + "\n";
  pythonData += "\n";

  ///////////////////////////////
  //SUMMARY DATA
  ///////////////////////////////
  let sheetsToSubmitOrdersFor = [];
  let summarySheet = ss.getSheetByName(CONST.summarySheetName);
  let summaryData = summarySheet.getDataRange().getValues();
  let vendorData = "[";
  let typeData = "[";
  let vendorNameInCoreData = "[";
  
  pythonData += "#SUMMARY DATA" + "\n";
  for(let i = CONST.firstRow; i < summaryData.length; i++)
  {
    let currentVendor = String(summaryData[i][CONST.summaryVendorColIndex]);
    if(String(summaryData[i][CONST.summaryVendorColIndex]) != "")
    {
      sheetsToSubmitOrdersFor.push(currentVendor);
      vendorData += "'" + String(summaryData[i][CONST.summaryVendorColIndex]) + "',";
      typeData += "'" + summaryData[i][CONST.summaryTypeColIndex] + "',";
      vendorNameInCoreData += "'" + summaryData[i][CONST.summaryVendorNameInCoreColIndex] + "',";
    }
  }
  

  //sheetsToSubmitOrdersFor = ["B2B DATA BRIDGE","LIVE INTENT"];//DELETE ME
  Logger.log(sheetsToSubmitOrdersFor);
  vendorData = vendorData.slice(0, -1);
  typeData = typeData.slice(0, -1);
  vendorNameInCoreData = vendorNameInCoreData.slice(0, -1);

  vendorData += "]\n";
  typeData += "]\n";
  vendorNameInCoreData += "]\n";

  //eventually if there's a dedicated place in the sheet for this info, this will have to change
  pythonData += "summary_vendor = " + String(vendorData) + "\n";
  pythonData += "summary_type = " + String(typeData) + "\n";
  pythonData += "summary_vendor_name_in_core = " + String(vendorNameInCoreData) + "\n";
  pythonData += "\n";

  ///////////////////////////////
  //SHEET DATA
  ///////////////////////////////
  pythonData += "#SHEET DATA" + "\n";
  //browserAutomationColumnsForJs: ["ORDER NUMBER", "QTY", "COST PER", "COST", "PO CHECK", "LIST ID", "NAME"],
  //browserAutomationColumnsForPy: ["ORDER_NUMBER", "QTY", "COST_PER", "COST", "PO_CHECK", "LIST_ID", "NAME"]

  //for each of the browserAutomationColumnsForJs defined in CONST
  let browserAutomationColumnsData = [];
  for(let c = 0; c < CONST.browserAutomationColumnsForJs.length; c++)
  {
    //write the variable name = [
    browserAutomationColumnsData.push(String(CONST.browserAutomationColumnsForPy[c]) + " = [");
  }

  let lowestRowIndexPerSheet = "lowest_row_index_per_sheet = [";
  let firstRowIndexPerSheet = "first_row_index_per_sheet = [";
  let poCheckColIndexPerSheet = "po_check_col_index_per_sheet = [";
  let coreLinkColIndexPerSheet = "core_link_col_index_per_sheet = [";
  let fullOcColIndexPerSheet = "full_oc_col_index_per_sheet = [";
  let qtyColIndexPerSheet = "qty_col_index_per_sheet = [";

  //for each sheet we're submitting orders for
  //let qtyColFound = false;

  for(let s = 0; s < sheetsToSubmitOrdersFor.length; s++)
  {
    //qtyColFound = false;

    let currentSheetName = sheetsToSubmitOrdersFor[s];
    let currentSheet = ss.getSheetByName(currentSheetName);
    let currentSheetData = currentSheet.getDataRange().getValues();
    let sheetSummaryRowIndex = vMatch(summaryData, CONST.summaryVendorColIndex, currentSheetName);
    //let lowestRowIndex = 1;

    let ocNumberColIndex = hMatch(currentSheetData, CONST.headerRow, CONST.ocNumberColName);
    let shippedColIndex = hMatch(currentSheetData, CONST.headerRow, CONST.shippedColName);
    let checkColIndex = hMatch(currentSheetData, CONST.headerRow, CONST.checkColName);

    let firstRow = -1;
    let lastRow = -1;
    let foundARow = false;
    
    //get first and last rows for this sheet
    for(let r = CONST.firstRow; r < currentSheetData.length && r <= CONST.maxNumberOfRowsToCheckForPOsToSubmit; r++)
    {
      if(currentSheetData[r][checkColIndex] == false &&
         currentSheetData[r][shippedColIndex] != 0 && 
         currentSheetData[r][shippedColIndex] != "" && 
         currentSheetData[r][ocNumberColIndex] != 0 && 
         currentSheetData[r][ocNumberColIndex] != "" &&
         currentSheetData[r][ocNumberColIndex] != "-")
      {
        if(foundARow == false)
        {
          foundARow = true;
          firstRow = r;
        }
        lastRow = r;
      }
    }

    //Logger.log(currentSheetName);
    //Logger.log(firstRow);
    //Logger.log(lastRow);

    //for each col we want
    for(let c = 0; c < CONST.browserAutomationColumnsForJs.length; c++)
    {
      let currentCol = CONST.browserAutomationColumnsForJs[c];
      let currentColIndex = -1;

      if(currentCol == "QTY")
      {
        //qtyColFound = true;

        //get valid options from SUMMARY
        let validOptionsColIndex = hMatch(summaryData, CONST.summaryHeaderRowIndex, CONST.qtyAlternateColumnNamesColName);
        let validOption = summaryData[sheetSummaryRowIndex][validOptionsColIndex];
        currentColIndex = hMatch(currentSheetData, CONST.headerRow, validOption);
        qtyColIndexPerSheet += String(currentColIndex + 1) + ",";
      }
      else
      {
        currentColIndex = hMatch(currentSheetData, CONST.headerRow, currentCol);

        if(currentCol == CONST.checkColName)
        {
          poCheckColIndexPerSheet += String(currentColIndex + 1) + ",";
        }
        else if(currentCol == CONST.fullOcColName)
        {
          fullOcColIndexPerSheet += String(currentColIndex + 1) + ",";
        }
        else if(currentCol == CONST.poLinkColName)
        {
          coreLinkColIndexPerSheet += String(currentColIndex + 1) + ",";
        }
      }

      browserAutomationColumnsData[c] += "[";
      let needToSlice = false;

      //for each row
      for(let r = firstRow; r <= lastRow && firstRow >= 0 && lastRow >= 0; r++)
      {
        //if((currentSheetData[r][checkColIndex] == false || currentSheetData[r][checkColIndex] == "") &&
        //   currentSheetData[r][shippedColIndex] != 0  && 
        //   currentSheetData[r][shippedColIndex] != "" && 
        //   currentSheetData[r][ocNumberColIndex] != 0  && 
        //   currentSheetData[r][ocNumberColIndex] != "")
        //{
          if(currentColIndex >= 0)
          {
            browserAutomationColumnsData[c] += "'" + String(currentSheetData[r][currentColIndex]).replace("'","\\'") + "',";
          }
          else if(currentColIndex <= -1)
          {
            browserAutomationColumnsData[c] += "'',"; //empty string if current column can't be in current sheet
          }

          //lowestRowIndex = r + 1;
          needToSlice = true;
        //}
      }

      if(needToSlice == true)
      {
        browserAutomationColumnsData[c] = browserAutomationColumnsData[c].slice(0,-1);//remove last comma ,
      }
      browserAutomationColumnsData[c] += "],";
    }

    //update lowestRowIndex
    lowestRowIndexPerSheet += String(lastRow + 1) + ",";
    firstRowIndexPerSheet += String(firstRow + 1) + ",";
  }

  lowestRowIndexPerSheet = lowestRowIndexPerSheet.slice(0, -1);
  lowestRowIndexPerSheet += "]\n\n";
  firstRowIndexPerSheet = firstRowIndexPerSheet.slice(0, -1);
  firstRowIndexPerSheet += "]\n\n";
  poCheckColIndexPerSheet = poCheckColIndexPerSheet.slice(0, -1);
  poCheckColIndexPerSheet += "]\n\n";
  fullOcColIndexPerSheet = fullOcColIndexPerSheet.slice(0, -1);
  fullOcColIndexPerSheet += "]\n\n";
  coreLinkColIndexPerSheet = coreLinkColIndexPerSheet.slice(0, -1);
  coreLinkColIndexPerSheet += "]\n\n";
  qtyColIndexPerSheet = qtyColIndexPerSheet.slice(0, -1);
  qtyColIndexPerSheet += "]\n\n";

  for(let c = 0; c < browserAutomationColumnsData.length; c++)
  {
    browserAutomationColumnsData[c] = browserAutomationColumnsData[c].slice(0, -1);
    pythonData += String(browserAutomationColumnsData[c]) + "]\n\n";
  }
  
  pythonData += firstRowIndexPerSheet;
  pythonData += lowestRowIndexPerSheet;
  pythonData += poCheckColIndexPerSheet;
  pythonData += fullOcColIndexPerSheet;
  pythonData += coreLinkColIndexPerSheet;
  pythonData += qtyColIndexPerSheet;
  return pythonData;
}

//correctVariableName
function correctVariableName(rawString)
{
  rawString = String(rawString).trim();

  let cleanString ="";
  c = 0;
  for(let char of rawString)
  {
    
    let charCode = char.charCodeAt(0);
    let cleanChar = char;

    if(c == 0 && !((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (char == "_"))) { //if 1st char and (not alpha or not underscore)
      cleanChar = "var_";
    }
    else if(!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || (char == "_"))) { //if not alpha or numeric or underscore
      cleanChar = "_";
    }

    cleanString += cleanChar;
    c++;
  }
  
  return cleanString;
}

//-----------------------------------------
// Row Insertion
//-----------------------------------------

//insertRows
function insertRows(sheet, headerRowIndex, firstRowIndex, rowsToInsert)
{

  if(rowsToInsert <= 0 || rowsToInsert == "")
  {
    return;
  }

  let lastColumn = sheet.getLastColumn();
  let headerRow = sheet.getRange(headerRowIndex, 1, 1, lastColumn).getValues();

  let costPerColumn = 0;
  let checkColumn = 0;
  let fullOcColumn = 0;
  let coreLinkColumn = 0;

  for(let i = 0; i < headerRow[0].length; i++)
  {
    if(headerRow[0][i] == CONST.costPerColName)
    {
      costPerColumn = i;
    }
    else if(headerRow[0][i] == CONST.checkColName)
    {
      checkColumn = i;
    }
    else if(headerRow[0][i] == CONST.fullOcColName)
    {
      fullOcColumn = i;
    }
    else if(headerRow[0][i] == CONST.poLinkColName)
    {
      coreLinkColumn = i;
    }
  }
  
  //let topRow = sheet.getRange(firstRowIndex, 1, 1, lastColumn);
  let topRowValues = sheet.getRange(firstRowIndex, 1, 1, lastColumn).getValues();
  //let formulas = topRow.getFormulasR1C1();

  sheet.insertRowsBefore(firstRowIndex, rowsToInsert);
  //for(let i = 0; i < rowsToInsert; i++)
  //{
  //}

  //if costPerColumn found
  if(costPerColumn > 0) //if we found the costPer column
  {
    let costPerValue = topRowValues[0][costPerColumn];
    let costPerColumnValues = [];
    for(let i = 0; i <= rowsToInsert - 1; i++)
    {
      costPerColumnValues.push([costPerValue]);
    }    

    sheet.getRange(firstRowIndex, costPerColumn + 1, rowsToInsert, 1).setValues(costPerColumnValues);
  }  
  
  //if check column found
  if(checkColumn > 0) //if we found the costPer column
  {
    let checkColumnValues = [];
    for(let i = 0; i <= rowsToInsert - 1; i++)
    {
      checkColumnValues.push([false]);
    }    

    sheet.getRange(firstRowIndex, checkColumn + 1, rowsToInsert, 1).setValues(checkColumnValues);
  }

  //if full oc column found
  if(checkColumn > 0) //if we found the costPer column
  {
    let fullOcColumnValues = [];
    for(let i = 0; i <= rowsToInsert - 1; i++)
    {
      fullOcColumnValues.push(["_"]);
    }    
    
    sheet.getRange(firstRowIndex, fullOcColumn + 1, rowsToInsert, 1).setValues(fullOcColumnValues);
  }

  //if core link column found
  if(checkColumn > 0) //if we found the costPer column
  {
    let coreLinkColumnValues = [];
    for(let i = 0; i <= rowsToInsert - 1; i++)
    {
      coreLinkColumnValues.push(["_"]);
    }    

    sheet.getRange(firstRowIndex, coreLinkColumn + 1, rowsToInsert, 1).setValues(coreLinkColumnValues);
  }
  copyFormulas(sheet, CONST.firstRow + 1 + rowsToInsert, CONST.firstRow + 1, rowsToInsert);

}

//copyFormulas
//https://stackoverflow.com/questions/44130809/google-apps-script-copy-and-paste-formulas-only
function copyFormulas(sheet, sourceRow, targetRow, rows)
{
    let formulas = sheet.getRange(sourceRow, 1, 1, sheet.getLastColumn()).getFormulasR1C1()[0];
    for (let i = 0; i < formulas.length; i++)
    {
      if (formulas[i] !== '')
      {
        let formulasToSet = []
        for(r = 0; r < rows; r++)
        {
          formulasToSet.push([formulas[i]]);
        }
        //Logger.log(rows);
        //Logger.log(formulasToSet.length);
        //Logger.log(formulasToSet);
        sheet.getRange(targetRow, i + 1, rows, 1).setFormulasR1C1(formulasToSet);
      }
    }
}

//-----------------------------------------
// Finding Data in a Google Sheet
//-----------------------------------------

//hMatch
function hMatch(arr, rowToSearch, lookUpPhrase)
{
  let rowIndex = -1;

  let a = 0;
  while(a < arr[rowToSearch].length && rowIndex < 0)
  {
    if(arr[rowToSearch][a] == lookUpPhrase)
    {
      rowIndex = a;
    }
    a = a + 1;
  }

  return rowIndex;
}

//vMatch
function vMatch(arr, colToSearch, lookUpPhrase)
{
  let columnIndex = -1;

  let a = 0;
  while(a < arr.length && columnIndex < 0)
  {
    if(arr[a][colToSearch] == lookUpPhrase)
    {
      columnIndex = a;
    }
    a = a + 1;
  }

  return columnIndex;
}

//-----------------------------------------
// Time
//-----------------------------------------
function createTimeStamp(dt = new Date())
{
  let yr = dt.getFullYear();
  let mo = dt.getMonth() + 1;
  let dy = dt.getDate();
  let hr = dt.getHours();
  let mn = dt.getMinutes();
  let sc = dt.getSeconds();

  let fullDt = String(yr);
  if(mo >= 10) {fullDt += String(mo);} else {fullDt += "0" + String(mo);}
  if(dy >= 10) {fullDt += String(dy);} else {fullDt += "0" + String(dy);}
  fullDt += "_";
  if(hr >= 10) {fullDt += String(hr);} else {fullDt += "0" + String(hr);}
  if(mn >= 10) {fullDt += String(mn);} else {fullDt += "0" + String(mn);}
  if(sc >= 10) {fullDt += String(sc);} else {fullDt += "0" + String(sc);}

  return fullDt;
}












