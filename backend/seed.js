// backend/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const Product = require('../models/productModel.js');
const User = require('./models/userModel.js');
const bcrypt = require('bcryptjs');

dotenv.config();

const usersData = [
  { name: 'Admin User', email: 'admin@example.com', password: 'password123' },
  { name: 'John Doe', email: 'john@example.com', password: 'password123' },
];

const products = [
    { user: null, name: 'AuraSound Noise-Cancelling Headphones', image: 'https://m.media-amazon.com/images/I/61OkDvrLubL._UF894,1000_QL80_.jpg', description: 'Immerse yourself in music with these over-ear, noise-cancelling headphones.', price: 149.99, countInStock: 12, category: 'Electronics', badge: 'New!' },
    { user: null, name: 'SyncTime Smartwatch', image: 'https://th.bing.com/th/id/R.e397f788b2d3bfa17ba9a679e5dd10a7?rik=lsWJBHKWB6PrxA&pid=ImgRaw&r=0', description: 'Track your fitness, receive notifications, and stay connected with this sleek smartwatch.', price: 199.99, countInStock: 22, category: 'Electronics' },
    { user: null, name: 'QuantumBook Pro 14-inch Laptop', image: 'https://th.bing.com/th/id/R.f4a59aafd1160c9f380bab540bd420d5?rik=WVqzTsKTCj%2flmg&riu=http%3a%2f%2fwww.sagmart.com%2fuploads%2f2013%2f02%2f22%2fnews_image5%2fPro-Macbook-Apple.jpg&ehk=HHUYEadzUh1M4RMU116hKp7lY2DVi74iyt2xN2%2bf7I0%3d&risl=&pid=ImgRaw&r=0', description: 'Unleash your creativity with the new QuantumBook Pro. Featuring the latest M3 chip and a stunning Liquid Retina XDR display.', price: 1299.99, countInStock: 10, category: 'Electronics', badge: 'New!' },
    { user: null, name: 'GalaxyTab S9 Ultra', image: 'https://tse2.mm.bing.net/th/id/OIP.M4OnbS2qhajVMX2QcQRBHAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'The ultimate tablet for work and play. A massive, vibrant screen, powerful performance, and the versatile S Pen included.', price: 749.99, countInStock: 15, category: 'Electronics' },
    { user: null, name: 'X-Console Series X', image: 'https://www.nme.com/wp-content/uploads/2020/07/Xbox-Series-X.jpg', description: 'Experience the next generation of gaming with true 4K visuals, up to 120 FPS, and thousands of games.', price: 499.99, countInStock: 20, category: 'Electronics', badge: 'Best Seller' },
    { user: null, name: 'AeroView 4K Drone', image: 'https://www.aero-en.com/cdn/shop/files/photo4aeroplus.png?v=1727944764&width=1445', description: 'Capture breathtaking aerial footage in stunning 4K. Easy to fly with intelligent flight modes and a 30-minute flight time.', price: 399.99, countInStock: 18, category: 'Electronics' },
    { user: null, name: 'CinemaWave Soundbar 2.1', image: 'https://ss630.liverpool.com.mx/xl/1161126639.jpg', description: 'Upgrade your TV\'s audio with this powerful soundbar and wireless subwoofer. Feel every explosion and whisper.', price: 179.99, countInStock: 30, category: 'Electronics', badge: 'Sale' },
    { user: null, name: 'Wireless Mouse', image: 'https://resource.logitech.com/w_800,c_lpad,ar_1:1,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png?v=1', description: 'An ergonomic wireless mouse with a long-lasting battery for a clean workspace.', price: 19.99, countInStock: 15, category: 'Accessories', badge: 'Sale' },
    { user: null, name: 'Urban Voyager Backpack', image: 'https://shabacloset.com/cdn/shop/files/2Vzb97s0K0Sf3Ul8U_b17eb180-580e-429a-af4d-e939ea92f3f4.jpg?v=1723955828', description: 'A durable, water-resistant backpack with a padded laptop compartment for work or travel.', price: 59.99, countInStock: 40, category: 'Accessories' },
    { user: null, name: 'PowerCore Portable Charger', image: 'https://i5.walmartimages.com/seo/Anker-13000mAh-Portable-Charger-Dual-USB-Power-Bank-PowerCore-13000-PowerIQ-Charging-Black_0c352cfd-ee8d-42fa-acaf-8c4853b8897b.7815cd693bcfd18aec36bc96dc4ab773.jpeg', description: 'A compact, high-capacity 10000mAh portable charger to keep your devices powered on the go.', price: 29.99, countInStock: 60, category: 'Accessories' },
    { user: null, name: 'Ceramic Coffee Mug', image: 'https://bigsale-lb.com/cdn/shop/files/White_BrownCeramicMugs.jpg?v=1752658524', description: 'A sturdy and stylish ceramic mug, perfect for your morning coffee or tea.', price: 8.50, countInStock: 25, category: 'Home Goods' },
    // --- THIS PRODUCT IS CORRECTED ---
    { user: null, name: 'QuickBoil Electric Kettle', image: 'https://www.mtechleb.com/cdn/shop/files/LPRGKTBK_LePresso360TransparentQuick-BoilGlassKettle.jpg?v=1749812191', description: '1.7-liter stainless steel electric kettle that boils water in minutes.', price: 34.99, countInStock: 18, category: 'Home Goods', badge: 'Best Seller' },
    { user: null, name: 'Smart LED Light Strip', image: 'https://m.media-amazon.com/images/I/71z3S5a2YDL.jpg', description: 'Transform your room with vibrant, app-controlled RGB lighting. Syncs with music and works with voice assistants.', price: 25.99, countInStock: 50, category: 'Home Goods' }
];




    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');

    // Hash passwords before inserting users
    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPasswords = await Promise.all(usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
    }));
    
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    const adminUser = createdUsers.find(u => u.email === 'admin@example.com');
    
    if (!adminUser) {
        throw new Error('Admin user could not be found after creation.');
    }

    // Assign the admin user's ID to all products
   // Assign the admin user's ID to all products
const sampleProducts = products.map(product => {
  return { ...product, user: adminUser._id };
});

// Import data function
const importData = async () => {
  try {
    await Product.insertMany(sampleProducts);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error.message}`);
    process.exit(1);
  }
};

importData();



