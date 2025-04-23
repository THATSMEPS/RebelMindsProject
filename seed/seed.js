require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    // Create a restaurant
    const restaurant = new Restaurant({ name: 'Pizza Palace' });
    await restaurant.save();

    // Create menu items
    const menuItems = [
      {
        restaurant_id: restaurant._id,
        name: 'Margherita Pizza',
        price: 300,
        category: 'Pizza',
        is_available: true,
      },
      {
        restaurant_id: restaurant._id,
        name: 'Pepperoni Pizza',
        price: 400,
        category: 'Pizza',
        is_available: true,
      },
      {
        restaurant_id: restaurant._id,
        name: 'Garlic Bread',
        price: 150,
        category: 'Sides',
        is_available: true,
      },
      {
        restaurant_id: restaurant._id,
        name: 'Caesar Salad',
        price: 200,
        category: 'Salad',
        is_available: false,
      },
    ];

    const insertedMenuItems = await MenuItem.insertMany(menuItems);

    console.log('Seed data inserted successfully');
    console.log('Restaurant ID:', restaurant._id.toString());
    console.log('Menu Item IDs:');
    insertedMenuItems.forEach(item => {
      console.log(`${item.name}: ${item._id.toString()}`);
    });

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
