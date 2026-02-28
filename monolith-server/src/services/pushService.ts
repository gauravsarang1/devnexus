
import webpush from 'web-push';
import prisma from '../config/prisma.js';

// VAPID keys should be generated once and stored in .env
// You can generate them using: npx web-push generate-vapid-keys
const publicVapidKey = process.env.PUBLIC_VAPID_KEY || '';
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || '';

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:support@DevNexus.com',
    publicVapidKey,
    privateVapidKey
  );
}

export class PushService {
  /**
   * Send a push notification to a specific user
   */
  static async sendNotification(userId: string, payload: { title: string; message: string; link: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { pushSubscription: true }
      });

      if (!user?.pushSubscription) {
        return { success: false, error: 'User has no push subscription' };
      }

      // pushSubscription is stored as a JSON string in DB
      const subscription = JSON.parse(user.pushSubscription);

      await webpush.sendNotification(
        subscription,
        JSON.stringify(payload)
      );

      return { success: true };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error };
    }
  }

  /**
   * Utility to broadcast (future use)
   */
  static async broadcast(payload: any) {
    const users = await prisma.user.findMany({
      where: { pushSubscription: { not: null } },
      select: { pushSubscription: true }
    });

    const notifications = users.map(user => {
      const sub = JSON.parse(user.pushSubscription!);
      return webpush.sendNotification(sub, JSON.stringify(payload));
    });

    return Promise.allSettled(notifications);
  }
}
