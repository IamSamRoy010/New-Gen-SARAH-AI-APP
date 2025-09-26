
import React, { useState, useCallback, useEffect } from 'react';
import type { Page, ModalType, Task, InventoryItem, ReorderRequest, Notification, Employee, TaskStatus, ChatDB, ChatMessage, TaskPriority, Schedule } from './types';

import LoginPage from './pages/LoginPage';
import Header from './components/layout/Header';
import NotificationCenter from './components/layout/NotificationCenter';
import AskSarahFab from './components/AskSarahFab';
import AskSarahModal from './modals/AskSarahModal';
import TaskUpdateModal from './modals/TaskUpdateModal';
import DelegateTaskModal from './modals/DelegateTaskModal';
import InventoryDetailModal from './modals/InventoryDetailModal';
import SmartScheduleModal from './modals/SmartScheduleModal';
import RequestSubModal from './modals/RequestSubModal';
import ClockInOutModal from './modals/ClockInOutModal';
import ReportIssueModal from './modals/ReportIssueModal';
import RequestAssistanceModal from './modals/RequestAssistanceModal';
import PriceCheckModal from './modals/PriceCheckModal';
import ApplyLeaveModal from './modals/ApplyLeaveModal';
import ViewCertificateModal from './modals/ViewCertificateModal';


import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import StoreMapPage from './pages/StoreMapPage';
import PayslipPage from './pages/PayslipPage';
import TrainingHubPage from './pages/TrainingHubPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FulfillmentPage from './pages/FulfillmentPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import DatabasePage from './pages/DatabasePage';

// Mock Data Initialization
const initialInventory: InventoryItem[] = [
    { product_code: 'IPH003', name: 'iPhone 17 Pro Max', category: 'Electronics', current_stock: 100, max_capacity: 100, reorder_threshold: 0.2, min_order_quantity: 40, supplier_id: 'SUP001' },
    { product_code: 'IPH001', name: 'iPhone 15 Pro Max', category: 'Electronics', current_stock: 28, max_capacity: 50, reorder_threshold: 0.2, min_order_quantity: 10, supplier_id: 'SUP001' },
    { product_code: 'IPH002', name: 'iPhone 15 Pro', category: 'Electronics', current_stock: 12, max_capacity: 50, reorder_threshold: 0.2, min_order_quantity: 10, supplier_id: 'SUP001' },
    { product_code: 'ACC001', name: 'Phone Case - Clear', category: 'Accessories', current_stock: 25, max_capacity: 100, reorder_threshold: 0.2, min_order_quantity: 50, supplier_id: 'SUP002' },
    { product_code: 'ACC002', name: 'Screen Protector', category: 'Accessories', current_stock: 40, max_capacity: 150, reorder_threshold: 0.2, min_order_quantity: 50, supplier_id: 'SUP002' },
    { product_code: 'CHR001', name: 'USB-C Charger', category: 'Accessories', current_stock: 18, max_capacity: 75, reorder_threshold: 0.2, min_order_quantity: 25, supplier_id: 'SUP003' },
];

const initialTasks: Task[] = [
    { id: 5, task_name: 'Stock iPhone 17 Pro Max', description: 'Move iPhone 17 Pro Max units from the storeroom to the main display shelves.', task_type: 'Inventory', status: 'Open', due_date: '2025-09-25', priority: 'High', product_ids: ['IPH003'] },
    { id: 1, task_name: 'Stock iPhone Cases', description: 'Restock iPhone 15 cases from the storage room to the main display shelves.', task_type: 'Inventory', status: 'Open', due_date: '2025-09-25', priority: 'High', product_ids: ['ACC001'] },
    { id: 2, task_name: 'Inventory Count - Accessories', description: 'Perform the weekly inventory count for all items in the accessories section.', task_type: 'Inventory', status: 'Ongoing', due_date: '2025-09-26', priority: 'Medium', product_ids: ['ACC001', 'ACC002', 'CHR001'] },
    { id: 3, task_name: 'Clean up Aisle 5', description: 'Clean spill in electronics aisle and check for safety hazards.', task_type: 'Maintenance', status: 'Open', due_date: '2025-09-25', priority: 'High', product_ids: [] },
    { id: 4, task_name: 'Price Check Electronics', description: 'Verify pricing accuracy for all electronic items.', task_type: 'Quality Check', status: 'Delayed', due_date: '2025-09-24', priority: 'Low', product_ids: [] },
];

