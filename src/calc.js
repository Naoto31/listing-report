var listingsFile = document.getElementById('listings-file');
var avgPriveTable = document.getElementById('average-price-table');
var distTable = document.getElementById('distribution-table');
listingsFile.addEventListener('change', loadListingsCsv);
/**
 * loadListingsCsv
 * @param e {any}
 */
function loadListingsCsv(e) {
    var fileData = e.target.files[0];
    if (!fileData.name.match('.csv$')) {
        alert('Please uplaod csv file');
        return;
    }
    var reader = new FileReader();
    reader.onload = function () {
        var cols = reader.result.split('\n');
        var csvArray = new Array();
        var counts = {};
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
function prepFirstTable(array) {
    var privateArr = [];
    var dealerArr = [];
    var otherArr = [];
    array.map(function (value) {
        if (value[4] == '"private"') {
            privateArr.push(parseInt(value[2]));
        }
        else if (value[4] == '"dealer"') {
            dealerArr.push(parseInt(value[2]));
        }
        else if (value[4] == '"other"') {
            otherArr.push(parseInt(value[2]));
        }
    });
    var privateAvg = calcAverage(privateArr);
    var dealerAvg = calcAverage(dealerArr);
    var otherAvg = calcAverage(otherArr);
    var avgPriceTable = [
        ['Seller Type', 'Average in Euro'],
        ['private', "\u20AC " + privateAvg],
        ['dealer', "\u20AC " + dealerAvg],
        ['other', "\u20AC " + otherAvg],
    ];
    var insertTable = createTable(avgPriceTable);
    avgPriveTable.appendChild(insertTable);
}
/**
 * calc Average
 * @param array
 */
function calcAverage(eachArray) {
    var totalValue = 0;
    eachArray.map(function (value) {
        totalValue = totalValue + value;
    });
    return (totalValue / eachArray.length).toFixed(1);
}
/**
 * prepSecondTable (Percentual Distribution)
 * @param csvArray
 * @param counts
 */
function prepSecondTable(csvArray, counts) {
    var valueLength = csvArray.length - 2; // need to check this part
    var distTableData = getDistData(counts, valueLength);
    var insertData = createTable(distTableData);
    distTable.appendChild(insertData);
}
/**
 * get Distribution Data
 * @param counts
 */
function getDistData(counts, valueLength) {
    counts = Object.entries(counts);
    counts.map(function (value) {
        value[0] = value[0].substring(1, value[0].length - 1);
        value[1] = ((value[1] / valueLength) * 100).toFixed(1) + '%';
    });
    counts.sort(function (a, b) { return b[1].substring(0, b[1].length - 1) - a[1].substring(0, a[1].length - 1); });
    counts.unshift(['Make', 'Distribution']);
    return counts;
}
/**
 * create Table
 * @param data
 */
function createTable(data) {
    var table = document.createElement('table');
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < data[i].length; j++) {
            var td = document.createElement('td');
            td.innerText = data[i][j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}
