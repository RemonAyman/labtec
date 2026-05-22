import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"

dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Starting seed...")

  // Clean up database
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.usedLaptopRequest.deleteMany()
  await prisma.user.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()

  console.log("Cleaned up existing database tables.")

  // Seed Admin User
  const hashedPassword = await bcrypt.hash("admin123456", 10)
  const adminUser = await prisma.user.create({
    data: {
      name: "LabTec Admin",
      email: "admin@labtec.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  })

  console.log("Seeded Admin User:", adminUser.email)

  // Seed Brands
  const apple = await prisma.brand.create({ data: { name: "Apple" } })
  const asus = await prisma.brand.create({ data: { name: "ASUS" } })
  const dell = await prisma.brand.create({ data: { name: "Dell" } })
  const hp = await prisma.brand.create({ data: { name: "HP" } })
  const lenovo = await prisma.brand.create({ data: { name: "Lenovo" } })

  console.log("Seeded Brands:", [apple, asus, dell, hp, lenovo].map(b => b.name))

  // Seed Categories
  const ultrabook = await prisma.category.create({
    data: { name: "Ultrabooks", nameAr: "ألترابوك" }
  })
  const gaming = await prisma.category.create({
    data: { name: "Gaming Laptops", nameAr: "حواسيب الألعاب" }
  })
  const business = await prisma.category.create({
    data: { name: "Business Laptops", nameAr: "حواسيب الأعمال" }
  })
  const student = await prisma.category.create({
    data: { name: "Student Laptops", nameAr: "حواسيب للطلاب" }
  })

  console.log("Seeded Categories:", [ultrabook, gaming, business, student].map(c => c.name))

  // Seed Products
  const productsData = [
    {
      name: "MacBook Pro 16\" M3 Max",
      nameAr: "ماك بوك برو 16 بوصة M3 ماكس",
      description: "Apple M3 Max chip with 16‑core CPU and 40‑core GPU, 48GB unified memory, 1TB SSD storage. Liquid Retina XDR display, Space Black color. Absolute beast for creatives and professionals.",
      descAr: "شريحة Apple M3 Max مع معالج بـ 16 نواة ومعالج رسومي بـ 40 نواة، ذاكرة موحدة 48 جيجابايت، تخزين 1 تيرابايت SSD. شاشة Liquid Retina XDR، لون أسود فضائي. وحش حقيقي للمبدعين والمحترفين.",
      price: 3499.99,
      condition: "NEW",
      rating: 4.9,
      stock: 12,
      brandId: apple.id,
      categoryId: ultrabook.id,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "MacBook Air 13\" M3",
      nameAr: "ماك بوك إير 13 بوصة M3",
      description: "Supercharged by the Apple M3 chip. With up to 18 hours of battery life and a stunning Liquid Retina display, it's incredibly portable and fast.",
      descAr: "قوة مضاعفة بفضل شريحة Apple M3. مع بطارية تدوم حتى 18 ساعة وشاشة Liquid Retina مذهلة، خفيف الوزن وسريع بشكل لا يصدق.",
      price: 1099.99,
      condition: "NEW",
      rating: 4.7,
      stock: 25,
      brandId: apple.id,
      categoryId: ultrabook.id,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "ASUS ROG Strix SCAR 16",
      nameAr: "أسوس روج ستريكس سكار 16",
      description: "Intel Core i9-14900HX, NVIDIA GeForce RTX 4090 Laptop GPU, 32GB DDR5 RAM, 2TB PCIe SSD. Mini LED QHD+ 240Hz Nebula HDR display. Ultimate high-end gaming performance.",
      descAr: "معالج Intel Core i9-14900HX، كارت شاشة NVIDIA GeForce RTX 4090، رام 32 جيجابايت DDR5، تخزين 2 تيرابايت PCIe SSD. شاشة Mini LED QHD+ 240Hz Nebula HDR. أقصى أداء للألعاب عالية الفئة.",
      price: 2899.99,
      condition: "NEW",
      rating: 4.8,
      stock: 8,
      brandId: asus.id,
      categoryId: gaming.id,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "ASUS ROG Zephyrus G14",
      nameAr: "أسوس روج زيفيروس G14",
      description: "AMD Ryzen 9 8945HS, NVIDIA RTX 4070 GPU, 16GB LPDDR5X RAM, 1TB SSD. Beautiful 3K OLED 120Hz display. Lightweight, premium aluminum build.",
      descAr: "معالج AMD Ryzen 9 8945HS، كارت شاشة NVIDIA RTX 4070، رام 16 جيجابايت LPDDR5X، تخزين 1 تيرابايت SSD. شاشة OLED 3K 120Hz مذهلة. هيكل ألومنيوم فاخر وخفيف الوزن.",
      price: 1899.99,
      condition: "NEW",
      rating: 4.6,
      stock: 15,
      brandId: asus.id,
      categoryId: gaming.id,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "Dell XPS 13 9340",
      nameAr: "ديل إكس بي إس 13 9340",
      description: "Intel Core Ultra 7 155H, 16GB LPDDR5X RAM, 512GB SSD. 13.4\" FHD+ InfinityEdge display. Beautiful minimalist design, CNC aluminum build, seamless haptic touchpad.",
      descAr: "معالج Intel Core Ultra 7 155H، رام 16 جيجابايت LPDDR5X، تخزين 512 جيجابايت SSD. شاشة InfinityEdge 13.4 بوصة FHD+. تصميم مينيمايلست مذهل، هيكل ألومنيوم CNC، ولوحة لمس تفاعلية سلسة.",
      price: 1399.99,
      condition: "NEW",
      rating: 4.5,
      stock: 10,
      brandId: dell.id,
      categoryId: ultrabook.id,
      images: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "Dell Latitude 5440 (Refurbished)",
      nameAr: "ديل لاتيتيود 5440 (مستعمل مجدد)",
      description: "Intel Core i5-1245U, 16GB RAM, 256GB SSD, 14\" FHD display. Excellent enterprise machine in excellent condition with 6 months warranty. Grade A+ cosmetic look.",
      descAr: "معالج Intel Core i5-1245U، رام 16 جيجابايت، تخزين 256 جيجابايت SSD، شاشة 14 بوصة FHD. جهاز أعمال ممتاز في حالة ممتازة مع ضمان 6 أشهر. حالة تجميلية Grade A+.",
      price: 499.99,
      condition: "USED",
      rating: 4.2,
      stock: 6,
      brandId: dell.id,
      categoryId: business.id,
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "HP Spectre x360 2-in-1",
      nameAr: "إتش بي سبيكتر x360",
      description: "Intel Core Ultra 7 155H, 32GB RAM, 2TB SSD, NVIDIA RTX 4050 GPU. 14\" 2.8K OLED Touch Screen. Transforms into a tablet, premium digital pen included.",
      descAr: "معالج Intel Core Ultra 7 155H، رام 32 جيجابايت، تخزين 2 تيرابايت SSD، كارت شاشة NVIDIA RTX 4050. شاشة تعمل باللمس OLED 2.8K مقاس 14 بوصة. يتحول إلى تابلت، قلم رقمي فاخر مشمول.",
      price: 2199.99,
      condition: "NEW",
      rating: 4.8,
      stock: 7,
      brandId: hp.id,
      categoryId: ultrabook.id,
      images: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "Lenovo ThinkPad X1 Carbon Gen 12",
      nameAr: "لينوفو ثينك باد X1 كاربون الجيل 12",
      description: "Intel Core Ultra 7 165U vPro, 32GB LPDDR5X RAM, 1TB SSD. 14\" 2.8K OLED anti-glare display. The legendary business flagship laptop made of carbon fiber. Unmatched keyboard experience.",
      descAr: "معالج Intel Core Ultra 7 165U vPro، رام 32 جيجابايت LPDDR5X، تخزين 1 تيرابايت SSD. شاشة OLED مضادة للتوهج 14 بوصة 2.8K. اللابتوب الأسطوري الفاخر للأعمال المصنوع من ألياف الكربون. تجربة لوحة مفاتيح لا مثيل لها.",
      price: 2299.99,
      condition: "NEW",
      rating: 4.9,
      stock: 9,
      brandId: lenovo.id,
      categoryId: business.id,
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      name: "Lenovo IdeaPad Slim 3 (Used)",
      nameAr: "لينوفو آيديا باد سليم 3 (مستعمل)",
      description: "AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD, 15.6\" FHD screen. Perfect budget computer for university students. 2 years of light usage, clean keyboard and battery life up to 5 hours.",
      descAr: "معالج AMD Ryzen 5 5500U، رام 8 جيجابايت، تخزين 512 جيجابايت SSD، شاشة 15.6 بوصة FHD. حاسوب اقتصادي مثالي لطلاب الجامعة. سنتان من الاستخدام الخفيف، لوحة مفاتيح نظيفة وبطارية تدوم حتى 5 ساعات.",
      price: 349.99,
      condition: "USED",
      rating: 4.0,
      stock: 4,
      brandId: lenovo.id,
      categoryId: student.id,
      images: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"
      ]
    }
  ]

  for (const product of productsData) {
    const { images, ...pData } = product
    const createdProduct = await prisma.product.create({
      data: pData
    })

    // Seed product images
    for (const url of images) {
      await prisma.productImage.create({
        data: {
          url,
          productId: createdProduct.id
        }
      })
    }
  }

  console.log("Seeded Products successfully.")
  console.log("Database Seeding Finished!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
