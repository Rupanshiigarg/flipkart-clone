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
  // Mobiles (9 total)
  {
    category: 'mobiles', name: 'Apple iPhone 15', brand: 'Apple', price: 69999, mrp: 79900, stock: 50, rating: 4.7, reviewCount: 12840,
    description: 'iPhone 15 features a 6.1-inch Super Retina XDR display, A16 Bionic chip, and an advanced dual-camera system.',
    images: ['https://images.unsplash.com/photo-1695048132575-a7b3fc3f6e19?w=500', 'https://images.unsplash.com/photo-1633053699284-67a0a77f8a5d?w=500'],
    specs: [['Display', '6.1" Super Retina XDR'], ['Chip', 'A16 Bionic'], ['Camera', '48MP Main']],
  },
  {
    category: 'mobiles', name: 'Samsung Galaxy S24', brand: 'Samsung', price: 74999, mrp: 89999, stock: 40, rating: 4.5, reviewCount: 8321,
    description: 'Galaxy S24 with Galaxy AI, 50MP camera, and Snapdragon 8 Gen 3 processor.',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500'],
    specs: [['Display', '6.2" Dynamic AMOLED'], ['Chip', 'Snapdragon 8 Gen 3'], ['Camera', '50MP Triple']],
  },
  {
    category: 'mobiles', name: 'OnePlus 12', brand: 'OnePlus', price: 64999, mrp: 69999, stock: 35, rating: 4.4, reviewCount: 5670,
    description: 'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera, and 100W SUPERVOOC charging.',
    images: ['https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=500'],
    specs: [['Display', '6.82" LTPO AMOLED'], ['Chip', 'Snapdragon 8 Gen 3'], ['Charging', '100W SUPERVOOC']],
  },
  {
    category: 'mobiles', name: 'Google Pixel 8', brand: 'Google', price: 59999, mrp: 75999, stock: 20, rating: 4.5, reviewCount: 3240,
    description: 'Pixel 8 with Google Tensor G3 chip and the best Google AI features built in.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    specs: [['Display', '6.2" OLED'], ['Chip', 'Google Tensor G3'], ['Camera', '50MP Octa PD']],
  },
  {
    category: 'mobiles', name: 'Redmi Note 13 Pro', brand: 'Xiaomi', price: 26999, mrp: 32999, stock: 80, rating: 4.3, reviewCount: 19830,
    description: 'Redmi Note 13 Pro with 200MP camera, 5G, and 67W fast charging.',
    images: ['https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500'],
    specs: [['Display', '6.67" AMOLED'], ['Camera', '200MP Main'], ['Charging', '67W Turbo']],
  },
  {
    category: 'mobiles', name: 'Vivo V30 Pro', brand: 'Vivo', price: 44999, mrp: 49999, stock: 30, rating: 4.2, reviewCount: 2100,
    description: 'Vivo V30 Pro with Aura Light portrait camera and slim design.',
    images: ['https://images.unsplash.com/photo-1598049882074-a4aaa4a4cbb7?w=500'],
    specs: [['Display', '6.78" AMOLED'], ['Chip', 'Snapdragon 8 Gen 2'], ['Camera', '50MP Aura Light']],
  },
  {
    category: 'mobiles', name: 'realme 12 Pro+', brand: 'realme', price: 29999, mrp: 36999, stock: 45, rating: 4.1, reviewCount: 4560,
    description: 'realme 12 Pro+ with periscope telephoto and 67W SUPERVOOC.',
    images: ['https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500'],
    specs: [['Display', '6.7" AMOLED'], ['Camera', '50MP Periscope'], ['Charging', '67W']],
  },
  {
    category: 'mobiles', name: 'Samsung Galaxy A55', brand: 'Samsung', price: 39999, mrp: 45999, stock: 40, rating: 4.2, reviewCount: 2310,
    description: 'Samsung Galaxy A55 5G with premium glass finish and enhanced security.',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
    specs: [['Display', '6.6" Super AMOLED'], ['Camera', '50MP OIS'], ['Battery', '5000 mAh']],
  },
  {
    category: 'mobiles', name: 'Google Pixel 7a', brand: 'Google', price: 37999, mrp: 43999, stock: 25, rating: 4.3, reviewCount: 5410,
    description: 'Great Google AI, amazing camera, and sleek design in an affordable Pixel.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    specs: [['Display', '6.1" OLED'], ['Chip', 'Tensor G2'], ['Camera', '64MP']],
  },

  // Laptops (8 total)
  {
    category: 'laptops', name: 'Apple MacBook Air M2', brand: 'Apple', price: 99900, mrp: 114900, stock: 25, rating: 4.8, reviewCount: 7640,
    description: 'Supercharged by the M2 chip, MacBook Air is impossibly thin with up to 18 hours battery.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    specs: [['Chip', 'Apple M2'], ['RAM', '8GB Unified'], ['Storage', '256GB SSD']],
  },
  {
    category: 'laptops', name: 'Dell XPS 15', brand: 'Dell', price: 149990, mrp: 179990, stock: 15, rating: 4.6, reviewCount: 3210,
    description: 'Dell XPS 15 with Intel Core i7, OLED display, and NVIDIA RTX 4060.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    specs: [['CPU', 'Intel Core i7'], ['RAM', '16GB DDR5'], ['GPU', 'RTX 4060']],
  },
  {
    category: 'laptops', name: 'HP Pavilion 15', brand: 'HP', price: 52990, mrp: 65990, stock: 40, rating: 4.2, reviewCount: 11230,
    description: 'HP Pavilion 15 with AMD Ryzen 5, sleek design, and FHD display.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
    specs: [['CPU', 'AMD Ryzen 5'], ['RAM', '8GB DDR4'], ['Storage', '512GB SSD']],
  },
  {
    category: 'laptops', name: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', price: 57990, mrp: 72990, stock: 30, rating: 4.3, reviewCount: 8900,
    description: 'Lenovo IdeaPad Slim 5 with Intel Core i5 and slim profile.',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
    specs: [['CPU', 'Intel Core i5'], ['RAM', '16GB'], ['Storage', '512GB SSD']],
  },
  {
    category: 'laptops', name: 'ASUS ROG Strix G15', brand: 'ASUS', price: 109990, mrp: 129990, stock: 18, rating: 4.5, reviewCount: 4130,
    description: 'High performance gaming laptop with Ryzen 9 and RTX 4070.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    specs: [['CPU', 'AMD Ryzen 9'], ['GPU', 'RTX 4070'], ['Display', '15.6" 240Hz']],
  },
  {
    category: 'laptops', name: 'Acer Aspire 7', brand: 'Acer', price: 47990, mrp: 59990, stock: 35, rating: 4.1, reviewCount: 5670,
    description: 'Versatile laptop with Ryzen 5 for work and light gaming.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
    specs: [['CPU', 'AMD Ryzen 5'], ['RAM', '8GB'], ['GPU', 'GTX 1650']],
  },
  {
    category: 'laptops', name: 'Apple MacBook Pro 14"', brand: 'Apple', price: 169900, mrp: 199900, stock: 12, rating: 4.9, reviewCount: 1240,
    description: 'Supercharged by M3 Pro chip for extreme performance.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    specs: [['Chip', 'Apple M3 Pro'], ['RAM', '18GB'], ['Display', 'Liquid Retina XDR']],
  },
  {
    category: 'laptops', name: 'Microsoft Surface Laptop 5', brand: 'Microsoft', price: 107990, mrp: 129999, stock: 10, rating: 4.4, reviewCount: 890,
    description: 'Sleek, touchscreen laptop with premium build and Intel i7.',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500'],
    specs: [['CPU', 'Intel Core i7-12th Gen'], ['Screen', '13.5" PixelSense'], ['RAM', '16GB']],
  },

  // TVs (7 total)
  {
    category: 'tvs', name: 'LG OLED55C3PSA', brand: 'LG', price: 129999, mrp: 164990, stock: 10, rating: 4.8, reviewCount: 2340,
    description: 'LG C3 55" OLED TV with α9 AI Processor Gen6.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500'],
    specs: [['Size', '55 inch'], ['Panel', 'OLED'], ['Resolution', '4K UHD']],
  },
  {
    category: 'tvs', name: 'Samsung 65" QLED 4K', brand: 'Samsung', price: 109999, mrp: 149900, stock: 12, rating: 4.6, reviewCount: 1890,
    description: 'Samsung QLED 65" with Quantum HDR.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500'],
    specs: [['Size', '65 inch'], ['Panel', 'QLED'], ['Resolution', '4K UHD']],
  },
  {
    category: 'tvs', name: 'Sony Bravia 55XR90', brand: 'Sony', price: 159999, mrp: 194990, stock: 8, rating: 4.7, reviewCount: 980,
    description: 'Sony XR90 with Cognitive Processor XR.',
    images: ['https://images.unsplash.com/photo-1461151304267-38231bb2c4c8?w=500'],
    specs: [['Size', '55 inch'], ['Panel', 'OLED'], ['Processor', 'Cognitive XR']],
  },
  {
    category: 'tvs', name: 'Mi 43" 4K Android TV', brand: 'Xiaomi', price: 29999, mrp: 39999, stock: 50, rating: 4.2, reviewCount: 22340,
    description: 'Mi TV 4X 43 inch 4K Ultra HD Android TV.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500'],
    specs: [['Size', '43 inch'], ['Resolution', '4K UHD'], ['Smart TV', 'Android TV']],
  },
  {
    category: 'tvs', name: 'OnePlus 55 Y1S Pro', brand: 'OnePlus', price: 39999, mrp: 54999, stock: 22, rating: 4.3, reviewCount: 5670,
    description: 'OnePlus Y1S Pro 55" 4K LED.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500'],
    specs: [['Size', '55 inch'], ['Panel', 'LED'], ['Smart TV', 'Android TV 11']],
  },
  {
    category: 'tvs', name: 'TCL 55" Mini-LED', brand: 'TCL', price: 54999, mrp: 79999, stock: 15, rating: 4.4, reviewCount: 1210,
    description: 'Next Gen Mini-LED Display with 144Hz Refresh rate.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500'],
    specs: [['Size', '55 inch'], ['Tech', 'Mini-LED'], ['Refresh', '144Hz']],
  },
  {
    category: 'tvs', name: 'VU 55" Masterpiece', brand: 'VU', price: 49999, mrp: 69999, stock: 10, rating: 4.3, reviewCount: 890,
    description: 'Luxury design with Armani Gold metallic finish.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500'],
    specs: [['Size', '55 inch'], ['Panel', 'GloLED'], ['Design', 'Metallic']],
  },

  // Fashion (6 total)
  {
    category: 'fashion', name: "Men's Formal Slim Fit Shirt", brand: 'Allen Solly', price: 1299, mrp: 2499, stock: 200, rating: 4.3, reviewCount: 8730,
    description: 'Premium cotton slim fit formal shirt.',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500'],
    specs: [['Material', '100% Cotton'], ['Fit', 'Slim Fit']],
  },
  {
    category: 'fashion', name: "Women's A-line Kurti", brand: 'Biba', price: 899, mrp: 1799, stock: 300, rating: 4.4, reviewCount: 14560,
    description: 'Elegant A-line printed kurti in soft rayon fabric.',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'],
    specs: [['Material', 'Rayon'], ['Occasion', 'Ethnic']],
  },
  {
    category: 'fashion', name: 'Nike Air Max 270', brand: 'Nike', price: 12995, mrp: 14995, stock: 80, rating: 4.5, reviewCount: 6780,
    description: 'Nike Air Max 270 for all-day comfort.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    specs: [['Type', 'Sneaker'], ['Cushioning', 'Air Max']],
  },
  {
    category: 'fashion', name: "Men's Slim Fit Chinos", brand: 'H&M', price: 1499, mrp: 2999, stock: 150, rating: 4.1, reviewCount: 5430,
    description: 'Slim fit chino trousers in stretch cotton.',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'],
    specs: [['Material', '98% Cotton'], ['Fit', 'Slim']],
  },
  {
    category: 'fashion', name: 'Fossil Gen 6 Smartwatch', brand: 'Fossil', price: 19995, mrp: 26995, stock: 45, rating: 4.4, reviewCount: 3210,
    description: 'Fossil Gen 6 with Wear OS.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    specs: [['Display', 'AMOLED'], ['OS', 'Wear OS']],
  },
  {
    category: 'fashion', name: "Levi's 511 Slim Jeans", brand: "Levi's", price: 2999, mrp: 4599, stock: 120, rating: 4.5, reviewCount: 4320,
    description: "Classic 511 Slim fit denim for a modern look.",
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    specs: [['Fit', 'Slim'], ['Material', 'Denim']],
  },

  // Appliances (6 total)
  {
    category: 'appliances', name: 'Samsung 8 kg Washing Machine', brand: 'Samsung', price: 44990, mrp: 58990, stock: 20, rating: 4.5, reviewCount: 4320,
    description: 'Samsung EcoBubble front-load washing machine.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    specs: [['Capacity', '8 kg'], ['Energy', '5 Star']],
  },
  {
    category: 'appliances', name: 'Dyson V15 Detect', brand: 'Dyson', price: 54900, mrp: 64900, stock: 15, rating: 4.7, reviewCount: 1230,
    description: 'Dyson V15 Detect with laser dust detection.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    specs: [['Type', 'Cordless'], ['Suction', '230 AW']],
  },
  {
    category: 'appliances', name: 'LG 260L Double Door Fridge', brand: 'LG', price: 29990, mrp: 37990, stock: 18, rating: 4.4, reviewCount: 7800,
    description: 'LG frost-free double door refrigerator.',
    images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500'],
    specs: [['Capacity', '260 L'], ['Type', 'Double Door']],
  },
  {
    category: 'appliances', name: 'Philips Air Purifier', brand: 'Philips', price: 14990, mrp: 19990, stock: 30, rating: 4.3, reviewCount: 2340,
    description: 'Philips air purifier with HEPA filter.',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
    specs: [['Coverage', '45 m²'], ['Filter', 'HEPA']],
  },
  {
    category: 'appliances', name: 'Instant Pot Duo 7-in-1', brand: 'Instant Pot', price: 8999, mrp: 12999, stock: 60, rating: 4.6, reviewCount: 11200,
    description: 'Instant Pot multi-functional pressure cooker.',
    images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500'],
    specs: [['Functions', '7-in-1'], ['Capacity', '5.7 L']],
  },
  {
    category: 'appliances', name: 'Samsung Microwave', brand: 'Samsung', price: 15490, mrp: 19990, stock: 25, rating: 4.4, reviewCount: 2100,
    description: 'Premium convection microwave for even cooking.',
    images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500'],
    specs: [['Type', 'Convection'], ['Capacity', '21 L'], ['Color', 'Black']],
  },

  // Books (6 total)
  {
    category: 'books', name: 'Atomic Habits', brand: 'James Clear', price: 399, mrp: 699, stock: 500, rating: 4.9, reviewCount: 58000,
    description: 'Build Good Habits & Break Bad Ones.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author', 'James Clear'], ['Pages', '320']],
  },
  {
    category: 'books', name: 'System Design Interview', brand: 'Alex Xu', price: 1499, mrp: 1999, stock: 200, rating: 4.7, reviewCount: 9870,
    description: 'Insider\'s guide to system design interviews.',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
    specs: [['Author', 'Alex Xu'], ['Pages', '434']],
  },
  {
    category: 'books', name: 'Clean Code', brand: 'Robert C. Martin', price: 549, mrp: 899, stock: 300, rating: 4.6, reviewCount: 15600,
    description: 'A Handbook of Agile Software Craftsmanship.',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    specs: [['Author', 'Robert C. Martin'], ['Pages', '431']],
  },
  {
    category: 'books', name: 'The Psychology of Money', brand: 'Morgan Housel', price: 349, mrp: 599, stock: 400, rating: 4.8, reviewCount: 32000,
    description: 'Lessons on wealth, greed, and happiness.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author', 'Morgan Housel'], ['Pages', '256']],
  },
  {
    category: 'books', name: 'Deep Work', brand: 'Cal Newport', price: 429, mrp: 699, stock: 250, rating: 4.7, reviewCount: 21000,
    description: 'Focused Success in a Distracted World.',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
    specs: [['Author', 'Cal Newport'], ['Pages', '296']],
  },
  {
    category: 'books', name: 'The Alchemist', brand: 'Paulo Coelho', price: 299, mrp: 499, stock: 150, rating: 4.8, reviewCount: 45000,
    description: 'A beautiful fable about following your dreams.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author', 'Paulo Coelho'], ['Edition', '25th Anniversary']],
  },
];

async function main() {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'user@flipkart.com' },
    update: { name: 'Rupanshi' },
    create: { name: 'Rupanshi', email: 'user@flipkart.com', passwordHash, address: '12 MG Road, Bangalore, Karnataka 560001' },
  });
  console.log('✓ Default user updated to: Rupanshi');

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

  for (const p of products) {
    const { category, images, specs, ...productData } = p;
    const categoryId = categoryMap[category];
    await prisma.product.create({
      data: {
        ...productData,
        categoryId,
        images: { create: images.map((url, i) => ({ url, sortOrder: i })) },
        specs: { create: specs.map(([specKey, specValue]) => ({ specKey, specValue })) },
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
