
import React from 'react';
import type { Notification } from '../../types';
import { BellIcon, XIcon, AlertTriangleIcon, InfoIcon, CheckCircleIcon, UserPlusIcon } from '../icons/FeatherIcons';

interface NotificationCenterProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    onMarkAllRead: () => void;
}

const notificationIcons: { [key in Notification['type']]: React.ReactNode } = {
    low_stock: <AlertTriangleIcon className="w-6 h-6 text-red-400" />,
    info: <InfoIcon className="w-6 h-6 text-blue-400" />,
    success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
    task_assigned: <UserPlusIcon className="w-6 h-6 text-purple-400" />,
};

const formatRelativeTime = (timestamp: number) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - timestamp) / 1000);
    if (seconds < 10) return "just now";
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, setIsOpen, notifications, onNotificationClick, onMarkAllRead }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            {/* Trigger Button */}
            <button 
                onClick={() => setIsOpen(true)} 
                className="fixed top-1/2 right-4 -translate-y-1/2 z-30 bg-[var(--primary-orange)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--accent-orange)] transition-colors transform hover:scale-110"
                aria-label="Open Notifications"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full text-xs flex items-center justify-center font-bold border-2 border-[var(--bg-primary)]">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-card)] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b border-[var(--gray-dark)] flex-shrink-0">
                    <h3 className="font-bold text-white text-lg">Notification Center</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        <XIcon />
                    </button>
                </div>

                <div className="p-4 border-b border-[var(--gray-dark)] flex-shrink-0">
                     <button onClick={onMarkAllRead} className="w-full bg-[var(--bg-tertiary)] hover:bg-[var(--gray-dark)] text-sm py-2 rounded-lg text-white font-semibold">
                        Mark all as read
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
                    {notifications.length > 0 ? (
                        <div className="space-y-2">
                            {notifications.map(notif => (
                                <button
                                    key={notif.id}
                                    onClick={() => onNotificationClick(notif)}
                                    className="w-full text-left flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                                >
                                    <div className="flex-shrink-0 mt-1 p-2 bg-[var(--bg-secondary)] rounded-full">
                                        {notificationIcons[notif.type]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-white pr-2">{notif.title}</p>
                                            {!notif.read && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-orange)] flex-shrink-0 mt-1.5" title="Unread"></div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-300 mt-0.5">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(notif.timestamp)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-16">
                            <BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-600"/>
                            <p className="font-semibold">All caught up!</p>
                            <p className="text-sm">You have no new notifications.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationCenter;
