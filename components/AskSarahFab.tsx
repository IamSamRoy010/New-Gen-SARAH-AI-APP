
import React from 'react';
import { ZapIcon } from './icons/FeatherIcons';

interface AskSarahFabProps {
    onOpen: () => void;
}

const AskSarahFab: React.FC<AskSarahFabProps> = ({ onOpen }) => {
    return (
        <button
            onClick={onOpen}
            className="fixed bottom-5 right-5 flex flex-col items-center space-y-1 text-white group z-30"
            aria-label="Ask SARAH"
        >
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <ZapIcon className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-200">ASK SARAH</span>
        </button>
    );
};

export default AskSarahFab;
