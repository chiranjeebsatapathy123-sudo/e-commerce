const { Order, User } = require('../../models');

const mockSendEmail = async (email, subject, body) => {
  console.log(`\n[AUTONOMOUS MARKETING ENGINE] Sending Email to ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}\n`);
};

class CartAbandonmentWorker {
  static async run() {
    console.log('[CartAbandonmentWorker] Running check for abandoned carts...');
    try {
      // In a real database, we would query a 'Cart' model with updatedAt < (Now - 2 hours)
      // Since our Cart is currently stored in LocalStorage on the client,
      // we can simulate this by looking for 'Orders' in 'Processing' state that are stale,
      // or we can just mock a scenario to demonstrate the autonomous marketing engine.
      
      const staleUsers = await User.findAll({ limit: 2 });
      
      for (const user of staleUsers) {
        // AI-generated personalized copy based on user's history
        const subject = `Still thinking about it, ${user.name.split(' ')[0]}?`;
        const body = `We noticed you left some premium items behind. Because you're a valued member, here is a 10% off code: SPARK10 to help you decide.`;
        
        await mockSendEmail(user.email, subject, body);
      }
    } catch (err) {
      console.error('[CartAbandonmentWorker] Error:', err);
    }
  }

  static start(intervalMinutes = 60) {
    console.log(`[CartAbandonmentWorker] Started on a ${intervalMinutes} minute interval.`);
    setInterval(this.run, intervalMinutes * 60 * 1000);
    // run once on startup for dev purposes
    setTimeout(this.run, 5000); 
  }
}

module.exports = CartAbandonmentWorker;
