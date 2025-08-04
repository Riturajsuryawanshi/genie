const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Conversation = require('../models/Conversation');

class UserService {
  // Create new user with profile
  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();

      // Create associated profile
      const profile = new UserProfile({
        userId: user._id,
        preferences: {
          voiceModel: 'alloy',
          aiModel: 'gpt-4-turbo-preview',
          responseLength: 'medium'
        }
      });
      await profile.save();

      return { user, profile };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Get user by phone number
  async getUserByPhone(phoneNumber) {
    try {
      const profile = await UserProfile.findOne({ assignedPhoneNumber: phoneNumber })
        .populate('userId');
      
      if (!profile) {
        return null;
      }

      return {
        user: profile.userId,
        profile
      };
    } catch (error) {
      throw new Error(`Failed to get user by phone: ${error.message}`);
    }
  }

  // Assign phone number to user
  async assignPhoneNumber(userId, phoneNumber) {
    try {
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { assignedPhoneNumber: phoneNumber },
        { new: true }
      );

      if (!profile) {
        throw new Error('User profile not found');
      }

      return profile;
    } catch (error) {
      throw new Error(`Failed to assign phone number: ${error.message}`);
    }
  }

  // Save conversation
  async saveConversation(conversationData) {
    try {
      const conversation = new Conversation(conversationData);
      await conversation.save();

      // Update user usage stats
      await this.updateUsageStats(conversationData.userId, conversationData.duration);

      return conversation;
    } catch (error) {
      throw new Error(`Failed to save conversation: ${error.message}`);
    }
  }

  // Get conversation history
  async getConversationHistory(userId, limit = 10) {
    try {
      const conversations = await Conversation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('userMessage aiResponse createdAt duration status');

      return conversations;
    } catch (error) {
      throw new Error(`Failed to get conversation history: ${error.message}`);
    }
  }

  // Update usage statistics
  async updateUsageStats(userId, duration = 0) {
    try {
      const profile = await UserProfile.findOne({ userId });
      if (!profile) return;

      const now = new Date();
      const lastReset = new Date(profile.usage.lastResetDate);
      const isNewMonth = now.getMonth() !== lastReset.getMonth() || 
                        now.getFullYear() !== lastReset.getFullYear();

      const updateData = {
        'usage.totalCalls': profile.usage.totalCalls + 1,
        'usage.totalMinutes': profile.usage.totalMinutes + (duration / 60)
      };

      if (isNewMonth) {
        updateData['usage.monthlyCallsUsed'] = 1;
        updateData['usage.monthlyMinutesUsed'] = duration / 60;
        updateData['usage.lastResetDate'] = now;
      } else {
        updateData['usage.monthlyCallsUsed'] = profile.usage.monthlyCallsUsed + 1;
        updateData['usage.monthlyMinutesUsed'] = profile.usage.monthlyMinutesUsed + (duration / 60);
      }

      await UserProfile.findOneAndUpdate({ userId }, updateData);
    } catch (error) {
      console.error('Failed to update usage stats:', error);
    }
  }

  // Get user preferences
  async getUserPreferences(userId) {
    try {
      const profile = await UserProfile.findOne({ userId });
      return profile ? profile.preferences : null;
    } catch (error) {
      throw new Error(`Failed to get user preferences: ${error.message}`);
    }
  }

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { preferences },
        { new: true }
      );

      return profile;
    } catch (error) {
      throw new Error(`Failed to update preferences: ${error.message}`);
    }
  }

  // Check usage limits
  async checkUsageLimits(userId) {
    try {
      const profile = await UserProfile.findOne({ userId });
      if (!profile) return { allowed: false, reason: 'Profile not found' };

      const limits = {
        free: { calls: 10, minutes: 30 },
        basic: { calls: 100, minutes: 300 },
        premium: { calls: 1000, minutes: 3000 },
        enterprise: { calls: -1, minutes: -1 } // unlimited
      };

      const userLimits = limits[profile.subscription.plan];
      const usage = profile.usage;

      if (userLimits.calls !== -1 && usage.monthlyCallsUsed >= userLimits.calls) {
        return { allowed: false, reason: 'Monthly call limit exceeded' };
      }

      if (userLimits.minutes !== -1 && usage.monthlyMinutesUsed >= userLimits.minutes) {
        return { allowed: false, reason: 'Monthly minute limit exceeded' };
      }

      return { allowed: true };
    } catch (error) {
      throw new Error(`Failed to check usage limits: ${error.message}`);
    }
  }
}

module.exports = new UserService();