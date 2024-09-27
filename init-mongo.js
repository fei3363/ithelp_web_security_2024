db = db.getSiblingDB('myapp');

db.createCollection('products');


// name (string): 商品名稱
// category (string): 商品類別
// price (number): 商品價格
// stock (number): 商品庫存
db.products.insertMany([
    { name: "筆記型電腦", category: "電子產品", price: 1200, stock: 50 },
    { name: "智慧型手機", category: "電子產品", price: 800, stock: 100 },
    { name: "平板電腦", category: "電子產品", price: 600, stock: 75 },
    { name: "耳機", category: "配件", price: 150, stock: 200 },
    { name: "鍵盤", category: "配件", price: 100, stock: 150 },
    { name: "咖啡杯", category: "家居", price: 20, stock: 300 }
]);
