"use client";

import {
    Menu,
    X,
    LayoutDashboard,
    BookOpen,
    Layers,
    FileText,
    Users,
    LogOut,
    ChevronRight,
    User
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SidebarContent = ({ activeSection, setActiveSection, close, expanded }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
      await signOut({ redirect: false });
      router.push("/auth/login");
      router.refresh();
    };

    const isAuthenticated = status === 'authenticated';

    const sections = [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { key: 'livres', label: 'Livres', icon: BookOpen, href: '/books' },
        { key: 'exemplaires', label: 'Exemplaires', icon: Layers, href: '/bookcopies' },
        { key: 'locations', label: 'Locations', icon: FileText, href: '/loans' },
        { key: 'lecteurs', label: 'Lecteurs', icon: Users, href: '/members' },
        { key: 'profil', label: 'Profil', icon: User, href: '/profil' },
    ];

    return (
        <div className={`h-full bg-white flex flex-col transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-16'} shadow-lg`}>
            <div className="p-4 border-b flex items-center justify-center">
                {expanded ? (
                    <h2 className="text-xl font-bold text-indigo-700">Bibliothèque</h2>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold">
                        B
                    </div>
                )}
            </div>
            
            <nav className="flex-1 py-6 px-3 space-y-1">
                {sections.map(({ key, label, icon: Icon, href }) => (
                    <Link key={key} href={href} passHref>
                        <div
                            onClick={() => {
                                setActiveSection(key);
                                if (close) close();
                            }}
                            className={`flex items-center ${expanded ? 'px-4' : 'px-2'} py-3 rounded-lg transition-all duration-200 group cursor-pointer
                            ${activeSection === key 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'text-gray-600 hover:bg-gray-100'}`}
                            title={expanded ? '' : label}
                        >
                            <Icon className={`${expanded ? 'mr-3' : 'mx-auto'} w-5 h-5 transition-colors duration-200
                                ${activeSection === key ? 'text-indigo-700' : 'text-gray-500 group-hover:text-gray-700'}`} />
                            
                            {expanded && (
                                <span className={`font-medium ${activeSection === key ? 'font-semibold' : ''}`}>
                                    {label}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </nav>
            
            <div className="mt-auto border-t">
                {expanded ? (
                    <div className="p-4">
                        {isAuthenticated && (
                            <button 
                                onClick={handleLogout}
                                className="mt-3 flex items-center text-red-500 hover:text-red-700 transition-colors w-full py-2 px-3 rounded-md hover:bg-red-50"
                            >
                                <LogOut size={18} className="mr-2" />
                                <span>Se déconnecter</span>
                            </button>
                        )}
                    </div>
                ) : (
                    isAuthenticated && (
                        <div className="p-3 flex flex-col items-center gap-3">
                            <button 
                                onClick={handleLogout}
                                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                                title="Se déconnecter"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out">
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
                    className="p-2 rounded-lg border bg-white shadow-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Menu className="w-5 h-5 text-indigo-700" />
                </button>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div ref={modalRef} className="h-full">
                        <div className="flex justify-between items-center p-4 border-b bg-indigo-50">
                            <h2 className="text-lg font-semibold text-indigo-700">Bibliothèque</h2>
                            <button
                                className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
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
                <SidebarContent
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    expanded={expanded}
                />
                
                {/* Bouton toggle amélioré */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`absolute top-1/2 -right-3 transform -translate-y-1/2
                    bg-indigo-700 text-white rounded-full w-6 h-6 shadow-md
                    flex items-center justify-center
                    hover:bg-indigo-800 transition-all duration-200`}
                >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </>
    );
};

export default Sidebar;