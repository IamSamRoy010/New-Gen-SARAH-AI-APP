
export type Page = 
    | 'dashboard-page'
    | 'store-map-page'
    | 'inventory-page'
    | 'payslip-page'
    | 'training-hub-page'
    | 'analytics-page'
    | 'fulfillment-page'
    | 'chat-page'
    | 'profile-page'
    | 'database-page';

export type TaskStatus = 'Open' | 'Ongoing' | 'Completed' | 'Delayed' | 'De-prioritised' | 'Delegated';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
    id: number;
    task_name: string;
    description: string;
    task_type: 'Inventory' | 'Maintenance' | 'Quality Check' | 'Other';
    status: TaskStatus;
    due_date: string;
    priority: TaskPriority;
    product_ids: string[];
    assignedTo?: string;
}

export interface InventoryItem {
    product_code: string;
    name: string;
    category: string;
    current_stock: number;
    max_capacity: number;
    reorder_threshold: number;
    min_order_quantity: number;
    supplier_id: string;
}

export interface FulfillmentOrder {
    id: string;
    customerName: string;
    customerId: string;
    orderDate: string;
    priority: 'High' | 'Medium' | 'Low';
    itemCount: number;
    status: 'pick' | 'pack' | 'ship';
    items: { name: string; qty: number; img: string }[];
}

export interface Payslip {
    id: number;
    month: string;
    year: number;
    earnings: { [key: string]: number };
    deductions: { [key: string]: number };
    attendance: { worked: number; overtime: number; leaves: number };
    gross: number;
    totalDeductions: number;
    net: number;
}

export interface TrainingModule {
    id: string;
    title: string;
    description: string;
    progress: number;
    completed: boolean;
    completionDate?: string;
    special?: boolean;
    // New properties for certificates
    level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
    certificateId: string;
    score: number;
    instructor: string;
}


export interface ChatMessage {
    s: string; // sender
    t: string; // text
}

export interface ChatContact {
    name: string;
    type: 'user' | 'group';
    avatar: string | null;
    messages: ChatMessage[];
}

export interface ChatDB {
    [id: string]: ChatContact;
}

export interface SarahMessage {
    sender: 'user' | 'sarah' | 'loading';
    text: string;
    imagePreview?: string;
}

export interface ReorderRequest {
    id: string;
    productName: string;
    productId: string;
    quantity: number;
    status: 'Pending' | 'Approved' | 'Ordered';
    date: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    type: 'low_stock' | 'info' | 'success' | 'task_assigned';
    page?: Page;
    timestamp: number;
}

export interface Employee {
    id: number;
    name: string;
    role: string;
}

export interface Shift {
    id: string;
    title: string;
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    start: number; // 24-hour format
    end: number;
    type: 'shift' | 'meeting';
}

export interface Schedule {
    [employeeName: string]: Shift[];
}


export type ModalType =
    | { type: 'ask-sarah' }
    | { type: 'task-update'; taskId: number }
    | { type: 'delegate-task'; taskId: number }
    | { type: 'order-details'; order: FulfillmentOrder }
    | { type: 'raise-query' }
    | { type: 'training-module'; moduleId: string }
    | { type: 'certificate'; moduleId: string }
    | { type: 'clock-in-out' }
    | { type: 'report-issue' }
    | { type: 'request-assistance' }
    | { type: 'price-check' }
    | { type: 'apply-leave' }
    | { type: 'inventory-detail'; item: InventoryItem }
    | { type: 'smart-schedule' }
    | { type: 'request-sub'; shift: Shift }
    | { type: 'view-certificate'; module: TrainingModule };
