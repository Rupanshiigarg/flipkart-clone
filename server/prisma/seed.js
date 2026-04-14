const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, '..', envFile) });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
  { name: 'Laptops', slug: 'laptops', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200' },
  { name: 'Appliances', slug: 'appliances', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
  { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200' },
];

const products = [
  // Mobiles (9 total)
  {
    category: 'mobiles', name: 'Apple iPhone 15', brand: 'Apple', price: 69999, mrp: 79900, stock: 50, rating: 4.7, reviewCount: 12840,
    description: 'iPhone 15 with A16 Bionic chip and 48MP main camera.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/1f9e2406b39da2a8b3b1b2b07d72f3b54ce02fce.jpg'],
    specs: [['Display', '6.1" OLED'], ['Chip', 'A16 Bionic'], ['Camera', '48MP']],
  },
  {
    category: 'mobiles', name: 'Samsung Galaxy S24', brand: 'Samsung', price: 74999, mrp: 89999, stock: 40, rating: 4.5, reviewCount: 8321,
    description: 'Flagship features with Galaxy AI and Snapdragon 8 Gen 3.',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'],
    specs: [['Display', '6.2" Dynamic AMOLED'], ['Chip', 'Snapdragon 8 Gen 3']],
  },
  {
    category: 'mobiles', name: 'OnePlus 12', brand: 'OnePlus', price: 64999, mrp: 69999, stock: 35, rating: 4.4, reviewCount: 5670,
    description: 'OnePlus 12 with 4th Gen Hasselblad Camera.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512/pplx_search_images/f4656676e69fe20f44fe94b213bbe32e2dcc7e9f.jpg'],
    specs: [['Chip', 'Snapdragon 8 Gen 3'], ['RAM', '16GB'], ['Battery', '5400 mAh']],
  },
  {
    category: 'mobiles', name: 'Google Pixel 8', brand: 'Google', price: 59999, mrp: 75999, stock: 20, rating: 4.5, reviewCount: 3240,
    description: 'The helpful phone from Google with Tensor G3.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
    specs: [['Chip', 'Tensor G3'], ['Camera', '50MP'], ['Screen', '6.2" Actua Display']],
  },
  {
    category: 'mobiles', name: 'Redmi Note 13 Pro', brand: 'Xiaomi', price: 26999, mrp: 32999, stock: 80, rating: 4.3, reviewCount: 19830,
    description: '200MP camera and ultra-fast 67W charging.',
    images: ['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800'],
    specs: [['Camera', '200MP'], ['Display', '1.5K AMOLED'], ['Charging', '67W Turbo']],
  },
  {
    category: 'mobiles', name: 'Vivo V30 Pro', brand: 'Vivo', price: 44999, mrp: 49999, stock: 30, rating: 4.2, reviewCount: 2100,
    description: 'Pro portrait camera with ZEISS professional tuning.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/f9f73ec456fdf988a548bf281f9f88ae436b34c5.jpg'],
    specs: [['Camera', 'ZEISS'], ['Display', '1.5K Curved'], ['Battery', '5000 mAh']],
  },
  {
    category: 'mobiles', name: 'realme 12 Pro+', brand: 'realme', price: 29999, mrp: 36999, stock: 45, rating: 4.1, reviewCount: 4560,
    description: 'Luxury watch design with periscope telephoto lens.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/3dc5c5f4d9839303511f57d8811a8359e61a94bc.jpg'],
    specs: [['Camera', 'Periscope'], ['Design', 'Luxury Watch'], ['Charging', '67W']],
  },
  {
    category: 'mobiles', name: 'Samsung Galaxy A55', brand: 'Samsung', price: 39999, mrp: 45999, stock: 40, rating: 4.2, reviewCount: 2310,
    description: 'Galaxy A55 5G with premium glass finish.',
    images: ['https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/49d665fb-4b6f-5ff5-8a59-d932690eff74/48e00b57-df7d-52ea-a60c-59a07778ba6e.jpg'],
    specs: [['Display', '6.6" Super AMOLED'], ['Battery', '5000 mAh'], ['Rating', 'IP67']],
  },
  {
    category: 'mobiles', name: 'Google Pixel 7a', brand: 'Google', price: 37999, mrp: 43999, stock: 25, rating: 4.3, reviewCount: 5410,
    description: 'Smart Pixel 7a with AI features and 90Hz display.',
    images: ['https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6ef832a5bd6b28b995f628e5fe214bdf789d5c59ece8d595ef2b91959183e6f32ea5e80c2b3d9be08c6318bd22b08ffb9f'],
    specs: [['Chip', 'Tensor G2'], ['Display', '6.1" OLED'], ['Camera', '64MP']],
  },

  // Laptops (8 total)
  {
    category: 'laptops', name: 'MacBook Air M2', brand: 'Apple', price: 99900, mrp: 114900, stock: 25, rating: 4.8, reviewCount: 7640,
    description: 'Apple M2 chip with 13.6-inch Liquid Retina display.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    specs: [['Chip', 'Apple M2'], ['RAM', '8GB Unified'], ['Battery', '18 hours']],
  },
  {
    category: 'laptops', name: 'Dell XPS 15', brand: 'Dell', price: 149990, mrp: 179990, stock: 15, rating: 4.6, reviewCount: 3210,
    description: 'Stunning 4K OLED display for creators.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'],
    specs: [['CPU', 'Intel Core i7-13700H'], ['GPU', 'RTX 4060'], ['Display', '3.5K OLED']],
  },
  {
    category: 'laptops', name: 'HP Pavilion 15', brand: 'HP', price: 52990, mrp: 65990, stock: 40, rating: 4.2, reviewCount: 11230,
    description: 'Reliable HP Pavilion with Ryzen 5 processor.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'],
    specs: [['CPU', 'AMD Ryzen 5'], ['RAM', '16GB'], ['Storage', '512GB SSD']],
  },
  {
    category: 'laptops', name: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', price: 57990, mrp: 72990, stock: 30, rating: 4.3, reviewCount: 8900,
    description: 'Durable and portable design for modern professionals.',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
    specs: [['CPU', 'Intel i5-12450H'], ['Display', '14" 2.8K OLED'], ['Battery', 'Fast Charge']],
  },
  {
    category: 'laptops', name: 'ASUS ROG Strix G15', brand: 'ASUS', price: 109990, mrp: 129990, stock: 18, rating: 4.5, reviewCount: 4130,
    description: 'Elite gaming laptop with Ryzen 9 and RTX 4070.',
    images: ['https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800'],
    specs: [['CPU', 'Ryzen 9'], ['GPU', 'RTX 4070'], ['Panel', '165Hz QHD']],
  },
  {
    category: 'laptops', name: 'Acer Aspire 7', brand: 'Acer', price: 47990, mrp: 59990, stock: 35, rating: 4.1, reviewCount: 5670,
    description: 'Powerful graphics for casual gaming and work.',
    images: ['https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/54dc2d95-7a65-5946-a327-05ae3d26e302/aec8f940-3469-5597-816f-0dd903b3407c.jpg'],
    specs: [['GPU', 'GTX 1650'], ['CPU', 'Ryzen 5-5500U'], ['RAM', '8GB']],
  },
  {
    category: 'laptops', name: 'MacBook Pro 14"', brand: 'Apple', price: 169900, mrp: 199900, stock: 12, rating: 4.9, reviewCount: 1240,
    description: 'Pro performance with the M3 Pro chip.',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'],
    specs: [['Chip', 'M3 Pro'], ['Display', '120Hz ProMotion'], ['Battery', '22 hours']],
  },
  {
    category: 'laptops', name: 'Microsoft Surface 5', brand: 'Microsoft', price: 107990, mrp: 129999, stock: 10, rating: 4.4, reviewCount: 890,
    description: 'Sleek touchscreen laptop for on-the-go creative tasks.',
    images: ['https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/02ba160b-ac06-5834-97e2-fbcaf2afe72f/2b8a4684-2c75-5317-adb7-4c9eb518456d.jpg'],
    specs: [['CPU', 'Intel i7-12th Gen'], ['Screen', '13.5" PixelSense']],
  },

  // Fashion (6 total)
  {
    category: 'fashion', name: 'Allen Solly Shirt', brand: 'Allen Solly', price: 1299, mrp: 2499, stock: 200, rating: 4.3, reviewCount: 8730,
    description: 'White slim fit formal shirt in premium cotton.',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800'],
    specs: [['Material', 'Cotton'], ['Fit', 'Slim']],
  },
  {
    category: 'fashion', name: 'Biba Ethnic Kurti', brand: 'Biba', price: 899, mrp: 1799, stock: 300, rating: 4.4, reviewCount: 14560,
    description: 'Elegant A-line printed kurti.',
    images: ['https://assets.myntassets.com/w_360,q_50,,dpr_2,fl_progressive,f_webp/assets/images/23884052/2023/10/4/d67f6efb-ad84-498f-9149-87c6f386b5b71696416646233-Biba-Ethnic-Motifs-Printed-V-Neck-Kurta--Salwar-with-Dupatta-11.jpg'],
    specs: [['Type', 'Ethnic'], ['Fabric', 'Rayon']],
  },
  {
    category: 'fashion', name: 'Nike Air Max 270', brand: 'Nike', price: 12995, mrp: 14995, stock: 80, rating: 4.5, reviewCount: 6780,
    description: 'Legendary Air Max comfort and style.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    specs: [['Tech', 'Air Max Unit'], ['Style', 'Lifestyle Sneaker']],
  },
  {
    category: 'fashion', name: 'H&M Stretch Chinos', brand: 'H&M', price: 1499, mrp: 2999, stock: 150, rating: 4.1, reviewCount: 5430,
    description: 'Comfortable stretch chinos in classic navy.',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
    specs: [['Fit', 'Slim'], ['Color', 'Navy Blue']],
  },
  {
    category: 'fashion', name: 'Fossil Gen 6 Smart', brand: 'Fossil', price: 19995, mrp: 26995, stock: 45, rating: 4.4, reviewCount: 3210,
    description: 'Powerful Gen 6 with advanced wellness tracking.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    specs: [['OS', 'Wear OS'], ['Screen', 'AMOLED']],
  },
  {
    category: 'fashion', name: "Levi's 511 Slim", brand: "Levi's", price: 2999, mrp: 4599, stock: 120, rating: 4.5, reviewCount: 4320,
    description: 'Modern slim fit jeans in dark indigo.',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    specs: [['Fit', 'Slim'], ['Wash', 'Indigo']],
  },

  // Appliances (6 total)
  {
    category: 'appliances', name: 'Samsung 8kg Washer', brand: 'Samsung', price: 44990, mrp: 58990, stock: 20, rating: 4.5, reviewCount: 4320,
    description: 'Hygienic steam wash front load washing machine.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/d71ed0fcf9440afcc1ce9da5cbc5c83458f7efaf.jpg'],
    specs: [['Capacity', '8kg'], ['Type', 'Front Load']],
  },
  {
    category: 'appliances', name: 'Dyson V15 Detect', brand: 'Dyson', price: 54900, mrp: 64900, stock: 15, rating: 4.7, reviewCount: 1230,
    description: 'Advanced cordless cleaning with laser dust detection.',
    images: ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800'],
    specs: [['Runtime', '60 mins'], ['Type', 'Cordless']],
  },
  {
    category: 'appliances', name: 'LG 260L Fridge', brand: 'LG', price: 29990, mrp: 37990, stock: 18, rating: 4.4, reviewCount: 7800,
    description: 'Frost-free double door with smart inverter.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/e3a114cc727a88bca380819c95c98b0b505ba61d.jpg'],
    specs: [['Capacity', '260L'], ['Stars', '3 Star Inverter']],
  },
  {
    category: 'appliances', name: 'Philips Air Purifier', brand: 'Philips', price: 14990, mrp: 19990, stock: 30, rating: 4.3, reviewCount: 2340,
    description: 'Clean air for rooms up to 45m².',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/b1b9288179e4ad524c3384c6a6116daaefefb921.jpg'],
    specs: [['Coverage', '45 sq.m'], ['Filter', 'HEPA']],
  },
  {
    category: 'appliances', name: 'Instant Pot Duo', brand: 'Instant Pot', price: 8999, mrp: 12999, stock: 60, rating: 4.6, reviewCount: 11200,
    description: '7-in-1 multi-functional electric pressure cooker.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/a5b45792df3ef33928ea90db80524885d1d06224.jpg'],
    specs: [['Function', '7-in-1'], ['Capacity', '5.7L']],
  },
  {
    category: 'appliances', name: 'Samsung Microwave', brand: 'Samsung', price: 15490, mrp: 19990, stock: 25, rating: 4.4, reviewCount: 2100,
    description: 'Slim Fry convection microwave for healthy cooking.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/0920f6f723f4f88d6ebaf3a1910eac5f8c1d9243.jpg'],
    specs: [['Tech', 'Convection'], ['Capacity', '21L']],
  },

  // Books (6 total)
  {
    category: 'books', name: 'Atomic Habits', brand: 'James Clear', price: 399, mrp: 699, stock: 500, rating: 4.9, reviewCount: 58000,
    description: 'Proven strategy to build good habits and break bad ones.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/cefa018d5165df0dff4905436822f83ba0658779.jpg'],
    specs: [['Author', 'James Clear'], ['Format', 'Paperback']],
  },
  {
    category: 'books', name: 'System Design Interview', brand: 'Alex Xu', price: 1499, mrp: 1999, stock: 200, rating: 4.7, reviewCount: 9870,
    description: 'Insider\'s guide to large scale system architecture.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/d850204bbd0fe4be608ca9ef4360f6b72dbede2f.jpg'],
    specs: [['Author', 'Alex Xu'], ['Focus', 'Technical Interviews']],
  },
  {
    category: 'books', name: 'Clean Code', brand: 'Robert Martin', price: 549, mrp: 899, stock: 300, rating: 4.6, reviewCount: 15600,
    description: 'Handbook of Agile software craftsmanship.',
    images: ['https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/636348c3-2345-5a0d-a259-b37a57d1ce25/c9321318-ccc6-5c8d-bd29-85b102ece210.jpg'],
    specs: [['Author', 'Uncle Bob'], ['Topic', 'Clean Code']],
  },
  {
    category: 'books', name: 'Psychology of Money', brand: 'Morgan Housel', price: 349, mrp: 599, stock: 400, rating: 4.8, reviewCount: 32000,
    description: 'Lessons on wealth, greed, and happiness.',
    images: ['https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/38a260cf-9063-5906-a901-13eb745447b6/0ccdeee9-df27-5413-819c-485e380a2dfe.jpg'],
    specs: [['Author', 'Morgan Housel'], ['Category', 'Finance']],
  },
  {
    category: 'books', name: 'Deep Work', brand: 'Cal Newport', price: 429, mrp: 699, stock: 250, rating: 4.7, reviewCount: 21000,
    description: 'Focus in a distracted world to achieve peak productivity.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/2fd50e2222b80d07c1694eba1a2a084b0fdb831e.jpg'],
    specs: [['Author', 'Cal Newport'], ['Topic', 'Productivity']],
  },
  {
    category: 'books', name: 'The Alchemist', brand: 'Paulo Coelho', price: 299, mrp: 499, stock: 150, rating: 4.8, reviewCount: 45000,
    description: 'A beautiful story about following your personal legend.',
    images: ['https://pplx-res.cloudinary.com/image/upload/t_thumbnail_512_smart/pplx_search_images/11bd04fadf7933ebc66c14750b19069eaf6a1bb7.jpg'],
    specs: [['Author', 'Paulo Coelho'], ['Edition', 'Hardcover']],
  },
];

async function main() {
  console.log('🧼 Cleaning database...');
  await prisma.productImage.deleteMany({});
  await prisma.productSpec.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('✓ Cleared old data');

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'user@flipkart.com' },
    update: { name: 'Rupanshi Garg' },
    create: { name: 'Rupanshi Garg', email: 'user@flipkart.com', passwordHash, address: '12 MG Road, Bangalore, KA 560001' },
  });
  console.log('✓ Default user updated to: Rupanshi Garg');

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

  console.log('🌱 Planting 35 unique products...');
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
  console.log(`\n✓ ${products.length} products seeded SUCCESSFULLY!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
