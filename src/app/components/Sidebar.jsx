"use client";

import {
    Menu,
    X,
    LayoutDashboard,
    BookOpen,
    Layers,
    FileText,
    Users,
    Settings
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const sections = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { key: 'livres', label: 'Livres', icon: BookOpen, href: '/books' },
    { key: 'exemplaires', label: 'Exemplaires', icon: Layers, href: '/bookcopies' },
    { key: 'locations', label: 'Locations', icon: FileText, href: '/loans' },
    { key: 'Lecteurs', label: 'Lecteurs', icon: Users, href: '/members' },
    { key: 'settings', label: 'Paramètres', icon: Settings, href: '/settings' },
];

const SidebarContent = ({ activeSection, setActiveSection, close, expanded }) => (
    <div className={`h-full bg-white border-r shadow-md flex flex-col transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
        <div className={`p-4 border-b flex ${expanded ? 'justify-between' : 'justify-center'} items-center`}>
            {expanded && <h2 className="text-xl font-bold">Bibliothèque</h2>}
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {sections.map(({ key, label, icon: Icon, href }) => (
                <Link key={key} href={href} passHref>
                    <button
                        onClick={() => {
                            setActiveSection(key);
                            if (close) close();
                        }}
                        className={`flex items-center ${expanded ? 'justify-start ' : 'justify-center'} gap-3 w-full text-left px-3 py-2 rounded-md transition-colors hover:bg-gray-100 ${
                            activeSection === key ? 'bg-gray-200 font-semibold' : ''
                        }`}
                        title={expanded ? '' : label}
                    >
                        <Icon className="w-5 h-5" />
                        {expanded && label}
                    </button>
                </Link>
            ))}
        </nav>
    </div>
);

// Composant Modal personnalisé pour remplacer Radix Dialog
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
            />
            <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out">
                {children}
            </div>
        </>
    );
};

const Sidebar = ({ expanded, setExpanded }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Détecte si l'appareil est mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            // Si on passe en mobile, on s'assure que le sidebar est toujours fermé
            if (window.innerWidth < 768 && expanded) {
                setExpanded(false);
            }
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, [expanded, setExpanded]);

    // Gestion du clic hors de la modal pour la fermer
    const modalRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && isModalOpen) {
                setIsModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <>
            {/* Mobile */}
            <div className="md:hidden p-4">
                <button
                    className="p-2 rounded-md border bg-white shadow-sm"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </button>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div ref={modalRef} className="h-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">Menu</h2>
                            <button
                                className="p-1 text-gray-500 hover:text-red-400"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <SidebarContent
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                            expanded={true}
                            close={() => setIsModalOpen(false)}
                        />
                    </div>
                </Modal>
            </div>

            {/* Desktop */}
            <div className="hidden md:block fixed top-0 left-0 h-full z-10">
                {/* Bouton toggle dans le contenu du sidebar */}
                <div className={`absolute top-0.3 ${expanded ? 'right-4' : 'left-6 right-0 mx-auto'} z-20`}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
                    >
                        {expanded ? <X className="w-5 h-5" /> : <Menu className="w-3 h-3" />}
                    </button>
                </div>

                <SidebarContent
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    expanded={expanded}
                />
            </div>
        </>
    );
};

export default Sidebar;