
const {loadAllItems, loadPromotions} = require('./datbase.js');

const allItems = loadAllItems();
const promotions = loadPromotions();
let wordList = [];
let expectText = '';
let promotionPrice = 0;

module.exports = function main(barCode) {
    generateWordList(barCode);
    console.log(expectText);
};

function generateWordList(barCode) {
    let temptItems = allItems;
    barCode.forEach(value => {
        temptItems.map(item => {
            let barCode = item.barcode;
            if (value.indexOf(barCode) !== -1) {
                if (item.count === undefined) item.count = 0;
                value.indexOf("-") !== -1 ?
                    item.count = parseInt(value.substr(value.length - 1)) :
                    item.count++;
                item.totalPrince = item.count * item.price;
            }
        })
    });
    wordList = temptItems.filter(item => item.count !== undefined);
}

