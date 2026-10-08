const GamificationService = require('../services/gamificationService');

exports.getUserStatus = async (req, res) => {
  try {
    const status = await GamificationService.getUserStatus(req.user.id);
    if (!status) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
