const listingsFile = document.getElementById('listings-file') as HTMLElement;
const avgPriveTable = document.getElementById('average-price-table') as HTMLElement;
const distTable = document.getElementById('distribution-table') as HTMLElement;

listingsFile.addEventListener('change', loadListingsCsv);

/**
 * loadListingsCsv
 * @param e {any}
 */
function loadListingsCsv(e: any) {
  const fileData = e.target.files[0];

  if (!fileData.name.match('.csv$')) {
    alert('Please uplaod csv file');
    return;
  }

  const reader = new FileReader() as any;

  reader.onload = function () {
    const cols = reader.result.split('\n');
    const csvArray = new Array();
    let counts = {} as any;

    for (var i = 0; i < cols.length; i++) {
      csvArray[i] = cols[i].split(',');
      // prepare object showing Counts per Make for the second Table
      if (i !== 0 && i !== cols.length - 1) {
        counts[cols[i].split(',')[1]] = 1 + (counts[cols[i].split(',')[1]] || 0);
      }
    }
    prepFirstTable(csvArray);
    prepSecondTable(csvArray, counts);
  };
 
  reader.readAsText(fileData);
}


/**
 * prep First Table (Average Listing Selling Price per Month)
 * @param array 
 */
function prepFirstTable(array: any) {
  const privateArr = [] as any;
  const dealerArr = [] as any;
  const otherArr = [] as any;

  array.map((value: any) => {
    if (value[4] == '"private"') {
      privateArr.push(parseInt(value[2]));
    } else if (value[4] == '"dealer"') {
      dealerArr.push(parseInt(value[2]));
    } else if (value[4] == '"other"') {
      otherArr.push(parseInt(value[2]));
    }
  });

  const privateAvg = calcAverage(privateArr) as string;
  const dealerAvg = calcAverage(dealerArr) as string;
  const otherAvg = calcAverage(otherArr) as string;

  const avgPriceTable = [
    ['Seller Type', 'Average in Euro'],
    ['private', `€ ${privateAvg}`],
    ['dealer', `€ ${dealerAvg}`],
    ['other', `€ ${otherAvg}`],
  ];

  const insertTable = createTable(avgPriceTable);
  avgPriveTable.appendChild(insertTable);
}

/**
 * calc Average
 * @param array 
 */
function calcAverage(eachArray: any) {
  let totalValue = 0;
  eachArray.map((value:any) => {
    totalValue = totalValue + value;
  });
  return (totalValue / eachArray.length).toFixed(1);
}

/**
 * prepSecondTable (Percentual Distribution)
 * @param csvArray 
 * @param counts 
 */
function prepSecondTable(csvArray: any, counts:any) {
    const valueLength = csvArray.length - 2; // need to check this part
    const distTableData = getDistData(counts, valueLength);
    const insertData = createTable(distTableData);
    distTable.appendChild(insertData);
}

/**
 * get Distribution Data
 * @param counts 
 */
function getDistData(counts: any, valueLength: number) {
    counts = Object.entries(counts);
    counts.map((value: any) => {
      value[0] = value[0].substring(1, value[0].length-1);
      value[1] = ((value[1] / valueLength) * 100).toFixed(1) + '%';
    });
    counts.sort((a: any, b:any) => b[1].substring(0, b[1].length - 1) - a[1].substring(0, a[1].length - 1));
    counts.unshift(['Make', 'Distribution']);
    return counts;
}


/**
 * create Table
 * @param data 
 */
function createTable(data: any) {
  const table = document.createElement('table');
  for (var i = 0; i < data.length; i++) {
    const tr = document.createElement('tr');
    for (var j = 0; j < data[i].length; j++) {
      const td = document.createElement('td');
      td.innerText = data[i][j];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}
