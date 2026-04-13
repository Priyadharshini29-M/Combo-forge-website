var SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
var SHEET_NAME = "Leads";

function doGet() {
  return ContentService.createTextOutput("ComboForge Apps Script is live");
}

function doPost(e) {
  try {
    var params = getParams_(e);
    var sheet = getLeadSheet_();

    var row = [
      valueOrNow_(params.submittedAt),
      valueOrEmpty_(params.firstName),
      valueOrEmpty_(params.lastName),
      valueOrEmpty_(params.phone),
      valueOrEmpty_(params.companyName),
      valueOrEmpty_(params.shopUrl),
      valueOrEmpty_(params.email),
      valueOrEmpty_(params.source),
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getLeadSheet_() {
  var spreadsheet =
    SPREADSHEET_ID && SPREADSHEET_ID !== "PASTE_YOUR_SPREADSHEET_ID_HERE"
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Spreadsheet not found. Set SPREADSHEET_ID in script.");
  }

  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Submitted At",
      "First Name",
      "Last Name",
      "Phone",
      "Company Name",
      "Shop URL",
      "Email",
      "Source",
    ]);
  }
  return sheet;
}

function getParams_(e) {
  var params = e && e.parameter ? e.parameter : {};

  // Allow JSON payloads too, in case frontend changes in the future.
  if (
    (!params || Object.keys(params).length === 0) &&
    e &&
    e.postData &&
    e.postData.contents
  ) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      return parsed || {};
    } catch (ignored) {
      return {};
    }
  }

  return params;
}

function valueOrEmpty_(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function valueOrNow_(value) {
  return valueOrEmpty_(value) || new Date().toISOString();
}
