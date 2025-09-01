'use client';
import React from 'react';
import { Dialog } from '@headlessui/react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, title, content }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen px-4 relative">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        {/* Content Panel */}
        <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-3xl w-full z-10 text-gray-800 shadow-xl text-right overflow-y-auto max-h-[80vh]">
          <Dialog.Title className="text-xl font-bold mb-4 border-b pb-2">{title}</Dialog.Title>
          <div className="space-y-4 text-sm leading-relaxed">
            {content}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              إغلاق
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PolicyModal;
