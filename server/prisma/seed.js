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
    description: 'The latest iPhone 15 with A16 Bionic chip and Dynamic Island.',
    images: ['https://images.unsplash.com/photo-1695048132575-a7b3fc3f6e19?w=500'],
    specs: [['Display', '6.1" OLED'], ['Chip', 'A16 Bionic'], ['Camera', '48MP']],
  },
  {
    category: 'mobiles', name: 'Samsung Galaxy S24', brand: 'Samsung', price: 74999, mrp: 89999, stock: 40, rating: 4.5, reviewCount: 8321,
    description: 'Galaxy S24 with AI-powered features and Snapdragon 8 Gen 3.',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
    specs: [['Display', '6.2" Dynamic AMOLED'], ['Chip', 'Snapdragon 8 Gen 3'], ['Camera', '50MP']],
  },
  {
    category: 'mobiles', name: 'OnePlus 12', brand: 'OnePlus', price: 64999, mrp: 69999, stock: 35, rating: 4.4, reviewCount: 5670,
    description: 'OnePlus 12 with 4th Gen Hasselblad Camera and ultra-fast charging.',
    images: ['https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=500'],
    specs: [['Display', '6.8" 120Hz'], ['Chip', 'Snapdragon 8 Gen 3'], ['Battery', '5400 mAh']],
  },
  {
    category: 'mobiles', name: 'Google Pixel 8', brand: 'Google', price: 59999, mrp: 75999, stock: 20, rating: 4.5, reviewCount: 3240,
    description: 'The helpful phone from Google with a stunning camera and Tensor G3.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    specs: [['Display', '6.2" OLED'], ['Chip', 'Tensor G3'], ['Camera', '50MP']],
  },
  {
    category: 'mobiles', name: 'Redmi Note 13 Pro', brand: 'Xiaomi', price: 26999, mrp: 32999, stock: 80, rating: 4.3, reviewCount: 19830,
    description: 'Super-sharp 200MP camera and ultra-fast charging.',
    images: ['https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500'],
    specs: [['Camera', '200MP'], ['Display', '120Hz AMOLED'], ['Battery', '5000 mAh']],
  },
  {
    category: 'mobiles', name: 'Vivo V30 Pro', brand: 'Vivo', price: 44999, mrp: 49999, stock: 30, rating: 4.2, reviewCount: 2100,
    description: 'Professional portrait photography with ZEISS optics.',
    images: ['https://images.unsplash.com/photo-1598049882074-a4aaa4a4cbb7?w=500'],
    specs: [['Camera', 'ZEISS Optics'], ['Display', '3D Curved AMOLED'], ['Battery', '5000 mAh']],
  },
  {
    category: 'mobiles', name: 'realme 12 Pro+', brand: 'realme', price: 29999, mrp: 36999, stock: 45, rating: 4.1, reviewCount: 4560,
    description: 'Premium luxury watch design with periscope telephoto camera.',
    images: ['https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500'],
    specs: [['Camera', 'Periscope Telephoto'], ['Display', '120Hz AMOLED'], ['Charging', '67W']],
  },
  {
    category: 'mobiles', name: 'Samsung Galaxy A55', brand: 'Samsung', price: 39999, mrp: 45999, stock: 40, rating: 4.2, reviewCount: 2310,
    description: 'Galaxy A55 with flagship-grade security and waterproof build.',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
    specs: [['Display', '6.6" Super AMOLED'], ['Camera', '50MP OIS'], ['Build', 'Metal + Glass']],
  },
  {
    category: 'mobiles', name: 'Google Pixel 7a', brand: 'Google', price: 37999, mrp: 43999, stock: 25, rating: 4.3, reviewCount: 5410,
    description: 'The smart Pixel 7a with a fast 90Hz display and high-res camera.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    specs: [['Display', '6.1" 90Hz'], ['Chip', 'Tensor G2'], ['Camera', '64MP']],
  },

  // Laptops (8 total)
  {
    category: 'laptops', name: 'MacBook Air M2', brand: 'Apple', price: 99900, mrp: 114900, stock: 25, rating: 4.8, reviewCount: 7640,
    description: 'Thinner, lighter, and faster with the powerful M2 chip.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    specs: [['Chip', 'Apple M2'], ['Display', '13.6" Liquid Retina'], ['Battery', '18 hours']],
  },
  {
    category: 'laptops', name: 'Dell XPS 15', brand: 'Dell', price: 149990, mrp: 179990, stock: 15, rating: 4.6, reviewCount: 3210,
    description: 'Stunning 4K OLED display for creators and professionals.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    specs: [['CPU', 'Intel Core i7-13700H'], ['GPU', 'RTX 4060'], ['Display', '4K OLED']],
  },
  {
    category: 'laptops', name: 'HP Pavilion 15', brand: 'HP', price: 52990, mrp: 65990, stock: 40, rating: 4.2, reviewCount: 11230,
    description: 'Reliable HP Pavilion with AMD Ryzen 5 for daily productivity.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
    specs: [['CPU', 'Ryzen 5-7530U'], ['RAM', '16GB DDR4'], ['Storage', '512GB SSD']],
  },
  {
    category: 'laptops', name: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', price: 57990, mrp: 72990, stock: 30, rating: 4.3, reviewCount: 8900,
    description: 'Portable design with military-grade durability and OLED screen.',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
    specs: [['CPU', 'Intel i5-12450H'], ['Display', '14" 2.8K OLED'], ['Battery', 'Rapid Charge']],
  },
  {
    category: 'laptops', name: 'ASUS ROG Strix G15', brand: 'ASUS', price: 109990, mrp: 129990, stock: 18, rating: 4.5, reviewCount: 4130,
    description: 'Gaming beast with Ryzen 9 and RTX 4070 for elite gamers.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    specs: [['CPU', 'AMD Ryzen 9'], ['GPU', 'RTX 4070'], ['Display', '165Hz QHD']],
  },
  {
    category: 'laptops', name: 'Acer Aspire 7', brand: 'Acer', price: 47990, mrp: 59990, stock: 35, rating: 4.1, reviewCount: 5670,
    description: 'Affordable performance with dedicated graphics for casual gaming.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
    specs: [['CPU', 'Ryzen 5-5500U'], ['GPU', 'GTX 1650'], ['RAM', '8GB']],
  },
  {
    category: 'laptops', name: 'Apple MacBook Pro 14"', brand: 'Apple', price: 169900, mrp: 199900, stock: 12, rating: 4.9, reviewCount: 1240,
    description: 'Unmatched power with the M3 Pro chip for professionals.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    specs: [['Chip', 'M3 Pro'], ['Display', '120Hz ProMotion'], ['Battery', '22 hours']],
  },
  {
    category: 'laptops', name: 'Microsoft Surface 5', brand: 'Microsoft', price: 107990, mrp: 129999, stock: 10, rating: 4.4, reviewCount: 890,
    description: 'Ultra-portable touchscreen laptop for the modern workspace.',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500'],
    specs: [['CPU', 'Intel i7-12th Gen'], ['Display', '13.5" PixelSense'], ['Design', 'Alcantara Finish']],
  },

  // TVs (7 total)
  {
    category: 'tvs', name: 'LG OLED 55" C3', brand: 'LG', price: 129999, mrp: 164990, stock: 10, rating: 4.8, reviewCount: 2340,
    description: 'The world\'s #1 OLED TV with α9 AI Processor Gen6.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500'],
    specs: [['Panel', 'OLED Evo'], ['Resolution', '4K'], ['Smart', 'webOS 23']],
  },
  {
    category: 'tvs', name: 'Samsung 65" QLED', brand: 'Samsung', price: 109999, mrp: 149900, stock: 12, rating: 4.6, reviewCount: 1890,
    description: 'Quantun HDR and 100% Color Volume for cinematic viewing.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500'],
    specs: [['Panel', 'QLED'], ['Size', '65"'], ['Sound', 'Object Tracking Sound']],
  },
  {
    category: 'tvs', name: 'Sony Bravia 55" XR', brand: 'Sony', price: 159999, mrp: 194990, stock: 8, rating: 4.7, reviewCount: 980,
    description: 'World\'s first cognitive processor TV with deep blacks.',
    images: ['https://images.unsplash.com/photo-1461151304267-38231bb2c4c8?w=500'],
    specs: [['CPU', 'Cognitive XR'], ['Audio', 'Acoustic Surface'], ['Smart', 'Google TV']],
  },
  {
    category: 'tvs', name: 'Mi TV 43" 4K', brand: 'Xiaomi', price: 29999, mrp: 39999, stock: 50, rating: 4.2, reviewCount: 22340,
    description: 'Smart 4K viewing with the PatchWall UI.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500'],
    specs: [['Display', '4K UHD'], ['Audio', 'Dolby Audio'], ['Smart', 'PatchWall']],
  },
  {
    category: 'tvs', name: 'OnePlus 55" Y1S Pro', brand: 'OnePlus', price: 39999, mrp: 54999, stock: 22, rating: 4.3, reviewCount: 5670,
    description: 'Vibrant colors and OnePlus ecosystem integration.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500'],
    specs: [['Resolution', '4K'], ['Bezels', 'Bezel-less'], ['Audio', '24W Speaker']],
  },
  {
    category: 'tvs', name: 'TCL 55" 144Hz Gaming', brand: 'TCL', price: 54999, mrp: 79999, stock: 15, rating: 4.4, reviewCount: 1210,
    description: 'Pro gaming TV with 144Hz refresh and Game Master mode.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=500'],
    specs: [['Refresh', '144Hz VRR'], ['HDR', 'Dolby Vision IQ'], ['Audio', 'Onkyo 2.1 Ch']],
  },
  {
    category: 'tvs', name: 'VU 55" Armani Gold', brand: 'VU', price: 49999, mrp: 69999, stock: 10, rating: 4.3, reviewCount: 890,
    description: 'Premium metallic design with built-in subwoofers.',
    images: ['https://images.unsplash.com/photo-1571415060716-baff5f717c41?w=500'],
    specs: [['Design', 'Armani Gold Luxe'], ['Audio', '100W Subwoofer'], ['Panel', 'GloLED']],
  },

  // Fashion (6 total)
  {
    category: 'fashion', name: 'Allen Solly Shirt', brand: 'Allen Solly', price: 1299, mrp: 2499, stock: 200, rating: 4.3, reviewCount: 8730,
    description: 'Premium white slim fit formal shirt for the office.',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500'],
    specs: [['Material', 'Cotton'], ['Fit', 'Slim Fit']],
  },
  {
    category: 'fashion', name: 'Biba Ethnic Kurti', brand: 'Biba', price: 899, mrp: 1799, stock: 300, rating: 4.4, reviewCount: 14560,
    description: 'Beautiful ethnic wear for festivals and daily style.',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'],
    specs: [['Type', 'A-line'], ['Fabric', 'Rayon']],
  },
  {
    category: 'fashion', name: 'Nike Air Max Sneaker', brand: 'Nike', price: 12995, mrp: 14995, stock: 80, rating: 4.5, reviewCount: 6780,
    description: 'Comfort meets performance with the legendary Air Max series.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    specs: [['Style', 'Sneaker'], ['Cushion', 'Air Max Unit']],
  },
  {
    category: 'fashion', name: 'H&M Stretch Chinos', brand: 'H&M', price: 1499, mrp: 2999, stock: 150, rating: 4.1, reviewCount: 5430,
    description: 'Versatile stretch chinos for work and weekends.',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'],
    specs: [['Fit', 'Slim'], ['Waist', 'Mid Rise']],
  },
  {
    category: 'fashion', name: 'Fossil Gen 6 Smart', brand: 'Fossil', price: 19995, mrp: 26995, stock: 45, rating: 4.4, reviewCount: 3210,
    description: 'Stylish smartwatch with advanced health tracking.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    specs: [['OS', 'Wear OS'], ['Screen', 'AMOLED']],
  },
  {
    category: 'fashion', name: 'Levi\'s 511 Slim', brand: 'Levi\'s', price: 2999, mrp: 4599, stock: 120, rating: 4.5, reviewCount: 4320,
    description: 'Classic 511 slim fit denim in dark wash.',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    specs: [['Material', 'Cotton-Denim'], ['Fit', 'Slim']],
  },

  // Appliances (6 total)
  {
    category: 'appliances', name: 'Samsung 8kg Steam', brand: 'Samsung', price: 44990, mrp: 58990, stock: 20, rating: 4.5, reviewCount: 4320,
    description: 'Hygienic steam wash for allergen-free clothes.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    specs: [['Capacity', '8kg'], ['Type', 'Front Load']],
  },
  {
    category: 'appliances', name: 'Dyson V15 Laser', brand: 'Dyson', price: 54900, mrp: 64900, stock: 15, rating: 4.7, reviewCount: 1230,
    description: 'Laser dust detection for microscopic cleaning.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    specs: [['Mode', 'Laser Slim Fluffy'], ['Runtime', '60m']],
  },
  {
    category: 'appliances', name: 'LG 260L Inverter', brand: 'LG', price: 29990, mrp: 37990, stock: 18, rating: 4.4, reviewCount: 7800,
    description: 'Frost-free double door with uniform cooling.',
    images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500'],
    specs: [['Capacity', '260L'], ['Stars', '3 Star Energey']],
  },
  {
    category: 'appliances', name: 'Philips AC2887', brand: 'Philips', price: 14990, mrp: 19990, stock: 30, rating: 4.3, reviewCount: 2340,
    description: 'Clean air in minutes with Vitashield IPS.',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
    specs: [['Coverage', 'Up to 45m²'], ['Filter', 'HEPA']],
  },
  {
    category: 'appliances', name: 'Instant Pot 7-in-1', brand: 'Instant Pot', price: 8999, mrp: 12999, stock: 60, rating: 4.6, reviewCount: 11200,
    description: 'Electric pressure cooker that replaces 7 appliances.',
    images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500'],
    specs: [['Functions', '7-in-1'], ['Material', 'Steel']],
  },
  {
    category: 'appliances', name: 'Samsung Convection', brand: 'Samsung', price: 15490, mrp: 19990, stock: 25, rating: 4.4, reviewCount: 2100,
    description: 'Bake, grill, and cook evenly with slim fry tech.',
    images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500'],
    specs: [['Type', 'Convection'], ['Capacity', '21L']],
  },

  // Books (6 total)
  {
    category: 'books', name: 'Atomic Habits', brand: 'James Clear', price: 399, mrp: 699, stock: 500, rating: 4.9, reviewCount: 58000,
    description: 'Break bad habits and build life-changing results.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author', 'James Clear'], ['Format', 'Paperback']],
  },
  {
    category: 'books', name: 'System Design Vol 2', brand: 'Alex Xu', price: 1499, mrp: 1999, stock: 200, rating: 4.7, reviewCount: 9870,
    description: 'Master large scale system architecture for interviews.',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
    specs: [['Author', 'Alex Xu'], ['Pages', '434']],
  },
  {
    category: 'books', name: 'Clean Code', brand: 'Robert Martin', price: 549, mrp: 899, stock: 300, rating: 4.6, reviewCount: 15600,
    description: 'Handbook for writing clear and maintainable code.',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    specs: [['Author', 'Robert C. Martin'], ['Pages', '431']],
  },
  {
    category: 'books', name: 'Psychology of Money', brand: 'Morgan Housel', price: 349, mrp: 599, stock: 400, rating: 4.8, reviewCount: 32000,
    description: 'Timeless lessons on wealth and personal finance.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author', 'Morgan Housel'], ['Edition', 'Hardcover']],
  },
  {
    category: 'books', name: 'Deep Work', brand: 'Cal Newport', price: 429, mrp: 699, stock: 250, rating: 4.7, reviewCount: 21000,
    description: 'Focus in a distracted world to achieve peak productivity.',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
    specs: [['Author', 'Cal Newport'], ['Genre', 'Buisness/Self-Help']],
  },
  {
    category: 'books', name: 'The Alchemist', brand: 'Paulo Coelho', price: 299, mrp: 499, stock: 150, rating: 4.8, reviewCount: 45000,
    description: 'Follow your dreams with the story of Santiago.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specs: [['Author', 'Paulo Coelho'], ['Pages', '192']],
  },
];

async function main() {
  console.log('🧼 Cleaning database before seeding...');
  // Delete in order to satisfy relations
  await prisma.productImage.deleteMany({});
  await prisma.productSpec.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  console.log('✓ Database cleaned');

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'user@flipkart.com' },
    update: { name: 'Rupanshi' },
    create: { name: 'Rupanshi', email: 'user@flipkart.com', passwordHash, address: '12 MG Road, Bangalore, Karnataka 560001' },
  });
  console.log('✓ User Rupanshi verified');

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log('✓ Categories verified');

  console.log('🌱 Planting 42 unique products...');
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
  console.log(`\n✓ Seeded exactly ${products.length} products!`);
  console.log('Success! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
