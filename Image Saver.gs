//use with this google spreadsheet: https://docs.google.com/spreadsheets/d/1S4V49stGY6DPVrVHhEsqYV8uKByb_Zc_-CbjlFyWQAE/edit#gid=0

function menu()
{
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Scripts").addItem("URL Downloader", "urlDownloader").addToUi();
}

function urlDownloader()
{
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let data = sheet.getDataRange().getValues();

  let HORIZONTAL_ITERATIONS = data[1][1];;
  let URL_COL = parseInt(data[2][1]);
  let NAME_COL = parseInt(data[3][1]);
  let STATUS_COL = parseInt(data[4][1]);
  let START_ROW = parseInt(data[5][1]);
  let END_ROW = parseInt(data[6][1]);
  let FOLDER_ID = data[7][1];
  let HORIZONTAL_INTERVAL = 3;



  for(let h = 0; h < HORIZONTAL_ITERATIONS; h++)
  {
    let newStatuses = [];

    let currentUrlCol = URL_COL + (HORIZONTAL_INTERVAL * h) ;
    let currentNameCol = NAME_COL + (HORIZONTAL_INTERVAL * h);
    let currentStatusCol = STATUS_COL + (HORIZONTAL_INTERVAL * h);
    Logger.log(String(h) + " " + String(currentUrlCol) + " " + String(currentNameCol) + " " + String(currentStatusCol));

    let r = 0;
    for(let currentRow = START_ROW - 1; currentRow <= END_ROW - 1 && currentRow <= data.length - 1; currentRow++)
    {
      let url = data[currentRow][currentUrlCol - 1];
      let name = data[currentRow][currentNameCol - 1];

      let response = 200;
    
      if(url == "_")
      {
        response = 404;
      }
      else
      {
        try
       {
          //response = UrlFetchApp.fetch(url).getResponseCode();
          image = UrlFetchApp.fetch(url).getBlob().getAs("image/jpeg").setName(name);

          if(FOLDER_ID == "")
            DriveApp.createFile(image); //file = ...
          else
            DriveApp.getFolderById(FOLDER_ID).createFile(image); //file = ...
        }
        catch
        {
         response = 404;
        }
      }
      
      Logger.log(String(currentRow + 1) +  " " + url + " " + name + " " + String(response));

      newStatuses.push([]);

      if(response == 200)
        newStatuses[r].push(true);
      else
        newStatuses[r].push(false);

      r++;
    }

    //paste
    sheet.getRange(START_ROW, currentStatusCol, r, 1).setValues(newStatuses);
  }  
}
