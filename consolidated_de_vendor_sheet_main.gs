/******************************************************
main
user-facing functions (found in the Scripts dropdown)

//-----------------------------------------
// UI
//-----------------------------------------
menu() 
  -triggered to run onOpen.
  -creates the Scripts dropdown

//-----------------------------------------
// Data Entry Automation
//-----------------------------------------
createBrowserAutomationFileToSubmitOrdersInCore()
  -creates a python file for browser automation based on data in active google sheet
getResultsForBlankTowerLists()
  -for every list id in the tower sheet with missing data, get the missing data using the api, and fill it in

//-----------------------------------------
// Row Insertion
//-----------------------------------------
insertRowsToActiveSheet()
  -adds rows to the top of the active sheet, copying over the formulas and Cost Per
autoAddRows()
  -adds rows to every sheet except summary as needed
  -scheduled to run every day around midnight

//-----------------------------------------
// Quick Import of other Google Sheets
//-----------------------------------------
combineSpreadsheetIntoNewSheet()
  -combines all the sheets in a spreadsheet and puts the results in a new sheet in this spreadsheet

*******************************************************/

//-----------------------------------------
// UI
//-----------------------------------------

//menu
function menu()
{
  //creates the Scripts dropdown menu on the Google Sheet
  SpreadsheetApp.getUi().createMenu("Scripts")
    .addItem("Create Browser Automation File to Submit Orders in Core", "createBrowserAutomationFileToSubmitOrdersInCore")
    .addItem("Get Results for Blank Tower Lists using Tower's API", "getResultsForBlankTowerLists")
    .addSeparator()
    .addItem("Insert Rows to Active Sheet", "insertRowsToActiveSheet")
    .addItem("Auto-Add Rows to All Sheets", "autoAddRows")
    .addSeparator()
    .addItem("Combine a Google Spreadsheet into a New Sheet", "combineSpreadsheetIntoNewSheet")
    .addToUi();
}

//-----------------------------------------
// Data Entry Automation
//-----------------------------------------

//createBrowserAutomationFileToSubmitOrdersInCore
function createBrowserAutomationFileToSubmitOrdersInCore()
{

  //set up data
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let sheetName = ss.getSheetName();
  let dt = new Date();
  
  let pyScriptGDID = "1j5QdG2paHQqxKsU4XsqqGNPr6ktdrqnDKDgEousBlhk";
  let scriptFile = DocumentApp.openById(pyScriptGDID);
  let script = scriptFile.getBody().getText();
  let scriptFileName = scriptFile.getName() + "_" + String(createTimeStamp(dt));

  //Build the Python Script
  //let header = "print('" + sheetName + " - " + scriptFileName + ".py')\n";
  let header = "print('" + scriptFileName + ".py')\n\n";
  //let date =   "print('" + String(dt) + "')\n\n";
  let data = "#DATA\n" 
    + "script_file_name = '" + scriptFileName + "'\n" 
    + parseTableIntoPythonData(ss) + "\n"
  let fileContent = header + data + script;

  let file = DriveApp.createFile(scriptFileName + ".py", fileContent);
  let fileId = file.getId()
  let fileDownloadUrl = "https://drive.google.com/u/0/uc?id=" + fileId + "&export=download";
  Logger.log(fileDownloadUrl);
  
  //PROMPT USER WITH RESULTS AND LINK TO FILE (SUMMARY)
  let prompt = scriptFileName + ".py\n\n" + "Download Link to Browser Automation File:\n" + fileDownloadUrl + "\n\n";
  SpreadsheetApp.getUi().alert(prompt);
}

