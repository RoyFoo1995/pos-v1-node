
const {loadAllItems, loadPromotions} = require('./datbase.js');

const allItems = loadAllItems();
const promotions = loadPromotions();
let wordList = [];
let expectText = '';
let promotionPrice = 0;

module.exports = function main(barCode) {
    generateWordList(barCode);
    addAllItemToExpect();
    addPromotions();
    addTotalPrince();
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

function addAllItemToExpect() {
    expectText += "***<没钱赚商店>购物清单***\n";
    wordList.forEach(word => {
        expectText += "名称：" +
            word.name + "，数量：" +
            word.count +
            word.unit + "，单价：" +
            word.price.toFixed(2) + "(元)，小计：" +
            word.totalPrince.toFixed(2) + "(元)\n";
    });
    expectText += "----------------------\n";
}

function addPromotions() {
    expectText += "挥泪赠送商品：\n";
    wordList.map(word => {
        if (promotions[0].barcodes.includes(word.barcode) && word.count >= 2) {
            let promotionCount = 1;
            expectText += "名称：" + word.name + "，数量：" + promotionCount + word.unit + "\n";
            promotionPrice += word.price * promotionCount;
        }
    });
    expectText += "----------------------\n";
}

function addTotalPrince() {
    expectText += "总计：" + wordList.reduce((sum, w) => sum += w.totalPrince, 0).toFixed(2) + "(元)\n";
    expectText += "节省：" + promotionPrice.toFixed(2) + "(元)\n";
    expectText += "**********************";
}