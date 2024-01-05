// entire project can be found here: https://docs.google.com/spreadsheets/d/1JH1-WDlld_TliJVcUX-ot2dlIqjPnLVz8-Jqvt6_Sdg/edit?usp=sharing
// to see the code and code history, go to Extensions > Apps Script

function generateShoppingList() {
  var generatorSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var allSheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var pantrySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('pantry');
  var numRecipes = allSheets.length - 3;

  // reset recipe counter
  generatorSheet.getRange('G1').setValue(0 + ' out of ' + numRecipes + ' recipes completed');

  // delete old ingredients (from previous generation)
  generatorSheet.getRange('A7:A1000').setValue('');

  // delete old recipes (from previous generation)
  generatorSheet.getRange('G7:G1000').setValue('');  

  // delete old quantities (from prev. generation)
  generatorSheet.getRange('B7:B1000').setValue('');
  generatorSheet.getRange('C7:C1000').setValue('');
  generatorSheet.getRange('D7:D1000').setValue('');
  generatorSheet.getRange('E7:E1000').setValue('');
  generatorSheet.getRange('F7:F1000').setValue('');

  var desiredStores = [];
  
  if (generatorSheet.getRange('B2').getValue()) {
    desiredStores.push(generatorSheet.getRange('B1').getValue());
  }

  if (generatorSheet.getRange('C2').getValue()) {
    desiredStores.push(generatorSheet.getRange('C1').getValue());
  }

  if (generatorSheet.getRange('D2').getValue()) {
    desiredStores.push(generatorSheet.getRange('D1').getValue());
  }

  if (generatorSheet.getRange('E2').getValue()) {
    desiredStores.push(generatorSheet.getRange('E1').getValue());
  }

  var ingredients = new Set();
  var recipes = new Set();
  var quantities = {};
  

  for (var i = 3; i < allSheets.length; i++) {
    // Logger.log(new Array(...ingredients).join(', ') + ' begining')
    
    var currentSheet = allSheets[i];    

    var checkIngreds = [];
    var allIngreds = [];

    // Logger.log(currentSheet.getRange('A1').getValue());
    for (var rowNum = 2; rowNum < 22; rowNum++) {
      currIngred1 = currentSheet.getRange('B' + rowNum).getValue();
      currIngred2 = currentSheet.getRange('C' + rowNum).getValue();

      if (currentSheet.getRange('A' + rowNum).getValue() == '') {
        break;
      }
      
      // pantry items don't need to be included in the count
      if (currIngred1 == 'Pantry' || currIngred2 == 'Pantry') {
        
        for (var m = 1; m < 1000; m++) {
          var ingred = pantrySheet.getRange('A' + m).getValue();
          if (ingred == '') {
            break;
          }
          
          if (ingred == currentSheet.getRange('A' + rowNum).getValue()) {
            var quantityLeft = pantrySheet.getRange('B' + m).getValue();
            var quantityNeeded = currentSheet.getRange('D' + rowNum).getValue();
            if (quantityLeft != 'Have a lot') {
              // Logger.log('adding this: ' + ingred);
              ingredients.add(ingred);

              if (!(ingred in quantities)) {
                quantities[ingred] = [];
              }

              quantities[ingred].push(quantityNeeded);
              // Logger.log(new Array(...ingredients).join(', ') + ' wtf');
            }
            break;
          }
        }
      
      // everything else needs to be included in the count
      } else {
        allIngreds.push(currentSheet.getRange('A' + rowNum).getValue());
      
        if (desiredStores.includes(currIngred1) || desiredStores.includes(currIngred2)) {
          ingred = currentSheet.getRange('A' + rowNum).getValue();
          quantityNeeded = currentSheet.getRange('D' + rowNum).getValue();
          checkIngreds.push(ingred);

          if (!(ingred in quantities)) {
            quantities[ingred] = [];
          }
          quantities[ingred].push(quantityNeeded);
        }
      }
    }

    if (allIngreds.length == checkIngreds.length) {
      recipes.add(currentSheet.getRange('A1').getValue());
      checkIngreds.forEach(i => ingredients.add(i));
    }

    generatorSheet.getRange('G1').setValue(i - 2 + ' out of ' + numRecipes + ' recipes completed');
    // Logger.log(new Array(...ingredients).join(', ') + ' end');
  }
  
  // communicate that recipes are being displayed now
  generatorSheet.getRange('G1').setValue('display being updated');

  // display new ingredients
  var rowNum = 7;
  for (var ingredient of ingredients) {
    generatorSheet.getRange('A' + rowNum).setValue(ingredient);

    var s = "";
    for (var o = 0; o < quantities[ingredient].length; o++) {
      s += quantities[ingredient][o];
      s += ', ';
    }
    generatorSheet.getRange('B' + rowNum).setValue(s.slice(0, s.length - 2));
    rowNum += 1;
  }
  // display new recipes
  var rowNum = 7;
  for (var recipe of recipes) {
    generatorSheet.getRange('G' + rowNum).setValue(recipe);
    rowNum += 1;
  }
  // display new quantities
}

function clearLists() {
  var generatorSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var numRecipes = SpreadsheetApp.getActiveSpreadsheet().getSheets().length - 3;

  // recipe counter
  generatorSheet.getRange('G1').setValue(0 + ' out of ' + numRecipes + ' recipes completed');

  // ingredients list
  generatorSheet.getRange('A7:A1000').setValue('');

  // recipes list
  generatorSheet.getRange('G7:G1000').setValue('');  

  // ingredient quantities
  generatorSheet.getRange('B7:B1000').setValue('');
  generatorSheet.getRange('C7:C1000').setValue('');
  generatorSheet.getRange('D7:D1000').setValue('');
  generatorSheet.getRange('E7:E1000').setValue('');
  generatorSheet.getRange('F7:F1000').setValue('');
}