//getResultsForBlankTowerLists
function getResultsForBlankTowerLists()
{
  //https://docs.atdata.com/#list-api-introduction
  
  let method = "list";

  let ui = SpreadsheetApp.getUi(); 
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONST.towerSheetName);
  if(sheet == null)
  {
    return; //end script if a sheet named TOWER doesn't exist
  }

  let listIdColumn = 0;
  let dateColumn = 0;
  let descColumn = 0;
  let shippedColumn = 0;
  let validColumn = 0;
  let correctedColumn = 0;
  let unknownColumn = 0;

  let lastColumn = sheet.getLastColumn();
  let headerRow = sheet.getRange(CONST.headerRow + 1, 1, 1, lastColumn).getValues();

  for(let i = 0; i < headerRow[0].length; i++)
  {
    if(headerRow[0][i] == "LIST ID") {listIdColumn = i;}
    else if(headerRow[0][i] == "DATE") {dateColumn = i;}
    else if(headerRow[0][i] == "NAME") {descColumn = i;}
    else if(headerRow[0][i] == "UPLOADED") {shippedColumn = i;}
    else if(headerRow[0][i] == "VALID") {validColumn = i;}
    else if(headerRow[0][i] == "UPLOADED") {correctedColumn = i;}
    else if(headerRow[0][i] == "UNKNOWN")  {unknownColumn = i;}
  }

  let data = sheet.getDataRange().getValues();
  let message = "";
  let updates = 0;

  for(let i = CONST.firstRow - 1; i < data.length; i++)
  {
    let listId = data[i][listIdColumn];
    let date = data[i][dateColumn];
    let desc = data[i][descColumn];
    let shipped = data[i][shippedColumn];
    let valid = data[i][validColumn];
    let corrected = data[i][correctedColumn];
    let unknown = data[i][unknownColumn];
    //find all rows with blank data

    if(listId != "" && (date == "" || desc == "" || shipped == "" || valid == "" || unknown == ""))
    {
      //use api to get missing data
      let url = String(CONST.twrApiBaseUrl) + String(method) + "/" + String(listId) + "";
      let options = {headers: {"api_key": CONST.twrApiKey}};
      let response = UrlFetchApp.fetch(url, options);
      response = JSON.parse(response);

      let corrected = response.services.email_validation.reporting.statuses.Corrected;
      let unknown = response.services.email_validation.reporting.statuses.Unknown;
      let valid = response.services.email_validation.reporting.statuses.Valid;
      let records = response.records;
      let name = response.name;
      let created = response.created_at;
      
      //fill in the blanks
      sheet.getRange(i + 1, shippedColumn + 1).setValue(records);
      sheet.getRange(i + 1, validColumn + 1).setValue(valid);
      sheet.getRange(i + 1, correctedColumn + 1).setValue(corrected);
      sheet.getRange(i + 1, unknownColumn + 1).setValue(unknown);
      sheet.getRange(i + 1, descColumn + 1).setValue(name);
      if(date == "")
      {
        sheet.getRange(i + 1, dateColumn + 1).setValue(created);
      }
      
      message += + "\n" + listId + " " + name;
      updates += 1;
    }
  }
  
  ui.alert('Get Results for Blank Tower Lists', String(updates) + " Tower lists updated:\n" + message, ui.ButtonSet.OK_CANCEL);
}

//-----------------------------------------
// Row Insertion
//-----------------------------------------

//insertRowsToActiveSheet
function insertRowsToActiveSheet()
{
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let sheetName = sheet.getName();
  if(sheetName == CONST.summarySheetName)
  {
    Logger.log("SUMMARY SHEET");
    return;
  }

  let ui = SpreadsheetApp.getUi(); 
  let rowsToInsert;
  let errorMsg = "";
  try
  {
    rowsToInsert = ui.prompt('Insert Rows to Active Sheet','Enter number of rows to insert:',ui.ButtonSet.OK_CANCEL).getResponseText();

    Logger.log(rowsToInsert);
    if(String(rowsToInsert) == "0" || String(rowsToInsert) == "")
    {
      errorMsg = "NO ROWS TO ENTER ";
    }
    if(Number.isInteger(parseInt(rowsToInsert)) == false)
    {
      errorMsg = "ROWS TO ENTER IS NOT AN INTEGER";
    }
  }
  catch
  {
    Logger.log("ERROR " + String(errorMsg));
    return;
  }

  if(errorMsg != "")
  {
    Logger.log("ERROR " + String(errorMsg));
    return;
  }

  insertRows(sheet, CONST.headerRow + 1, CONST.firstRow + 1, parseInt(rowsToInsert));
}