const initialEmployees: Employee[] = [
    { id: 1, name: 'Sarah Johnson', role: 'Associate' },
    { id: 2, name: 'Mike Chen', role: 'Associate' },
    { id: 3, name: 'Emily Taylor', role: 'Team Lead' },
    { id: 4, name: 'David Lee', role: 'Manager' },
    { id: 5, name: 'Jessica Wong', role: 'Associate' }
];

const initialSchedules: Schedule = {
    'Sarah Johnson': [
      { id: 's1', title: 'Opening Shift', day: 'Mon', start: 9, end: 17, type: 'shift' },
      { id: 's2', title: 'Closing Shift', day: 'Tue', start: 14, end: 22, type: 'shift' },
      { id: 's3', title: 'Meeting: Q4 Planning', day: 'Wed', start: 11, end: 12, type: 'meeting' },
      { id: 's4', title: 'Opening Shift', day: 'Wed', start: 9, end: 17, type: 'shift' },
      { id: 's5', title: 'Closing Shift', day: 'Fri', start: 14, end: 22, type: 'shift' },
    ],
    'Mike Chen': [
      { id: 'm1', title: 'Opening Shift', day: 'Mon', start: 9, end: 17, type: 'shift' },
      { id: 'm2', title: 'Opening Shift', day: 'Tue', start: 9, end: 17, type: 'shift' },
      { id: 'm3', title: 'Meeting: Q4 Planning', day: 'Wed', start: 11, end: 12, type: 'meeting' },
      { id: 'm4', title: 'Closing Shift', day: 'Thu', start: 14, end: 22, type: 'shift' },
      { id: 'm5', 'title': 'Closing Shift', day: 'Fri', start: 14, end: 22, type: 'shift' },
    ],
    'Emily Taylor': [
      { id: 'e1', title: 'Mid-day Shift', day: 'Mon', start: 11, end: 19, type: 'shift' },
      { id: 'e2', title: 'Mid-day Shift', day: 'Tue', start: 11, end: 19, type: 'shift' },
      { id: 'e3', title: 'Meeting: Q4 Planning', day: 'Wed', start: 11, end: 12, type: 'meeting' },
      { id: 'e4', title: 'Mid-day Shift', day: 'Wed', start: 12, end: 20, type: 'shift' },
    ],
    'Jessica Wong': [
      { id: 'j1', title: 'Opening Shift', day: 'Tue', start: 9, end: 17, type: 'shift' },
      { id: 'j2', title: 'Closing Shift', day: 'Wed', start: 14, end: 22, type: 'shift' },
      { id: 'j3', title: 'Opening Shift', day: 'Thu', start: 9, end: 17, type: 'shift' },
      { id: 'j4', title: 'Opening Shift', day: 'Fri', start: 9, end: 17, type: 'shift' },
    ]
  };

