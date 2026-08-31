import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import pool from './config/db';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('Seeding database...');
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Seed Categories
    const categories = [
      { name: 'Entrees', slug: 'entrees', description: 'Main dishes and entrees' },
      { name: 'Sides (8oz)', slug: 'sides', description: 'Side dishes and accompaniments' },
      { name: 'Specialties', slug: 'specialties', description: 'House specialties' },
      { name: 'Desserts & Drinks', slug: 'desserts-drinks', description: 'Desserts and beverages' }
    ];

    for (const cat of categories) {
      await connection.execute(
        'INSERT IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [cat.name, cat.slug, cat.description]
      );
    }
    console.log('Categories seeded');

    // Get category IDs
    const [catRows]: any = await connection.execute('SELECT id, slug FROM categories');
    const categoryMap: Record<string, number> = {};
    for (const row of catRows) {
      categoryMap[row.slug] = row.id;
    }

    // Seed Products
    const products = [
      // Entrees
      { name: 'Soul Fried Chicken', slug: 'soul-fried-chicken', description: '3pc (+$1 All White) (+$2.50 All Wings 4pc)', price: 16.00, category: 'entrees', featured: true },
      { name: 'Soul Baked Chicken', slug: 'soul-baked-chicken', description: 'Dinner W/ your choice of rice and 2 sides', price: 16.00, category: 'entrees', image: 'https://i.ibb.co/Cp4ZvDM6/baked-chicken-Dinner-W-your-choice-of-rice-and-2-sides.jpg' },
      { name: 'Red Snapper', slug: 'red-snapper', description: 'Southern or Creole style.', price: 32.00, category: 'entrees' },
      { name: 'Catfish Dinner', slug: 'catfish-dinner', description: 'With your choice of rice and 2 sides', price: 18.00, category: 'entrees', image: 'https://i.ibb.co/VWp5nBYC/Catfish-Dinner-your-choice-of-rice-and-2-sides.jpg', featured: true },
      { name: 'Wing Dinner', slug: 'wing-dinner', description: 'With 2 sides', price: 16.00, category: 'entrees', image: 'https://i.ibb.co/PzThQvkr/Wing-dinner-w-2-sides.jpg', featured: true },
      { name: 'Soul Smothered Turkey Wings', slug: 'soul-smothered-turkey-wings', description: 'Tender and flavorful', price: 16.00, category: 'entrees' },
      { name: 'Grilled Lamb Chops', slug: 'grilled-lamb-chops', description: 'With your choice of rice and 2 sides', price: 28.00, category: 'entrees', image: 'https://i.ibb.co/qMcg2Y9K/Grilled-Lamb-Chops-with-your-choice-of-rice-and-2-sides.jpg' },
      { name: 'Oxtail Pasta bowl', slug: 'oxtail-pasta-bowl', description: 'Rich and savory', price: 18.00, category: 'entrees' },
      { name: 'Haitian Griot (fried pork)', slug: 'haitian-griot', description: "Classic Haitian dish", price: 18.00, category: 'entrees' },
      { name: 'Haitian Oxtail (Ke bef)', slug: 'haitian-oxtail', description: 'Rich and savory oxtail stew', price: 28.00, category: 'entrees' },
      { name: 'Haitian Chicken stewed', slug: 'haitian-chicken-stewed', description: '( Poule nan sauce) 3pc (+$1 All White)', price: 16.00, category: 'entrees' },
      { name: 'Haitian Fried Turkey', slug: 'haitian-fried-turkey', description: '(Kodenn fri)', price: 16.00, category: 'entrees' },
      { name: 'Haitian Legume', slug: 'haitian-legume', description: 'Hearty vegetable stew', price: 18.00, category: 'entrees' },

      // Sides
      { name: 'White Rice', slug: 'white-rice', description: '(Diri blan)', price: 4.00, category: 'sides', image: 'https://i.ibb.co/JRh2jmT6/White-Rice.jpg' },
      { name: 'Black Rice', slug: 'black-rice', description: '(Diri a djon djon)', price: 5.00, category: 'sides', image: 'https://i.ibb.co/3m3Cn5SH/Creole-Black-rice.jpg', featured: true },
      { name: 'Rice & Peas', slug: 'rice-peas', description: '(Diri a pois)', price: 5.00, category: 'sides', image: 'https://i.ibb.co/3YpYPnnH/Creole-Red-beans-and-rice.jpg' },
      { name: 'Mac and Cheese', slug: 'mac-and-cheese', description: 'Creamy and cheesy', price: 6.50, category: 'sides', image: 'https://i.ibb.co/S7K6kt4m/Southern-Cheesy-Baked-Mac-n-Cheese.jpg', featured: true },
      { name: 'Collard Greens', slug: 'collard-greens', description: 'Slow-cooked classic', price: 5.00, category: 'sides', image: 'https://i.ibb.co/cSSg8hKM/Southern-Collard-Greens.jpg' },
      { name: 'Green Beans', slug: 'green-beans', description: 'Fresh and flavorful', price: 5.00, category: 'sides', image: 'https://i.ibb.co/xtyFpMMQ/Southern-Green-Beans.jpg' },
      { name: 'Yams', slug: 'yams', description: 'Sweet and tender', price: 5.00, category: 'sides', image: 'https://i.ibb.co/rRjhbdzv/Southern-Yams.jpg' },
      { name: 'Honey Blueberry Cornbread', slug: 'honey-blueberry-cornbread', description: 'Sweet and savory', price: 4.00, category: 'sides', image: 'https://i.ibb.co/qYwp9RJ3/Bongou-Honey-Blueberry-Cornbread.jpg' },
      { name: "Plantain 'Banane Peze'", slug: 'plantain-banane-peze', description: "6 pieces served with Pikliz", price: 4.00, category: 'sides' },
      { name: 'Side Salad', slug: 'side-salad', description: 'Salad russe', price: 4.00, category: 'sides' },
      { name: 'Fries', slug: 'fries', description: 'Crispy and golden', price: 4.00, category: 'sides' },

      // Specialties
      { name: 'Hamburgers (Grilled Beef)', slug: 'hamburgers-grilled-beef', description: 'Topped with Cheddar Cheese, Mayo, Ketchup, Lettuce Tomato, Pickles & Onions and served with a side of fries', price: 11.00, category: 'specialties', image: 'https://i.ibb.co/8nSYtjqh/Bongou-Grilled-beef-burger-and-Frys.jpg' },
      { name: 'Bongou Cheddar Burger', slug: 'bongou-cheddar-burger', description: 'Classic cheddar burger with fries', price: 11.00, category: 'specialties', image: 'https://i.ibb.co/6Rhj03K3/Bongou-Cheddar-Burger-n-Frys.jpg' },
      { name: 'Grilled Cheese', slug: 'grilled-cheese', description: 'With melted cheddar and served with a side of fries', price: 8.00, category: 'specialties', image: 'https://i.ibb.co/TMKfyTdY/Grilled-Cheese-n-Frys.jpg' },
      { name: 'Just Catfish', slug: 'just-catfish', description: 'Fried perfectly', price: 14.00, category: 'specialties', image: 'https://i.ibb.co/7dyZ4xY2/Just-Catfish.jpg' },
      { name: 'Just Wings', slug: 'just-wings', description: 'Delicious crispy wings', price: 12.00, category: 'specialties', image: 'https://i.ibb.co/NfwLHRc/Just-Wings.jpg' },
      { name: 'Wings and Fries', slug: 'wings-and-fries', description: 'Classic combo', price: 14.00, category: 'specialties', image: 'https://i.ibb.co/hFp48Hz2/Wings-and-fries.jpg', featured: true },
      { name: 'Chicken Tenders', slug: 'chicken-tenders', description: '3 Tenders served with fries and a side of dipping sauce', price: 10.00, category: 'specialties' },
      { name: 'Haitian Pattie', slug: 'haitian-pattie', description: "'Beef, Chicken, Fish' (w/ fries $6)", price: 4.00, category: 'specialties', featured: true },

      // Desserts & Drinks
      { name: 'Pound Cake', slug: 'pound-cake', description: "Moist and flavorful, our pound cake is made with love and a hint of vanilla", price: 8.00, category: 'desserts-drinks' },
      { name: 'Chocolate Cake', slug: 'chocolate-cake', description: "Rich and decadent, our chocolate cake is a chocolate lover's dream", price: 8.00, category: 'desserts-drinks' },
      { name: 'Sweet Potato Pie', slug: 'sweet-potato-pie', description: 'A Southern classic, our sweet potato pie is made with love and a hint of spice', price: 6.00, category: 'desserts-drinks' },
      { name: 'Fountain Drinks', slug: 'fountain-drinks', description: 'M 21oz ($2.95) / L 32oz ($3.25)', price: 2.95, category: 'desserts-drinks' },
      { name: 'Frozen Lemonade', slug: 'frozen-lemonade', description: 'M 21oz', price: 4.55, category: 'desserts-drinks' },
      { name: 'Haitian Soda / Bottled', slug: 'haitian-soda-bottled', description: 'Refreshing options', price: 3.30, category: 'desserts-drinks' }
    ];

    for (const prod of products) {
      await connection.execute(
        `INSERT IGNORE INTO products (name, slug, description, price, category_id, featured, status, stock_quantity) 
         VALUES (?, ?, ?, ?, ?, ?, 'published', 100)`,
        [prod.name, prod.slug, prod.description, prod.price, categoryMap[prod.category] || null, prod.featured || false]
      );
    }
    console.log('Products seeded');

    // Seed Home Page Content (CMS)
    const homePageContent = [
      {
        key: 'hero_title',
        type: 'text',
        value: 'Welcome to Bongou'
      },
      {
        key: 'hero_subtitle',
        type: 'text',
        value: 'Experience authentic soul food and Haitian cuisine'
      },
      {
        key: 'best_sellers_title',
        type: 'text',
        value: 'BEST SELLERS'
      },
      {
        key: 'best_sellers_description',
        type: 'text',
        value: 'Discover our most popular dishes, from Soul Fried Chicken to authentic Haitian specialties. A true taste of soul food combined with tradition.'
      },
      {
        key: 'popular_delights_title',
        type: 'text',
        value: 'POPULAR DELIGHTS'
      },
      {
        key: 'popular_delights_description',
        type: 'text',
        value: 'Experience the authentic taste of soul food with our selection of traditional dishes, crafted from fresh, high-quality ingredients. From savory Haitian specialties to indulgent desserts, every bite is a celebration of flavors.'
      },
      {
        key: 'testimonials_title',
        type: 'text',
        value: 'Testimonials'
      }
    ];

    for (const item of homePageContent) {
      await connection.execute(
        `INSERT IGNORE INTO home_page_content (section_key, content_type, content_value) 
         VALUES (?, ?, ?)`,
        [item.key, item.type, item.value]
      );
    }
    console.log('Home page content seeded');

    await connection.commit();
    console.log('Database seeding complete!');
  } catch (error) {
    await connection.rollback();
    console.error('Seeding error:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

seedDatabase().catch(console.error);
