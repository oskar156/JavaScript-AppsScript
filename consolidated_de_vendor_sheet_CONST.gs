/******************************************************
CONST
makes it easier to keep variables consistent
*******************************************************/

let CONST =
{
  headerRow: 1, //0-indexed
  firstRow: 3, //0-indexed
  summaryHeaderRowIndex: 0, //0-indexed
  summaryVendorColIndex: 0, //0-indexed 
  summaryTypeColIndex: 1, //0-indexed 
  summaryVendorNameInCoreColIndex: 2, //0-indexed 

  coreLoginUrl: "https://abc/",
  coreCreateNewPoUrl: "https://def/",,
  coreClaimPoUrl: "https://ghi/",,
  coreCompletePoUrl: "https://jkl/",,
  coreLoginEmail: "email@domain.com",
  coreLoginPassword: "YOUR_PASSWORD",

  pathsSheetName: "PATHS",
  pathsSheetFirstRowIndex: 1, //0-indexed
  whosRunningThisColIndex: 1, //0-indexed
  exePathColIndex: 2, //0-indexed
  driverPathColIndex: 3, //0-indexed
  coreUsernameColIndex: 4, //0-indexed
  corePasswordColIndex: 5, //0-indexed
  whosRunningThisFlag: "x",

  summarySheetName: "Summary",
  pathsSheetName: "PATHS",
  towerSheetName: "TOWER VALIDATION",
  validationRatesSheetName: "Validation Rates",

  checkColName: "PO CHECK",
  costPerColName: "COST PER",
  shippedColName: "SHIPPED",
  ocNumberColName: "ORDER NUMBER",
  fullOcColName: "FULL PO",
  poLinkColName: "PO LINK",
  qtyAlternateColumnNamesColName: "QTY COL ALTERNATE NAME",
  
  emptyRowGoal: 10,
  maxNumberOfRowsToCheckForPOsToSubmit: 200,

  twrApiKey: "TWR_API_KEY",
  twrApiBaseUrl: "TWR_API_BASE_URL",

  browserAutomationColumnsForJs: ["ORDER NUMBER", "QTY", "COST PER", "COST", "PO CHECK", "LIST ID", "NAME", "FULL PO", "PO LINK"],
  browserAutomationColumnsForPy: ["ORDER_NUMBER", "QTY", "COST_PER", "COST", "PO_CHECK", "LIST_ID", "NAME", "FULL_PO", "PO_LINK"]
}
