import io from '../../sockets/socketHandlers.js';
import { PushService } from '../../services/pushService.js';
import { NotificationService } from '../notification/notification.service.js';
import { sendMail } from '../../email/sendMail.js';
import matchAcceptedEmailHtml from '../../email/template/matchAcceptedEmailHtml.js';

export class MatchNotifier {

    static matchRequested(data: {
        targetUserId: string;
        senderName: string;
        matchId: string;
    }) {
        const { targetUserId, senderName, matchId } = data;

        NotificationService.createNotification({
            userId: targetUserId,
            type: 'MATCH_REQUEST',
            title: 'New Swap Request',
            message: `${senderName} wants to swap skills with you!`,
            link: '/matches',
            payload: { matchId }
        }).catch(console.error);

        io.to(`user:${targetUserId}`).emit('notification', {
            type: 'MATCH_REQUEST',
            title: 'New Swap Request',
            message: `${senderName} wants to swap skills with you!`,
            link: '/matches',
            payload: { matchId }
        });

        PushService.sendNotification(targetUserId, {
            title: 'New Swap Request',
            message: `${senderName} wants to swap skills with you!`,
            link: '/matches'
        }).catch(console.error);
    }

    static matchAccepted(data: {
        requesterId: string;
        requesterName: string;
        accepterName: string;
        requesterEmail: string;
        matchId: string;
    }) {
        const { requesterId, requesterName, accepterName, requesterEmail, matchId } = data;

        NotificationService.createNotification({
            userId: requesterId,
            type: 'MATCH_ACCEPTED',
            title: 'Swap Accepted!',
            message: `${accepterName} accepted your swap request.`,
            link: '/chat',
            payload: { matchId }
        }).catch(console.error);

        io.to(`user:${requesterId}`).emit('notification', {
            type: 'MATCH_ACCEPTED',
            title: 'Swap Accepted!',
            message: `${accepterName} accepted your swap request.`,
            link: '/chat',
            payload: { matchId }
        });

        PushService.sendNotification(requesterId, {
            title: 'Swap Accepted!',
            message: `${accepterName} accepted your swap request.`,
            link: '/chat'
        }).catch(console.error);

        sendMail(
            requesterEmail,
            'Your Skill Swap Request was Accepted!',
            matchAcceptedEmailHtml(requesterName, accepterName)
        ).catch(console.error);
    }
}
