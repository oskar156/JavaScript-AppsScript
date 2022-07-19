//exportAndPrint.gs

//exportSheet(fileName, ssID, sheetID, format, portraitBoolString)


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exportSheet
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function exportSheet(fileName, ssID, sheetID, format, portraitBoolString) {

  //Specify PDF export parameters
  //From: https://code.google.com/p/google-apps-script-issues/issues/detail?id=3579

  var url = `https://docs.google.com/spreadsheets/d/${ssID}/export?`;

  var url_ext = `exportFormat=${format}&format=${format}` // export as pdf / csv / xls / xlsx
     + '&size=A4' // paper size legal / letter / A4
     + `&portrait=${portraitBoolString}` // orientation, false for landscape
     + '&fitw=true&source=labnol' // fit to page width, false for actual size
     + '&gridlines=true'
     + '&sheetnames=false&printtitle=false' // hide optional headers and footers
     + '&pagenumbers=false&gridlines=false' // hide page numbers and gridlines
     + '&fzr=false' // do not repeat row headers (frozen rows) on each page
     + '&gid='; // the sheet's Id

  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url + url_ext + sheetID, {                                 
    headers : {'Authorization' : 'Bearer ' + token}}).getBlob().setName(`${fileName}.${format}`);

  return response;
}