//autoAddRows
function autoAddRows() 
{
  Logger.log(Date())

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheets();
  
  s = 0;
  while(s < sheets.length)
  {
    let sheet = sheets[s];
    let sheetName = sheet.getName();

    if(sheetName != CONST.summarySheetName && 
       sheetName != CONST.pathsSheetName && 
       sheetName != CONST.validationRatesSheetName &&
       sheetName != "Conor Tab" &&
       sheetName != "LOOKUP TABLES"
      )
    {
      let currentEmptyRowGoal = CONST.emptyRowGoal;
      if(sheetName == "CS DEPLOYMENT") {currentEmptyRowGoal = 20;}
      else if(sheetName == "IPOST DEPLOYMENT") {currentEmptyRowGoal = 15;}
      else if(sheetName == "EMAIL OVERSIGHT") {currentEmptyRowGoal = 15;}

      let dataSnippet = sheet.getRange(CONST.firstRow + 1, 1, currentEmptyRowGoal, 1).getValues();

      r = 0;
      while(r < dataSnippet.length && dataSnippet[r][0] == "") //[r].join instead of [r][0]?
      {
        r += 1;
      }
      let rowsToInsert = currentEmptyRowGoal - (r);
      
      insertRows(sheet, CONST.headerRow + 1, CONST.firstRow + 1, rowsToInsert)
      Logger.log(String(rowsToInsert) + " rows added to " + String(sheetName))
    }
    s += 1;
  }
}


//-----------------------------------------
// Quick Import of other Google Sheets
//-----------------------------------------

//combineSpreadsheetIntoNewSheet
function combineSpreadsheetIntoNewSheet()
{
  let ss = SpreadsheetApp.getActiveSpreadsheet();

  let ui = SpreadsheetApp.getUi(); 

  let ssSourceId;
  try   {ssSourceId = ui.prompt('Combine Spreadsheet into New Sheet','Enter Spreadsheet ID (from its URL):',ui.ButtonSet.OK_CANCEL).getResponseText();}
  catch {return;}

  if(ssSourceId == "" || ssSourceId == ui.Button.CANEL || ssSourceId == ui.Button.CLOSE || ssSourceId == ui.Button.NO)
  {
    return;
  }

  let ssSource;
  try   {ssSource = SpreadsheetApp.openById(ssSourceId);}
  catch {ui.alert("Unable to find a Google Spreadsheet with an ID of '" + String(ssSourceId) + "'.\n\nScript ended."); return;}

  let ssSourceSheets = ssSource.getSheets();
  let newSheetName = ssSource.getName();
  let newSheet = ss.insertSheet(100);

  if(!(ss.getSheetByName(newSheetName)))
  {
    newSheet.setName(newSheetName);
  }

  for(let i = 0; i <= ssSourceSheets.length - 1; i++)
  {
    let sheetSource = ssSourceSheets[i];
    Logger.log(i);
    let data = sheetSource.getDataRange().getValues();

    let newSheetLastRow = newSheet.getLastRow();
    newSheet.getRange(newSheetLastRow + 1, 1, data.length, data[0].length).setValues(data);
  }

  let msg = "Combined " + String(ssSourceSheets.length) + " sheets. \n\n From: \n " + "docs.google.com/spreadsheets/d/" + ssSourceId +  " \n\n Into: \n " + newSheetName;
  ui.alert('Combine Spreadsheet into New Sheet', msg, ui.ButtonSet.OK)
}


