"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    type?: "error" | "success" | "warning" | "info";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    type = "error"
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Focus management
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getIconAndColors = () => {
        switch (type) {
            case "error":
                return {
                    icon: "❌",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    iconBg: "bg-red-100",
                    titleColor: "text-red-800",
                    textColor: "text-red-700"
                };
            case "success":
                return {
                    icon: "✅",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    iconBg: "bg-green-100",
                    titleColor: "text-green-800",
                    textColor: "text-green-700"
                };
            case "warning":
                return {
                    icon: "⚠️",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    iconBg: "bg-yellow-100",
                    titleColor: "text-yellow-800",
                    textColor: "text-yellow-700"
                };
            default:
                return {
                    icon: "ℹ️",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    iconBg: "bg-blue-100",
                    titleColor: "text-blue-800",
                    textColor: "text-blue-700"
                };
        }
    };

    const { icon, bgColor, borderColor, iconBg, titleColor, textColor } = getIconAndColors();

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    ref={modalRef}
                    tabIndex={-1}
                    className={`relative transform overflow-hidden rounded-lg ${bgColor} ${borderColor} border-2 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6`}
                >
                    <div>
                        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
                            <span className="text-2xl">{icon}</span>
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                            <h3
                                className={`text-lg font-medium leading-6 ${titleColor}`}
                                id="modal-title"
                            >
                                {title}
                            </h3>
                            <div className={`mt-2 ${textColor}`}>
                                {children}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
