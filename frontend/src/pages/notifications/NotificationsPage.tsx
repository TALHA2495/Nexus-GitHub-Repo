import React from 'react';
import { Bell, MessageCircle, UserPlus, DollarSign } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const notifications = [
  {
    id: 1,
    type: 'message',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    content: 'sent you a message about your startup',
    time: '5 minutes ago',
    unread: true
  },
  {
    id: 2,
    type: 'connection',
    user: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
    },
    content: 'accepted your connection request',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 3,
    type: 'investment',
    user: {
      name: 'Jennifer Lee',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
    },
    content: 'showed interest in investing in your startup',
    time: '1 day ago',
    unread: false
  }
];

export const NotificationsPage: React.FC = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle size={16} className="text-primary-600" />;
      case 'connection':
        return <UserPlus size={16} className="text-secondary-600" />;
      case 'investment':
        return <DollarSign size={16} className="text-accent-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your network activity</p>
        </div>
        
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>
      
      <div className="space-y-4">
        {notifications.map(notification => (
          <Card
            key={notification.id}
            className={`transition-colors duration-200 ${
              notification.unread ? 'bg-primary-50' : ''
            }`}
          >
            <CardBody className="flex items-start p-4">
              <Avatar
                src={notification.user.avatar}
                alt={notification.user.name}
                size="md"
                className="flex-shrink-0 mr-4"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {notification.user.name}
                  </span>
                  {notification.unread && (
                    <Badge variant="primary" size="sm" rounded>New</Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mt-1">
                  {notification.content}
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  {getNotificationIcon(notification.type)}
                  <span>{notification.time}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};