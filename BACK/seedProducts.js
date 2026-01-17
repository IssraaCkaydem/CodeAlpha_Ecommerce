// seedProducts.js
require("dotenv").config({ path: "./secret.env" });
const mongoose = require("mongoose");
const Product = require("./models/Product");

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.mcrtib2.mongodb.net/${dbName}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDB Atlas successfully"))
  .catch((error) => console.log("Error connecting to MongoDB Atlas", error));

const products = [
  { name: "iPhone 14", description: "Apple smartphone with A15 Bionic chip", price: 1200, imageUrl: "https://i5.walmartimages.com/seo/Used-Apple-iPhone-14-Plus-128GB-Purple-AT-T-MQ3U3LL-A-Used-Good-Condition_b1cba713-4e12-4073-91e2-78dd847287c7.849f7bf269723a95b744c13e031ae7c2.jpeg", category: "Smartphones" },
  { name: "iPhone 14 Pro", description: "Apple smartphone with A16 Bionic chip", price: 1400, imageUrl: "https://i5.walmartimages.com/seo/Pre-Owned-Apple-iPhone-14-Pro-512GB-Deep-Purple-FACTORY-UNLOCKED-Refurbished-Good_ff32246e-34a1-44eb-9486-9a390154ef55.269d1800ef84ec355c6c134a2e83ca5a.jpeg", category: "Smartphones" },
  { name: "iPhone 14 Pro Max", description: "Apple smartphone with large screen and top camera", price: 1600, imageUrl: "https://m.media-amazon.com/images/I/513FAMDqgXL._AC_SY300_SX300_QL70_FMwebp_.jpg", category: "Smartphones" },
  { name: "Samsung Galaxy S23", description: "Samsung flagship phone with Snapdragon 8 Gen 2", price: 999, imageUrl: "https://m.media-amazon.com/images/I/61yUiD1CVML._AC_SL1500_.jpg", category: "Smartphones" },
  { name: "Samsung Galaxy S23+", description: "Samsung plus size flagship phone", price: 1099, imageUrl: "https://m.media-amazon.com/images/I/51ZKAfXZfsL._AC_SY300_SX300_QL70_FMwebp_.jpg", category: "Smartphones" },
  { name: "Samsung Galaxy S23 Ultra", description: "Samsung top model with best camera", price: 1299, imageUrl: "https://m.media-amazon.com/images/I/513vXUcPFrL._AC_SY300_SX300_QL70_FMwebp_.jpg", category: "Smartphones" },
  { name: "Google Pixel 8", description: "Google smartphone with Android 15", price: 899, imageUrl: "https://m.media-amazon.com/images/I/71aTjTMFiJL._AC_SY300_SX300_QL70_FMwebp_.jpg", category: "Smartphones" },
  { name: "Google Pixel 8 Pro", description: "Google Pixel advanced model with large display", price: 1099, imageUrl: "https://m.media-amazon.com/images/I/713eEl39eLL._AC_SY300_SX300_QL70_FMwebp_.jpg", category: "Smartphones" },
  { name: "OnePlus 11", description: "OnePlus flagship phone with high performance", price: 799, imageUrl: "https://m.media-amazon.com/images/I/81fRAoUL-fL._AC_SX679_.jpg", category: "Smartphones" },
  { name: "Xiaomi 13", description: "Xiaomi high-end smartphone with great camera", price: 699, imageUrl: "https://m.media-amazon.com/images/I/518JjArhvDL._AC_SX569_.jpg", category: "Smartphones" },
  { name: "Xiaomi 13 Pro", description: "Xiaomi top model with pro camera", price: 899, imageUrl: "https://m.media-amazon.com/images/I/61vFWIksgcL._AC_SY300_SX300_QL70_FMwebp_.jpg", category: "Smartphones" },
  { name: "Vivo X90 Pro", description: "Vivo advanced smartphone with great camera", price: 749, imageUrl: "https://www.dxomark.com/wp-content/uploads/medias/post-136691/Vivo-X90-Pro_featured-image-packshot-review.jpg", category: "Smartphones" },
 { name: "Sony Xperia 1 V", description: "Sony premium smartphone with 4K display", price: 1099, imageUrl: "https://i.ebayimg.com/images/g/3hMAAOSwKEJk9~1y/s-l1600.webp", category: "Smartphones" },
  { name: "Motorola Edge 40", description: "Motorola Edge phone with curved display", price: 699, imageUrl: "https://m.media-amazon.com/images/I/41X80NTSGkL._AC_SX300_SY300_QL70_ML2_.jpg", category: "Smartphones" },
  { name: "Samsung Galaxy Z Flip4", description: "Samsung foldable phone with compact design", price: 1099, imageUrl: "https://m.media-amazon.com/images/I/51StKP-zAWL._AC_SX679_.jpg", category: "Smartphones" },
  { name: "OnePlus Nord 3", description: "OnePlus mid-range model with AMOLED display", price: 399, imageUrl: "https://m.media-amazon.com/images/I/41k+DrrxKfL._SY300_SX300_QL70_FMwebp_.jpg", category: "Smartphones" },
  { name: "iPad Air", description: "Apple tablet with A14 Bionic chip", price: 599, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/iPad-Air-m3-11_53fd0f52-4257-4556-8a1e-79acb9744592.jpg?v=1742986604", category: "Tablets" },
  { name: "iPad Pro 11", description: "Apple tablet with M2 chip and Liquid Retina display", price: 799, imageUrl: "https://www.dslr-zone.com/wp-content/uploads/2022/12/ipad-pro-11-2022-7-510x510.jpeg", category: "Tablets" },
  { name: "Samsung Galaxy Tab S9", description: "Samsung tablet with AMOLED display and Snapdragon 8 Gen 2", price: 649, imageUrl: "https://www.dslr-zone.com/wp-content/uploads/2024/08/2-94-510x510.jpg", category: "Tablets" },
  { name: "Microsoft Surface Pro 9", description: "Microsoft tablet with Intel i5 processor and detachable keyboard", price: 999, imageUrl: "https://jakcomputer.com/wp-content/uploads/2025/10/EP2-33670-main-600x600.webp", category: "Tablets" },
  { name: "Lenovo Tab P12 Pro", description: "Lenovo tablet with AMOLED screen and Snapdragon 870", price: 599, imageUrl: "https://pcandparts.com/wp-content/uploads/lenovo-tab-m11-g88-64gb-tablet-200x200.jpg", category: "Tablets" },
  { name: "Amazon Fire HD 10", description: "Amazon tablet with Alexa hands-free and 10.1\" display", price: 149, imageUrl: "https://www.dslr-zone.com/wp-content/uploads/2022/03/1-2-510x510.jpg", category: "Tablets" },
  { name: "Huawei MatePad Pro", description: "Huawei tablet with Kirin processor and 10.8\" display", price: 499, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/HUAWEI-MatePad-Pro-13.2-inch-2025.jpg?v=1759134907", category: "Tablets" },
  { name: "Samsung Galaxy Tab A8", description: "Samsung affordable tablet with 10.5\" screen", price: 229, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Samsung-Galaxy--TAB-A8-10.5-inch.jpg?v=1710154328", category: "Tablets" },


  { name: "Apple Watch Series 9", description: "Apple smartwatch with GPS, heart rate monitor, and fitness tracking", price: 399, imageUrl: "https://houseofexcellence.store/cdn/shop/files/apple-watch-series-9.jpg?v=1759625165&width=500", category: "Smartwatches" },
  { name: "Apple Watch SE", description: "Affordable Apple smartwatch with fitness tracking", price: 249, imageUrl: "https://www.dslr-zone.com/wp-content/uploads/2023/05/wa6-600x600.webp", category: "Smartwatches" },
  { name: "Samsung Galaxy Watch 6", description: "Samsung smartwatch with AMOLED display and health monitoring", price: 349, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Samsung-Galaxy-Watch6-Cream-_Bluetooth_-40mm_-SM-R930NZEAXME.jpg?v=1690792486", category: "Smartwatches" },
  { name: "Samsung Galaxy Watch 6 Classic", description: "Premium Samsung smartwatch with rotating bezel", price: 449, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Galaxy-Watch6-Classic-_Bluetooth_-43mm_-SM-R950NZKAXME.jpg?v=1690794987", category: "Smartwatches" },
  { name: "Garmin Venu 3", description: "Garmin smartwatch with advanced fitness and health tracking", price: 399, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Garmin-Venu_-3-1.jpg?v=1699109758", category: "Smartwatches" },
  { name: "Fitbit Versa 4", description: "Fitbit smartwatch with heart rate and sleep tracking", price: 229, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/products/1-2_92dc45cb-80fb-4ccf-b8a9-e82fc63d7ee4.jpg?v=1670575475", category: "Smartwatches" },
  { name: "Huawei Watch GT 4", description: "Huawei smartwatch with long battery life and fitness tracking", price: 279, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/gt4-46mm-black-1.jpg?v=1696322601", category: "Smartwatches" },
  { name: "Amazfit GTR 4", description: "Amazfit smartwatch with AMOLED display and health monitoring", price: 179, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/products/amazfit-gtr-4-2.jpg?v=1680184290", category: "Smartwatches" },
  { name: "Apple AirPods Pro 2", description: "Apple wireless earbuds with Active Noise Cancellation", price: 249, imageUrl: "https://mojitech.net/wp-content/uploads/2022/10/MQD83-1-jpg.avif", category: "Headphones" },
  { name: "Sony WH-1000XM5", description: "Sony over-ear headphones with industry-leading noise cancellation", price: 399, imageUrl: "https://houseofexcellence.store/cdn/shop/files/s1_49a7488f-3a60-4599-9966-26f647b14d7a.jpg?v=1759189691&width=700", category: "Headphones" },
  { name: "Bose QuietComfort 45", description: "Bose over-ear headphones with noise cancelling and comfortable fit", price: 329, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/Bose-QuietComfort-Ultra-Headphones5.jpg?v=1700041958", category: "Headphones" },
  { name: "Samsung Galaxy Buds2 Pro", description: "Samsung wireless earbuds with 24-bit Hi-Fi audio", price: 229, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/products/222_64c0cd4e-4760-4df8-a035-5535d1d96dec.jpg?v=1673600586", category: "Headphones" },
  { name: "JBL Live 660NC", description: "JBL over-ear headphones with adaptive noise cancelling", price: 199, imageUrl: "https://www.dslr-zone.com/wp-content/uploads/2022/01/1618748429_1620579.jpeg", category: "Headphones" },
  { name: "Beats Studio3 Wireless", description: "Beats over-ear headphones with Pure Adaptive Noise Cancelling", price: 299, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/products/beats-studio-3-2.jpg?v=1678537833", category: "Headphones" },
  { name: "Anker Soundcore Liberty Air 2 Pro", description: "Anker true wireless earbuds with personalized EQ and noise cancellation", price: 129, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/files/A3930011_4ea50454-7d80-4d7b-be45-67c21a97a3b6.jpg?v=1752584333", category: "Headphones" },
  { name: "Sennheiser Momentum 4", description: "Sennheiser over-ear headphones with premium sound and ANC", price: 349, imageUrl: "https://hearfitworld.com/wp-content/uploads/2025/05/Noise-Cancelling-Headphones.jpg", category: "Headphones" },




 { name: "Apple 20W USB-C Power Adapter", description: "Fast charging USB-C charger for iPhone and iPad", price: 19, imageUrl: "https://cdn11.bigcommerce.com/s-sp9oc95xrw/images/stencil/1280x1280/products/26796/85796/app1__97489.1721478880.png?c=2?imbypass=on", category: "Chargers" },
  { name: "Samsung 25W USB-C Super Fast Charger", description: "Super fast charger USB-C for Samsung Galaxy devices", price: 25, imageUrl: "https://distiplus.net/6104-large_default/ugreen-20w-usb-c-smart-fast-charger-for-phones-tablets-ipads-cd137-10191-60450.jpg", category: "Chargers" },
  { name: "Anker Nano II 45W GaN Charger", description: "Compact fast charger with GaN II technology", price: 39, imageUrl: "https://mrcell.net/cdn/shop/files/A2637226_2880x_9e310022-ada6-4196-93aa-c9e10906f190_500x.webp?v=1754989684", category: "Chargers" },
  { name: "Baseus 65W GaN Fast Charger", description: "3-port GaN fast charger for laptops and phones", price: 49, imageUrl: "https://distiplus.net/10218-large_default/ugreen-65w-gan-tech-chip-triple-port-charger-for-phones-tablets-ipads-laptops-macbooks-x553-35042.jpg", category: "Chargers" },
  { name: "Belkin 30W USB-C PPS Charger", description: "PD fast charger compatible with iPhone and Samsung", price: 29, imageUrl: "https://www.itos-lb.com/web/image/product.product/788/image_1024/%5BDLOT0005%5D%20DPC-352-E?unique=c5c7bfe", category: "Chargers" },

   { name: "Anker PowerCore 20,000mAh", description: "High-capacity fast charging power bank", price: 49, imageUrl: "https://rollingsquare.com/cdn/shop/files/Essentialswebsitecarousel-13_700x700_crop_top.webp?v=1742579555", category: "Power Banks" },
  { name: "Xiaomi 10,000mAh Power Bank 3", description: "Slim and lightweight 10,000mAh power bank", price: 25, imageUrl: "https://cdn.ishtari.com/files/media/cache/product/170000/164000/164296/101721607A_1000x1000_1-800x1091.jpg", category: "Power Banks" },
  { name: "Baseus 20,000mAh Quick Charge", description: "Supports Quick Charge 3.0 and PD fast charging", price: 35, imageUrl: "https://distiplus.net/10271-large_default/ugreen-power-bank-20w-pd-3-ports-10000-mah-smart-fast-charging-for-phones-tablets-ipads-pb311-25742.jpg", category: "Power Banks" },
  { name: "Samsung 25W 10,000mAh Power Bank", description: "Fast charging power bank for Samsung devices", price: 39, imageUrl: "https://distiplus.net/6316-large_default/ugreen-power-bank-30w-pd-dual-ports-10000-mah-smart-fast-charging-for-phones-tablets-ipads-pb502-25185.jpg", category: "Power Banks" },
  { name: "Belkin BoostCharge 20,000mAh", description: "USB-C fast charging portable battery", price: 59, imageUrl: "https://pcandparts.com/wp-content/uploads/belkin-bpb021hqbk-boostcharge-power-bank-10k-with-integrated-cable-200x200.jpg", category: "Power Banks" },

   { name: "Anker USB-C to USB-C Cable 60W", description: "Durable fast charging USB-C cable with 60W power delivery", price: 12, imageUrl: "https://clemarket.com/cdn/shop/files/Anker322USB-CtoUSB-CCable.jpg?v=1761913169&width=600", category: "Cables" },
  { name: "Apple USB-C to Lightning Cable (1m)", description: "Official Apple USB-C to Lightning cable for iPhone and iPad", price: 19, imageUrl: "https://clemarket.com/cdn/shop/files/AppleUSB-CtoLightningCable_2m.jpg?v=1754649848&width=600", category: "Cables" },
  { name: "Baseus Fast Charging USB-C Cable 100W", description: "100W PD fast charging cable suitable for laptops and phones", price: 15, imageUrl: "https://pcandparts.com/wp-content/uploads/unitek-usb-c-cable-c14091abk-200x200.jpg", category: "Cables" },
  { name: "UGREEN USB-C to USB-A Cable", description: "High-quality USB-C to USB-A cable for chargers and car adapters", price: 9, imageUrl: "https://pcandparts.com/wp-content/uploads/unitek-usb-type-c-printer-cable-0-200x200.jpg", category: "Cables" },
  { name: "Belkin BoostCharge Lightning Cable", description: "MFi certified durable Lightning cable", price: 17, imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQLa4V9vYlvaSSdjgVSK8Bz2sh0EsjTUU8JmP5C1x6y0n8JEqbBEvgn-clvp7KF06hfPfhNJNnjwFbrR5GM894wTrGjJ4sYs3qo_POBZM0FObVPxm8SOHrIU9CI5KnwJWRR-aiadJF0sA&usqp=CAc", category: "Cables" },

  { name: "JBL Charge 5", description: "Portable waterproof Bluetooth speaker with powerful sound", price: 129, imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQCURyIZSdwQ1MQ1faU0vFdAICo1vsW2El-Vq3RI-h2-dTqWcUqxGHP6vxsU2skwH0bJ-K2zrLHHDYoWtpqcJbNcYlal82_yGO8nuuBuJA_Rbzk9ZPKOu3N6mqGCp08DVlQUmCU2Rs&usqp=CAc", category: "Speakers" },
  { name: "Sony SRS-XB13", description: "Compact extra bass Bluetooth speaker", price: 49, imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT2YNZEdymLMDuxDkost3PqKiPmONUc7I5wgrWcwyg1QaL2BIGaK9Jh4NcvKgYEFiEqxWph2Mvp7QfAoiJowqBJNkFdSRoQMRtMHAtlQBjgSn9SntOA1QZBvDNCg5tNLkGNXlkSMRFd5Q&usqp=CAc", category: "Speakers" },
  { name: "Bose SoundLink Flex", description: "High-quality portable speaker with rich audio", price: 149, imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRI_MyfN3vY2THlAo_Ugy0NYiJG1uMSrkn5hhhvnmIN9rwomvomvyBoRFNFAgYb0UP8GLo0Jr7yMB3Z_YoHc9z2lXuBodPF5Rmabt8sOvG4FJCE05Kni8bKr5QnSN8k2nYcOgg9&usqp=CAc", category: "Speakers" },
  { name: "Anker Soundcore Motion+", description: "Hi-Res Bluetooth speaker with deep bass", price: 99, imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSSZH1BTSXRX82N0I2oOD4_8PRuIR8RgZubA4-sg__nUplavBejeyUD9bpxWAiMieWzby1xq4pX76KKFQ2GYcH3TbpQA17aeL9F4BETtg6yDs2Yj_IRj-rr4AKq_ysmw8SWblt3&usqp=CAc", category: "Speakers" },
  { name: "Marshall Emberton II", description: "Iconic design portable speaker with 30+ hours playtime", price: 169, imageUrl: "https://cdn.shopify.com/s/files/1/0552/0883/7292/products/Marshall-Emberton-II.jpg?v=1678291322", category: "Speakers" }
];

// ====== إضافة المنتجات للـ DB ======
Product.insertMany(products)
  .then(() => {
    console.log("20 Smartphones seeded successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
