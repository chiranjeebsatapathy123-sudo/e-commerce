const sequelize = require('./config/db');
const { User, Product, Review, Order, OrderItem } = require('./models');

const seedData = async () => {
  try {
    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    console.log('Database synced. Seeding tables...');

    // 1. Seed Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Users seeded.');

    // 2. Seed Products
    const products = await Product.bulkCreate([
      {
        name: 'Acoustic Pro Wireless Headphones',
        price: 129.99,
        category: 'Electronics',
        stock: 15,
        description: 'Immerse yourself in premium sound. Featuring active hybrid noise-cancellation (ANC), 40-hour battery life, plush memory foam earcups, and high-fidelity 40mm dynamic drivers for crisp highs and deep, rich bass. Includes travel case and backup auxiliary cable.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500,https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
        rating: 4.8,
        reviewsCount: 2
      },
      {
        name: 'Chrono-Sport Smartwatch V2',
        price: 199.50,
        category: 'Electronics',
        stock: 20,
        description: 'Track your health, workouts, and sleep in real-time. Features an always-on AMOLED touchscreen display, built-in GPS, blood oxygen tracking, stress monitors, and up to 10 days of battery life. Swim-proof up to 50 meters with customized notification alerts.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500,https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500',
        rating: 4.5,
        reviewsCount: 1
      },
      {
        name: 'Aero-Strider Premium Sneakers',
        price: 89.99,
        category: 'Fashion',
        stock: 35,
        description: 'Step into lightweight comfort. Engineered with breathable knit mesh, dynamic arch support, responsive foam midsoles, and high-traction rubber outsoles. Designed for daily running, gym sessions, and streetwear appeal.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500,https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500',
        rating: 4.2,
        reviewsCount: 1
      },
      {
        name: 'Classic Vintage Leather Backpack',
        price: 110.00,
        category: 'Fashion',
        stock: 8,
        description: 'Handcrafted from full-grain vegetable-tanned leather. Features a padded laptop sleeve fitting up to 15-inch devices, brass magnetic buckles, adjustable padded shoulder straps, and quick-access side pockets. Gets more beautiful as it ages.',
        image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500',
        images: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500,https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500',
        rating: 4.7,
        reviewsCount: 1
      },
      {
        name: 'Ergonomic Mesh Office Chair',
        price: 249.99,
        category: 'Home',
        stock: 12,
        description: 'Reclaim physical wellness at work. Features adjustable 3D armrests, dynamic lumbar support, tilt-lock mechanics, and high-density mesh backrest for refreshing breathability. Sturdy five-star wheelbase supporting up to 300 lbs.',
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500',
        images: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500,https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500',
        rating: 4.6,
        reviewsCount: 1
      },
      {
        name: 'Modern Nordic Desk Lamp',
        price: 45.00,
        category: 'Home',
        stock: 5,
        description: 'Minimalist industrial lighting. Formed with a matte-coated steel hood, warm oak-wood arm support, and circular heavy metal base. Perfect for study tables, nightstands, and living room accent lighting. Includes warm LED bulb.',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
        images: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500,https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500',
        rating: 4.0,
        reviewsCount: 0
      }
    ]);

    console.log('Products seeded.');

    // 3. Seed Reviews
    await Review.create({
      rating: 5,
      comment: 'Absolutely love these! The bass is incredible and they cancel out train noise perfectly during my commute.',
      UserId: user.id,
      ProductId: products[0].id
    });

    await Review.create({
      rating: 4,
      comment: 'Very comfortable but the travel case is a bit bulky. Sound is crystal clear.',
      UserId: admin.id,
      ProductId: products[0].id
    });

    await Review.create({
      rating: 5,
      comment: 'Best fitness smartwatch I have owned. GPS is highly accurate.',
      UserId: user.id,
      ProductId: products[1].id
    });

    await Review.create({
      rating: 4,
      comment: 'Very nice shoes. A little tight at first but they stretch to fit comfortably.',
      UserId: user.id,
      ProductId: products[2].id
    });

    await Review.create({
      rating: 5,
      comment: 'Premium leather look, smells great and holds my 15-inch Macbook perfectly. Worth the price.',
      UserId: user.id,
      ProductId: products[3].id
    });

    await Review.create({
      rating: 5,
      comment: 'My lower back pain vanished after using this for a week. Excellent ergonomics.',
      UserId: user.id,
      ProductId: products[4].id
    });

    console.log('Reviews seeded.');

    // 4. Seed an Order (to populate analytics initially)
    const seedOrder = await Order.create({
      UserId: user.id,
      total: 329.49,
      name: 'John Doe',
      address: '123 Maple Street',
      city: 'Boston',
      postalCode: '02108',
      country: 'USA',
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      status: 'Processing'
    });

    await OrderItem.create({
      OrderId: seedOrder.id,
      ProductId: products[0].id,
      quantity: 1,
      price: 129.99
    });

    await OrderItem.create({
      OrderId: seedOrder.id,
      ProductId: products[1].id,
      quantity: 1,
      price: 199.50
    });

    console.log('Analytics orders seeded.');
    console.log('Database Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
