
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


// make sure to have 2 env variables
async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}


async function getSpreadSheet({spreadsheetId, auth}) {
    const res = await sheets.spreadsheets.get({
      spreadsheetId,
      auth
    });
    
    return res;
}

async function getSpreadSheetValues({spreadsheetId, auth, sheetName}) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

async function addSheetIntoSpreadsheet({spreadsheetId, auth, sheetName}) {

    const requests = [
        {
            "addSheet": {
              "properties": {
                "title": "sheetName"
              }
            }
          }
    ]

    console.log("print = " + JSON.stringify(requests[0]["addSheet"]));
      
    const res = await sheets.spreadsheets.batchUpdate({spreadsheetId, auth, requests});
    return res;
}


async function addNewSheet(spreadsheetId, sheetTitle, index = 0) {
    // Authenticate with Google Sheets API
    console.log("inside add new sheet function");

    const auth = await getAuthToken(); // Replace with your authentication logic
  
    // Create the Sheets API client
    const mysheets = google.sheets({ version: 'v4', auth });
    console.log("line1");
    // Define the request body
    const request = {
      spreadsheetId,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetTitle,
              index, // Optional: specify the insertion index (defaults to 0)
            },
          },
        }],
      },
    };

    console.log("line2");
  
    try {
      // Send the request to add the new sheet
      console.log("line3 inside catch");
      const response = await mysheets.spreadsheets.batchUpdate(request);
      console.log("line4 inside catch");
      console.log("success");
      console.log('New sheet added successfully:', response.data.replies[0].addSheet.properties.title);
      
    } catch (err) {
      console.error('Error adding sheet:', err);
    }
  }



  async function addRowToSheet(spreadsheetId, sheetId, rowItemList) {
    const auth = await getAuthToken();
  
    const mysheets = google.sheets({ version: 'v4', auth });
    const rowNumber = await getLastFilledRow(spreadsheetId, sheetId);
    const request = {
      spreadsheetId,
      range: `${sheetId}!A${rowNumber}:A`,
      
      // Adjust range based on your data and insertion point
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowItemList], // Array of values for the new row (adjust for multiple columns)
      },
    };
  
    try {
      // Send the request to append the row
      const response = await mysheets.spreadsheets.values.append(request);
      console.log('Row added successfully');
    } catch (err) {
      console.error('Error adding row:', err);
    }
  }

  async function getLastFilledRow(spreadsheetId, sheetId) {
    const request = {
      spreadsheetId,
      range: `${sheetId}!A:A` // Get all rows in column A
    };
  
    try {
        const auth = await getAuthToken();
        const mysheets = google.sheets({ version: 'v4', auth });
        const response = await mysheets.spreadsheets.values.get(request);
        const values = response.data.values || [];
  
      // Find the last index with a non-empty value
    //   let lastRow = 0;
      let lastRow = values.length+1;
    //   for (let i = values.length - 1; i >= 0; i--) {
    //     if (values[i][0]) {
    //       lastRow = i + 1;
    //       break;
    //     }
    //   }
      return lastRow;
    } catch (err) {
      console.error('Error getting last row:', err);
      return 1; // Return 1 as a default in case of errors
    }
  }


  module.exports = {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    addSheetIntoSpreadsheet,
    addNewSheet,
    addRowToSheet
  }