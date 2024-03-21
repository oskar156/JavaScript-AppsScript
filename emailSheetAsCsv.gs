//------------------------------------------------------------
//EXPORTS A SPREADSHEET TAB AS CSV AND SEND IT AS AN ATTACHMENT IN AN EMAIL
//------------------------------------------------------------
function exportAsCsv()
{
  //get active ss
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let ssId = ss.getId();

  //get relevant sheet
  let sheetName = "SHEET NAME"; //mondayToSunday(new Date(new Date().setDate((new Date()).getDate() - 1))); //yesterday, which would always be Sunday 
  //yesterday: (new Date()).setDate((new Date()).getDate() - 1) //https://stackoverflow.com/questions/5511323/calculate-the-date-yesterday-in-javascript
  Logger.log(`sheetName to attach: ${sheetName}`);

  let sheet = ss.getSheetByName(sheetName);
  let sheetId = sheet.getSheetId();

  //attach in an email and send to relevant addresses  
  let recipients = "email addresses"; //; semicolon separated list
  let subject = `SL: ${sheetName}`;
  let body = "BODY TEXT";
  Logger.log(`recipients: ${recipients}`);
  Logger.log(`subject: ${subject}`);

  //attachments
  let format = "csv";
  let fileName = sheetName
  let url = `https://docs.google.com/spreadsheets/d/${ssId}/export?exportFormat=${format}&format=${format}&gid=${sheetId}`; 

  let token = ScriptApp.getOAuthToken();
  let response = UrlFetchApp.fetch(url, {headers : {'Authorization' : 'Bearer ' + token}}).getBlob().setName(`${fileName}.${format}`);

  let options = {attachments: response};

  GmailApp.sendEmail(recipients, subject, body, options);
} 