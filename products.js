

// ============================================
// products.js
// One shared list of every product on the site.
// Note: ids 9-13 are the SAME real products as 5,6,7,8,2 — they're
// just listed twice because they appear in both the "Shop All" and
// "Daily Treats" sections of the homepage with separate buttons.
// ============================================

const PRODUCTS = [
    { id: 1, name: "Fresh Cream Cake",        price: 750, category: "shop_all" },
    { id: 2, name: "Mawa",                    price: 250, category: "shop_all" },
    { id: 3, name: "Confetti Sprinkle Cake",  price: 800, category: "shop_all" },
    { id: 4, name: "Pistachio Semolina Cake", price: 200, category: "shop_all" },
    { id: 5, name: "Gulab Jamun",             price: 250, category: "shop_all" },
    { id: 6, name: "Cupcakes",                price: 250, category: "shop_all" },
    { id: 7, name: "Croissants",              price: 150, category: "shop_all" },
    { id: 8, name: "Muffins",                 price: 180, category: "shop_all" },
    { id: 9, name: "Gulab Jamun",             price: 250, category: "daily_treat" },
    { id: 10, name: "Cupcakes",               price: 250, category: "daily_treat" },
    { id: 11, name: "Croissants",             price: 150, category: "daily_treat" },
    { id: 12, name: "Muffins",                price: 180, category: "daily_treat" },
    { id: 13, name: "Mawa",                   price: 250, category: "daily_treat" }
];

// Helper every other file uses: find one product by its id
function getProductById(id) {
    return PRODUCTS.find(function (p) { return p.id === id; });
}