const initialNotifications: Notification[] = [
    { id: '1', title: 'Store Performance Update', message: 'Great job team! We exceeded our monthly targets.', read: false, type: 'success', timestamp: Date.now() - 1000 * 60 * 5 },
    { id: '2', title: 'Policy Change', message: 'New return policy effective next Monday.', read: false, type: 'info', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
];

const initialChatDB: ChatDB = {
    'david': { name: 'David Lee - Procurement', type: 'user', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=256', messages: [{s: 'David Lee - Procurement', t: 'Hey Sarah, let me know if any urgent reorders come through.'}]},
    'mike': { name: 'Mike Chen', type: 'user', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256', messages: [ { s: 'Mike Chen', t: 'Hey, have you seen the new shipment of headphones?' }, { s: 'Sarah Johnson', t: 'Not yet, was just about to check the inventory system.' } ]},
    'emily': { name: 'Emily Taylor', type: 'user', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=256', messages: [ {s: 'Emily Taylor', t: 'Can you approve the Q3 budget report?'} ]},
    'jessica': { name: 'Jessica Wong', type: 'user', avatar: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=256', messages: [{ s: 'Jessica Wong', t: 'Hey, are you free for the Sunday shift?' }]},
    'electronics': { name: '#Electronics Team', type: 'group', avatar: null, messages: [ {s: 'Emily Taylor', t: 'Don\'t forget the planogram reset for Aisle 3 tonight.'}, {s: 'Mike Chen', t: 'Will do, boss.'} ]},
    'general': { name: '#General-Updates', type: 'group', avatar: null, messages: [{ s: 'David Lee', t: 'Reminder: Store-wide meeting at 10 AM tomorrow.' }] },
};


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard-page');
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);

    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [reorderRequests, setReorderRequests] = useState<ReorderRequest[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [employees] = useState<Employee[]>(initialEmployees);
    const [chatDB, setChatDB] = useState<ChatDB>(initialChatDB);
    const [schedules, setSchedules] = useState<Schedule>(initialSchedules);
    const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
    const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);


    // FIX: Moved closeModal and openModal before their usage to fix "used before declaration" errors.
    const openModal = useCallback((modal: ModalType) => {
        setActiveModal(modal);
    }, []);

    const closeModal = useCallback(() => {
        setActiveModal(null);
    }, []);

    const navigate = useCallback((page: Page) => {
        setCurrentPage(page);
    }, []);

    const checkReorderTrigger = useCallback((product: InventoryItem) => {
        const thresholdValue = product.max_capacity * product.reorder_threshold;
        if (product.current_stock <= thresholdValue) {
            const existingRequest = reorderRequests.find(r => r.productId === product.product_code && r.status === 'Pending');
            if (!existingRequest) {
                let reorderQuantity = product.max_capacity - product.current_stock;
                if (reorderQuantity < product.min_order_quantity) {
                    reorderQuantity = product.min_order_quantity;
                }
                
                const newRequest: ReorderRequest = {
                    id: `REQ-${Date.now()}`,
                    productName: product.name,
                    productId: product.product_code,
                    quantity: reorderQuantity,
                    status: 'Pending',
                    date: new Date().toLocaleDateString()
                };
                setReorderRequests(prev => [...prev, newRequest]);
                
                const newNotification: Notification = {
                    id: `NOTIF-${Date.now()}`,
                    title: `Low Stock Alert: ${product.name}`,
                    message: `Stock at ${product.current_stock}. Auto-reorder for ${reorderQuantity} units created.`,
                    read: false,
                    type: 'low_stock',
                    page: 'inventory-page',
                    timestamp: Date.now(),
                };
                setNotifications(prev => [newNotification, ...prev]);

                // AUTOMATE CHAT MESSAGE
                const proformaInvoice = `
**AUTOMATED PROFORMA INVOICE**
-----------------------------------
**Request ID:** ${newRequest.id}
**Product:** ${newRequest.productName} (Code: ${newRequest.productId})
**Quantity to Order:** ${newRequest.quantity} units
**Reason:** Stock dropped to ${product.current_stock} units (Threshold: ${product.max_capacity * product.reorder_threshold}).

Please review and approve.
- SARAH (Automated Reorder Agent)
                `;
                
                setChatDB(prev => {
                    const newChatDB = {...prev};
                    const procurementChat = newChatDB['david'];
                    if(procurementChat) {
                        const newMessages = [...procurementChat.messages, { s: 'SARAH', t: proformaInvoice.trim() }];
                        newChatDB['david'] = {...procurementChat, messages: newMessages};
                    }
                    return newChatDB;
                });
            }
        }
    }, [reorderRequests]);

    const handleTaskUpdate = useCallback((taskId: number, updates: { quantity?: number }) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        // When restocking shelves, the quantity is deducted from the main inventory (storeroom)
        if (task.task_type === 'Inventory' && updates.quantity && updates.quantity > 0) {
            const updatedInventory = inventory.map(item => {
                if (task.product_ids.includes(item.product_code)) {
                    const newStock = Math.max(0, item.current_stock - updates.quantity!);
                    const newItem = { ...item, current_stock: newStock };
                    // Check reorder trigger for the updated item
                    checkReorderTrigger(newItem);
                    return newItem;
                }
                return item;
            });
            setInventory(updatedInventory);
        }
        
        // Mark task as completed and remove after a short delay
        setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
        setTimeout(() => {
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        }, 1000);

        closeModal();
    // FIX: Added `closeModal` to the dependency array to satisfy exhaustive-deps rule.
    }, [tasks, inventory, checkReorderTrigger, closeModal]);
    
    const handleTaskStatusChange = useCallback((taskId: number, status: TaskStatus) => {
        setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status } : task));
    }, []);
    
    const handleTaskPriorityChange = useCallback((taskId: number, priority: TaskPriority) => {
        setTasks(prev => prev.map(task => task.id === taskId ? { ...task, priority } : task));
    }, []);

    const handleDelegateTask = useCallback((taskId: number, employeeName: string) => {
        setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: 'Delegated', assignedTo: employeeName } : task));
        closeModal();
    // FIX: Added `closeModal` to the dependency array to satisfy exhaustive-deps rule.
    }, [closeModal]);

    const handleSubRequest = useCallback((shiftId: string, fromEmployee: string, toEmployee: string) => {
        const newNotification: Notification = {
            id: `NOTIF-${Date.now()}`,
            title: `Shift Cover Request`,
            message: `${fromEmployee} has requested you to cover their shift.`,
            read: false,
            type: 'task_assigned',
            page: 'dashboard-page',
            timestamp: Date.now(),
        };
        setNotifications(prev => [newNotification, ...prev]);
        closeModal();
        // Here you would also update the chat for the involved employee
    // FIX: Added `closeModal` to the dependency array to satisfy exhaustive-deps rule.
    }, [closeModal]);

    const handleClockInOut = useCallback(() => {
        setIsClockedIn(prev => {
            const newStatus = !prev;
            const newNotification: Notification = {
                id: `NOTIF-${Date.now()}`,
                title: `Time Clock`,
                message: `You have successfully clocked ${newStatus ? 'in' : 'out'}.`,
                read: false,
                type: 'success',
                timestamp: Date.now(),
            };
            setNotifications(prevNotifs => [newNotification, ...prevNotifs]);
            return newStatus;
        });
        closeModal();
    }, [closeModal]);

    const handleReportIssue = useCallback((issue: { type: string; location: string; description: string }) => {
        const newNotification: Notification = {
            id: `NOTIF-${Date.now()}`,
            title: `Issue Reported: ${issue.type}`,
            message: `Issue at '${issue.location}' has been reported to management.`,
            read: false,
            type: 'info',
            timestamp: Date.now(),
        };
        setNotifications(prev => [newNotification, ...prev]);
        closeModal();
    }, [closeModal]);

    const handleRequestAssistance = useCallback((type: string) => {
        const newNotification: Notification = {
            id: `NOTIF-${Date.now()}`,
            title: `Assistance Requested`,
            message: `${type} has been paged to your location.`,
            read: false,
            type: 'info',
            timestamp: Date.now(),
        };
        setNotifications(prev => [newNotification, ...prev]);
        closeModal();
    }, [closeModal]);

    const handleApplyLeave = useCallback((leaveRequest: { type: string; startDate: string; endDate: string }) => {
        const newNotification: Notification = {
            id: `NOTIF-${Date.now()}`,
            title: `Leave Request Submitted`,
            message: `Your request for ${leaveRequest.type} leave from ${leaveRequest.startDate} to ${leaveRequest.endDate} has been submitted.`,
            read: false,
            type: 'success',
            timestamp: Date.now(),
        };
        setNotifications(prev => [newNotification, ...prev]);
        closeModal();
    }, [closeModal]);


    const handleSendMessage = useCallback((chatId: string, messageText: string) => {
        setChatDB(prev => {
            const newChatDB = {...prev};
            const chat = newChatDB[chatId];
            if (chat) {
                const newMessages = [...chat.messages, { s: 'Sarah Johnson', t: messageText }];
                newChatDB[chatId] = { ...chat, messages: newMessages };
            }
            return newChatDB;
        });
    }, []);


    const handleLogin = useCallback(() => {
        setIsAuthenticated(true);
        setCurrentPage('dashboard-page');
    }, []);

    const handleLogout = useCallback(() => {
        setIsAuthenticated(false);
    }, []);

    const handleMarkAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    }, []);

    const handleNotificationClick = useCallback((notification: Notification) => {
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
        if (notification.page) {
            navigate(notification.page);
        }
        setNotificationCenterOpen(false);
    }, [navigate]);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard-page':
                return <DashboardPage tasks={tasks} reorderRequests={reorderRequests} openModal={openModal} navigate={navigate} onTaskStatusChange={handleTaskStatusChange} onTaskPriorityChange={handleTaskPriorityChange} schedules={schedules} employees={employees} />;
            case 'inventory-page':
                return <InventoryPage inventory={inventory} openModal={openModal} />;
            case 'store-map-page':
                return <StoreMapPage />;
            case 'payslip-page':
                return <PayslipPage openModal={openModal} />;
            case 'training-hub-page':
                return <TrainingHubPage openModal={openModal} />;
            case 'analytics-page':
                return <AnalyticsPage />;
            case 'fulfillment-page':
                return <FulfillmentPage openModal={openModal} />;
            case 'chat-page':
                return <ChatPage chatDB={chatDB} onSendMessage={handleSendMessage} />;
            case 'profile-page':
                return <ProfilePage />;
            case 'database-page':
                return <DatabasePage />;
            default:
                return <DashboardPage tasks={tasks} reorderRequests={reorderRequests} openModal={openModal} navigate={navigate} onTaskStatusChange={handleTaskStatusChange} onTaskPriorityChange={handleTaskPriorityChange} schedules={schedules} employees={employees} />;
        }
    };

    const renderModal = () => {
        if (!activeModal) return null;
        switch (activeModal.type) {
            case 'ask-sarah':
                return <AskSarahModal onClose={closeModal} />;
            case 'task-update':
                const taskToUpdate = tasks.find(t => t.id === activeModal.taskId);
                if (!taskToUpdate) return null;
                return <TaskUpdateModal task={taskToUpdate} onClose={closeModal} onUpdate={handleTaskUpdate} />;
            case 'delegate-task':
                 return <DelegateTaskModal taskId={activeModal.taskId} employees={employees} onClose={closeModal} onDelegate={handleDelegateTask} />;
            case 'inventory-detail':
                return <InventoryDetailModal item={activeModal.item} onClose={closeModal} />;
            case 'smart-schedule':
                return <SmartScheduleModal schedules={schedules} employees={employees} onClose={closeModal} />;
            case 'request-sub':
                return <RequestSubModal shift={activeModal.shift} currentUser="Sarah Johnson" employees={employees} onClose={closeModal} onSubRequest={handleSubRequest} />;
            case 'clock-in-out':
                return <ClockInOutModal isClockedIn={isClockedIn} onClose={closeModal} onToggle={handleClockInOut} />;
            case 'report-issue':
                return <ReportIssueModal onClose={closeModal} onSubmit={handleReportIssue} />;
            case 'request-assistance':
                return <RequestAssistanceModal onClose={closeModal} onRequest={handleRequestAssistance} />;
            case 'price-check':
                return <PriceCheckModal inventory={inventory} onClose={closeModal} />;
            case 'apply-leave':
                return <ApplyLeaveModal onClose={closeModal} onSubmit={handleApplyLeave} />;
            case 'view-certificate':
                return <ViewCertificateModal module={activeModal.module} onClose={closeModal} />;
            default:
                return null;
        }
    }

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div id="main-app-wrapper">
            <Header
                currentPage={currentPage}
                onNavigate={navigate}
                onLogout={handleLogout}
            />
            <main id="page-content" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderPage()}
            </main>
            <AskSarahFab onOpen={() => openModal({ type: 'ask-sarah' })} />
            {renderModal()}
            <NotificationCenter 
                isOpen={isNotificationCenterOpen}
                setIsOpen={setNotificationCenterOpen}
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                onMarkAllRead={handleMarkAllRead}
            />
        </div>
    );
};

export default App;
