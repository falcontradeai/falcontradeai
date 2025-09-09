import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function Modal({ open, onClose, title, children }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="relative z-50 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl w-full max-w-lg">
            {title && <Dialog.Title className="text-lg font-medium mb-4">{title}</Dialog.Title>}
            {children}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
