
import React from 'react';
import type { Page } from '../../types';
import { MessageSquareIcon, LogOutIcon } from '../icons/FeatherIcons';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const navLinks: { id: Page; label: string; external?: string }[] = [
    { id: 'dashboard-page', label: 'Overview' },
    { id: 'store-map-page', label: '3D Store Map', external: 'https://www.perplexity.ai/apps/17288e92-b35d-467e-9b58-649529b97e78' },
    { id: 'inventory-page', label: 'Inventory' },
    { id: 'payslip-page', label: 'Payslip' },
    { id: 'training-hub-page', label: 'Training Hub' },
    { id: 'analytics-page', label: 'Analytics' },
    { id: 'fulfillment-page', label: 'Fulfillment' },
];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout }) => {
    return (
        <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-xl font-bold text-white">Hey Sarah!</h1>
                        <nav className="hidden md:flex space-x-2">
                            {navLinks.map(link => (
                                <a
                                    key={link.id}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link.external) {
                                            window.open(link.external, '_blank');
                                        } else {
                                            onNavigate(link.id);
                                        }
                                    }}
                                    className={`nav-link px-3 py-2 rounded-md text-sm font-medium ${currentPage === link.id ? 'active' : ''}`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => onNavigate('chat-page')} className="text-gray-400 hover:text-white">
                            <MessageSquareIcon />
                        </button>
                        <button onClick={() => onNavigate('profile-page')}>
                            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
                        </button>
                        <button onClick={onLogout} className="text-gray-400 hover:text-white" title="Sign Out">
                            <LogOutIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
