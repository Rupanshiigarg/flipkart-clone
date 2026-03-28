const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
  { name: 'Laptops', slug: 'laptops', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
  { name: 'TVs', slug: 'tvs', imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=200' },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200' },
  { name: 'Appliances', slug: 'appliances', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
  { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200' },
];

const products = [
  // Mobiles
  {
    category: 'mobiles', name: 'Apple iPhone 15', brand: 'Apple', price: 69999, mrp: 79900, stock: 50, rating: 4.7, reviewCount: 12840,
    description: 'iPhone 15 features a 6.1-inch Super Retina XDR display, A16 Bionic chip, and an advanced dual-camera system.',
    images: ['https://images.unsplash.com/photo-1695048132575-a7b3fc3f6e19?w=500','https://images.unsplash.com/photo-1633053699284-67a0a77f8a5d?w=500','https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500'],
    specs: [['Display','6.1" Super Retina XDR'],['Chip','A16 Bionic'],['Camera','48MP Main'],['Battery','3349 mAh'],['Storage','128GB']],
  },
  {
    category: 'mobiles', name: 'Samsung Galaxy S24', brand: 'Samsung', price: 74999, mrp: 89999, stock: 40, rating: 4.5, reviewCount: 8321,
    description: 'Galaxy S24 with Galaxy AI, 50MP camera, and Snapdragon 8 Gen 3 processor.',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500','https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500','https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500'],
    specs: [['Display','6.2" Dynamic AMOLED'],['Chip','Snapdragon 8 Gen 3'],['Camera','50MP Triple'],['Battery','4000 mAh'],['Storage','256GB']],
  },
  {
    category: 'mobiles', name: 'OnePlus 12', brand: 'OnePlus', price: 64999, mrp: 69999, stock: 35, rating: 4.4, reviewCount: 5670,
    description: 'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera, and 100W SUPERVOOC charging.',
    images: ['https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=500','https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500','https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500'],
    specs: [['Display','6.82" LTPO AMOLED'],['Chip','Snapdragon 8 Gen 3'],['Camera','50MP Hasselblad'],['Battery','5400 mAh'],['Charging','100W SUPERVOOC']],
  },
  {
    category: 'mobiles', name: 'Google Pixel 8', brand: 'Google', price: 59999, mrp: 75999, stock: 20, rating: 4.5, reviewCount: 3240,
    description: 'Pixel 8 with Google Tensor G3 chip and the best Google AI features built in.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500','https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500','https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500'],
    specs: [['Display','6.2" OLED'],['Chip','Google Tensor G3'],['Camera','50MP Octa PD'],['Battery','4575 mAh'],['Storage','128GB']],
  },
  {
    category: 'mobiles', name: 'Redmi Note 13 Pro', brand: 'Xiaomi', price: 26999, mrp: 32999, stock: 80, rating: 4.3, reviewCount: 19830,
    description: 'Redmi Note 13 Pro with 200MP camera, 5G, and 67W fast charging.',
    images: ['https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500','https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=500','https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500'],
    specs: [['Display','6.67" AMOLED'],['Chip','Snapdragon 7s Gen 2'],['Camera','200MP Main'],['Battery','5100 mAh'],['Charging','67W Turbo']],
  },
  {
    category: 'mobiles', name: 'Vivo V30 Pro', brand: 'Vivo', price: 44999, mrp: 49999, stock: 30, rating: 4.2, reviewCount: 2100,
    description: 'Vivo V30 Pro with Aura Light portrait camera and slim design.',
    images: ['https://images.unsplash.com/photo-1598049882074-a4aaa4a4cbb7?w=500','https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500','https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500'],
    specs: [['Display','6.78" AMOLED'],['Chip','Snapdragon 8 Gen 2'],['Camera','50MP Aura Light'],['Battery','5000 mAh'],['Charging','80W FlashCharge']],
  },
  {
    category: 'mobiles', name: 'realme 12 Pro+', brand: 'realme', price: 29999, mrp: 36999, stock: 45, rating: 4.1, reviewCount: 4560,
    description: 'realme 12 Pro+ with periscope telephoto and 67W SUPERVOOC.',
    images: ['https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500','https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=500','https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500'],
    specs: [['Display','6.7" AMOLED'],['Chip','Snapdragon 7s Gen 2'],['Camera','50MP Periscope'],['Battery','5000 mAh'],['Charging','67W']],
  },

  // Laptops
  {
    category: 'laptops', name: 'Apple MacBook Air M2', brand: 'Apple', price: 99900, mrp: 114900, stock: 25, rating: 4.8, reviewCount: 7640,
    description: 'Supercharged by the M2 chip, MacBook Air is impossibly thin with up to 18 hours battery.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'],
    specs: [['Chip','Apple M2'],['RAM','8GB Unified'],['Storage','256GB SSD'],['Display','13.6" Liquid Retina'],['Battery','18 hours']],
  },
  {
    category: 'laptops', name: 'Dell XPS 15', brand: 'Dell', price: 149990, mrp: 179990, stock: 15, rating: 4.6, reviewCount: 3210,
    description: 'Dell XPS 15 with Intel Core i7, OLED display, and NVIDIA RTX 4060.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500'],
    specs: [['CPU','Intel Core i7-13700H'],['RAM','16GB DDR5'],['Storage','512GB NVMe SSD'],['Display','15.6" OLED 3.5K'],['GPU','NVIDIA RTX 4060']],
  },
  {
    category: 'laptops', name: 'HP Pavilion 15', brand: 'HP', price: 52990, mrp: 65990, stock: 40, rating: 4.2, reviewCount: 11230,
    description: 'HP Pavilion 15 with AMD Ryzen 5, sleek design, and FHD display for everyday tasks.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500'],
    specs: [['CPU','AMD Ryzen 5 7530U'],['RAM','8GB DDR4'],['Storage','512GB SSD'],['Display','15.6" FHD IPS'],['Battery','Up to 8 hrs']],
  },
  {
    category: 'laptops', name: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', price: 57990, mrp: 72990, stock: 30, rating: 4.3, reviewCount: 8900,
    description: 'Lenovo IdeaPad Slim 5 with Intel Core i5, backlit keyboard, and slim profile.',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500','https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
    specs: [['CPU','Intel Core i5-12500H'],['RAM','16GB LPDDR5'],['Storage','512GB SSD'],['Display','14" 2.8K OLED'],['Battery','Up to 12 hrs']],
  },
  {
    category: 'laptops', name: 'ASUS ROG Strix G15', brand: 'ASUS', price: 109990, mrp: 129990, stock: 18, rating: 4.5, reviewCount: 4130,
    description: 'ASUS ROG Strix G15 gaming laptop with Ryzen 9 and RTX 4070.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500','https://images.unsplash.com/photo-1587202372162-64cdb51ae05a?w=500','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'],
    specs: [['CPU','AMD Ryzen 9 7945HX'],['RAM','16GB DDR5'],['GPU','NVIDIA RTX 4070'],['Display','15.6" FHD 240Hz'],['Storage','1TB NVMe SSD']],
  },
  {
    category: 'laptops', name: 'Acer Aspire 7', brand: 'Acer', price: 47990, mrp: 59990, stock: 35, rating: 4.1, reviewCount: 5670,
    description: 'Acer Aspire 7 with GTX 1650 graphics and AMD Ryzen 5 for gaming and work.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500'],
    specs: [['CPU','AMD Ryzen 5 5500U'],['RAM','8GB DDR4'],['GPU','NVIDIA GTX 1650'],['Display','15.6" FHD IPS'],['Storage','512GB NVMe SSD']],
  },

  // TVs
  {
    category: 'tvs', name: 'LG OLED55C3PSA', brand: 'LG', price: 129999, mrp: 164990, stock: 10, rating: 4.8, reviewCount: 2340,
    description: 'LG C3 55" OLED TV with α9 AI Processor Gen6, Dolby Vision, and webOS 23.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500','https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500','https://images.unsplash.com/photo-1461151304267-38231bb2c4c8?w=500'],
    specs: [['Size','55 inch'],['Panel','OLED'],['Resolution','4K UHD'],['HDR','Dolby Vision IQ'],['Smart TV','webOS 23']],
  },
  {
    category: 'tvs', name: 'Samsung 65" QLED 4K', brand: 'Samsung', price: 109999, mrp: 149900, stock: 12, rating: 4.6, reviewCount: 1890,
    description: 'Samsung QLED 65" with Quantum HDR, 4K AI Upscaling, and Tizen OS.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500','https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500','https://images.unsplash.com/photo-1461151304267-38231bb2c4c8?w=500'],
    specs: [['Size','65 inch'],['Panel','QLED'],['Resolution','4K UHD'],['HDR','Quantum HDR 8x'],['Smart TV','Tizen OS']],
  },
  {
    category: 'tvs', name: 'Sony Bravia 55XR90', brand: 'Sony', price: 159999, mrp: 194990, stock: 8, rating: 4.7, reviewCount: 980,
    description: 'Sony XR90 with Cognitive Processor XR and Acoustic Surface Audio+.',
    images: ['https://images.unsplash.com/photo-1461151304267-38231bb2c4c8?w=500','https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500','https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500'],
    specs: [['Size','55 inch'],['Panel','OLED'],['Resolution','4K'],['Processor','Cognitive XR'],['Audio','Acoustic Surface Audio+']],
  },
  {
    category: 'tvs', name: 'Mi 43" 4K Android TV', brand: 'Xiaomi', price: 29999, mrp: 39999, stock: 50, rating: 4.2, reviewCount: 22340,
    description: 'Mi TV 4X 43 inch 4K Ultra HD Android TV with PatchWall UI.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500','https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500','https://images.unsplash.com/photo-1461151304267-38231bb2c4c8?w=500'],
    specs: [['Size','43 inch'],['Panel','VA'],['Resolution','4K UHD'],['Smart TV','Android TV + PatchWall'],['RAM','2.5GB']],
  },
  {
    category: 'tvs', name: 'OnePlus 55 Y1S Pro', brand: 'OnePlus', price: 39999, mrp: 54999, stock: 22, rating: 4.3, reviewCount: 5670,
    description: 'OnePlus Y1S Pro 55" 4K LED with Gamma Color Magic processor.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500','https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500','https://images.unsplash.com/photo-1461151304267-38231bb2c4c8?w=500'],
    specs: [['Size','55 inch'],['Panel','QLED'],['Resolution','4K'],['Smart TV','Android TV 11'],['Audio','30W Dolby Atmos']],
  },

  // Fashion
  {
    category: 'fashion', name: "Men's Formal Slim Fit Shirt", brand: 'Allen Solly', price: 1299, mrp: 2499, stock: 200, rating: 4.3, reviewCount: 8730,
    description: 'Premium cotton slim fit formal shirt, perfect for office and formal occasions.',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500','https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500'],
    specs: [['Material','100% Cotton'],['Fit','Slim Fit'],['Occasion','Formal'],['Wash','Machine Wash'],['Collar','Classic']],
  },
  {
    category: 'fashion', name: "Women's A-line Kurti", brand: 'Biba', price: 899, mrp: 1799, stock: 300, rating: 4.4, reviewCount: 14560,
    description: 'Elegant A-line printed kurti in soft rayon fabric, ideal for ethnic wear.',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500','https://images.unsplash.com/photo-1594938298603-c8148c4b984b?w=500','https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'],
    specs: [['Material','Rayon'],['Type','A-line'],['Occasion','Ethnic / Casual'],['Wash','Hand Wash'],['Style','Printed']],
  },
  {
    category: 'fashion', name: 'Nike Air Max 270', brand: 'Nike', price: 12995, mrp: 14995, stock: 80, rating: 4.5, reviewCount: 6780,
    description: 'Nike Air Max 270 with Max Air unit for all-day comfort and style.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500','https://images.unsplash.com/photo-1584735175315-9d5df23be4f9?w=500'],
    specs: [['Type','Lifestyle Sneaker'],['Upper','Engineered Mesh'],['Cushioning','Air Max 270'],['Closure','Lace-up'],['Sole','Rubber']],
  },
  {
    category: 'fashion', name: "Men's Slim Fit Chinos", brand: 'H&M', price: 1499, mrp: 2999, stock: 150, rating: 4.1, reviewCount: 5430,
    description: 'Slim fit chino trousers in stretch cotton for comfort and style.',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500','https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500','https://images.unsplash.com/photo-1604176424472-17cd740f0012?w=500'],
    specs: [['Material','98% Cotton 2% Elastane'],['Fit','Slim Fit'],['Type','Chinos'],['Closure','Button & Zip'],['Wash','Machine Wash']],
  },
  {
    category: 'fashion', name: 'Fossil Gen 6 Smartwatch', brand: 'Fossil', price: 19995, mrp: 26995, stock: 45, rating: 4.4, reviewCount: 3210,
    description: 'Fossil Gen 6 with Wear OS, Snapdragon 4100+, and 44mm display.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500','https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=500','https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500'],
    specs: [['Display','44mm AMOLED'],['OS','Wear OS by Google'],['Chip','Snapdragon 4100+'],['Battery','Up to 24hrs'],['Water Resistance','3 ATM']],
  },

  // Appliances
  {
    category: 'appliances', name: 'Samsung 8 kg Front Load Washer', brand: 'Samsung', price: 44990, mrp: 58990, stock: 20, rating: 4.5, reviewCount: 4320,
    description: 'Samsung 8 kg EcoBubble front-load washing machine with steam wash.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500','https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500','https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500'],
    specs: [['Capacity','8 kg'],['Type','Front Load'],['RPM','1400'],['Technology','EcoBubble'],['Energy','5 Star']],
  },
  {
    category: 'appliances', name: 'Dyson V15 Detect', brand: 'Dyson', price: 54900, mrp: 64900, stock: 15, rating: 4.7, reviewCount: 1230,
    description: 'Dyson V15 Detect with laser dust detection and HEPA filtration.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500','https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500','https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=500'],
    specs: [['Type','Cordless Vacuum'],['Suction','230 AW'],['Runtime','60 min'],['Filter','HEPA'],['Detection','Laser Slim Fluffy']],
  },
  {
    category: 'appliances', name: 'LG 260L Double Door Fridge', brand: 'LG', price: 29990, mrp: 37990, stock: 18, rating: 4.4, reviewCount: 7800,
    description: 'LG 260L frost-free double door refrigerator with smart inverter compressor.',
    images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'],
    specs: [['Capacity','260 L'],['Type','Double Door'],['Technology','Smart Inverter'],['Energy','3 Star'],['Color','Shiny Steel']],
  },
  {
    category: 'appliances', name: 'Philips Air Purifier AC2887', brand: 'Philips', price: 14990, mrp: 19990, stock: 30, rating: 4.3, reviewCount: 2340,
    description: 'Philips AC2887 with HEPA + activated carbon filter for clean air up to 45m².',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500','https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500'],
    specs: [['Coverage','45 m²'],['Filter','HEPA + Carbon'],['CADR','333 m³/hr'],['Modes','3 Speed'],['Display','AQI Display']],
  },
  {
    category: 'appliances', name: 'Instant Pot Duo 7-in-1', brand: 'Instant Pot', price: 8999, mrp: 12999, stock: 60, rating: 4.6, reviewCount: 11200,
    description: 'Instant Pot Duo 7-in-1 electric pressure cooker, steamer, slow cooker and more.',
    images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
    specs: [['Functions','7-in-1'],['Capacity','5.7 L'],['Programs','14 Smart'],['Material','Stainless Steel'],['Watts','1000W']],
  },

  // Books
  {
    category: 'books', name: 'Atomic Habits', brand: 'James Clear', price: 399, mrp: 699, stock: 500, rating: 4.9, reviewCount: 58000,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500','https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
    specs: [['Author','James Clear'],['Pages','320'],['Language','English'],['Publisher','Penguin'],['Edition','Paperback']],
  },
  {
    category: 'books', name: 'System Design Interview Vol. 2', brand: 'Alex Xu', price: 1499, mrp: 1999, stock: 200, rating: 4.7, reviewCount: 9870,
    description: 'An insider\'s guide to system design interviews by Alex Xu & Sahn Lam.',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500','https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500','https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author','Alex Xu & Sahn Lam'],['Pages','434'],['Language','English'],['Publisher','Independently Published'],['Edition','Paperback']],
  },
  {
    category: 'books', name: 'Clean Code', brand: 'Robert C. Martin', price: 549, mrp: 899, stock: 300, rating: 4.6, reviewCount: 15600,
    description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin (Uncle Bob).',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500','https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
    specs: [['Author','Robert C. Martin'],['Pages','431'],['Language','English'],['Publisher','Prentice Hall'],['Edition','Paperback']],
  },
  {
    category: 'books', name: 'The Psychology of Money', brand: 'Morgan Housel', price: 349, mrp: 599, stock: 400, rating: 4.8, reviewCount: 32000,
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500','https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    specs: [['Author','Morgan Housel'],['Pages','256'],['Language','English'],['Publisher','Harriman House'],['Edition','Paperback']],
  },
  {
    category: 'books', name: 'Deep Work', brand: 'Cal Newport', price: 429, mrp: 699, stock: 250, rating: 4.7, reviewCount: 21000,
    description: 'Rules for Focused Success in a Distracted World by Cal Newport.',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500','https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500','https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author','Cal Newport'],['Pages','296'],['Language','English'],['Publisher','Grand Central Publishing'],['Edition','Paperback']],
  },
];

async function main() {
  console.log('Seeding database...');

  // Create default user
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'user@flipkart.com' },
    update: {},
    create: { name: 'Rahul Sharma', email: 'user@flipkart.com', passwordHash, address: '12 MG Road, Bangalore, Karnataka 560001' },
  });
  console.log('✓ Default user created');

  // Create categories
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log('✓ Categories seeded');

  // Create products
  for (const p of products) {
    const { category, images, specs, ...productData } = p;
    const categoryId = categoryMap[category];

    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId,
        images: {
          create: images.map((url, i) => ({ url, sortOrder: i })),
        },
        specs: {
          create: specs.map(([specKey, specValue]) => ({ specKey, specValue })),
        },
      },
    });

    process.stdout.write('.');
  }

  console.log(`\n✓ ${products.length} products seeded`);
  console.log('\nDone! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
