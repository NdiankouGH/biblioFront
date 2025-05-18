"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AlertDialog, Button, DropdownMenu, Select } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import FormEditBookCopy from "@/app/components/bookCopy/FormEditBookCopy";
import Paginate from "../Paginate";

const ListBookCopy = ({ searchTerm = "" }) => {
    const [bookCopies, setBookCopies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bookStatus, setBookStatus] = useState(""); 
    const [sortBy, setSortBy] = useState("acquisitionDateHight"); 

    const [selectedBookCopy, setSelectedBookCopy] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 12;

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/bookCopy/list');
            setBookCopies(response.data);
        } catch (e) {
            console.error("Erreur :", e.response?.data || e.message);
            setError("Erreur lors du chargement des livres");
        } finally {
            setIsLoading(false);
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case "AVAILABLE":
                return "Disponible";
            case "BORROWED":
                return "Emprunté";
            case "RESERVED":
                return "Réservé";
            case "DAMAGED":
                return "Dommagé";
            default:
                return "Inconnu";
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8082/api/bookCopy/delete/${selectedBookCopy.id}`);
            setDeleteConfirmOpen(false);
            fetchBooks();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const filteredBooks = bookCopies
        .filter((bookCopy) => {
            const matchSearchTerm =
                bookCopy.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bookCopy.book?.author?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchStatus =
                bookStatus === "all" ||
                bookCopy.status?.toLowerCase().includes(bookStatus.toLowerCase());

            return matchSearchTerm && matchStatus;
        })
        .sort((a, b) => {
            const dateA = new Date(a.acquisitionDate);
            const dateB = new Date(b.acquisitionDate);
            return sortBy === "acquisitionDateHight" ? dateB - dateA : dateA - dateB;
        });

    const pageCount = Math.ceil(filteredBooks.length / itemsPerPage);
    const paginatedBooks = filteredBooks.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-4">
            {/* Filtres */}
            <div className="flex justify-between items-center">
                <Select.Root value={bookStatus} onValueChange={setBookStatus}>
                    <Select.Trigger placeholder="Filtrer par statut" />
                    <Select.Content>
                        <Select.Item value="all">Tous</Select.Item>
                        <Select.Item value="Available">Disponible</Select.Item>
                        <Select.Item value="Borrowed">Emprunté</Select.Item>
                        <Select.Item value="Reserved">Réservé</Select.Item>
                    </Select.Content>
                </Select.Root>

                <Select.Root value={sortBy} onValueChange={setSortBy}>
                    <Select.Trigger placeholder="Trier par date" />
                    <Select.Content>
                        <Select.Item value="acquisitionDateHight">Date ↓</Select.Item>
                        <Select.Item value="acquisitionDateLow">Date ↑</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            {["Titre", "Statut", "Acquisition", "État", "Emplacement", "Auteur", "Actions"].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {paginatedBooks.map(bookCopy => (
                            <tr key={bookCopy.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{bookCopy.book?.title}</td>
                                <td className="px-6 py-4">{getStatusLabel(bookCopy.status)}</td>
                                <td className="px-6 py-4">{new Date(bookCopy.acquisitionDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{bookCopy.conditionRating}</td>
                                <td className="px-6 py-4">{bookCopy.location}</td>
                                <td className="px-6 py-4">{bookCopy.book?.author}</td>
                                <td className="px-6 py-4 flex justify-center">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <Button variant="soft" size="icon">...</Button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item onClick={() => { setSelectedBookCopy(bookCopy); setViewDialogOpen(true); }}>
                                                <FaEye className="mr-2" /> Voir
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item onClick={() => { setSelectedBookCopy(bookCopy); setEditDialogOpen(true); }}>
                                                <FaEdit className="mr-2" /> Modifier
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator />
                                            <DropdownMenu.Item color="red" onClick={() => { setSelectedBookCopy(bookCopy); setDeleteConfirmOpen(true); }}>
                                                <FaTrash className="mr-2" /> Supprimer
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Paginate
                pageCount={pageCount}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            /> 

            {/* Dialog pour Editer */}
            <Dialog.Root open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
                        <Dialog.Title className="text-lg font-bold">Modifier l'exemplaire</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">Modifier les informations de l'exemplaire</Dialog.Description>
                        {selectedBookCopy && (
                            <FormEditBookCopy
                                selectedBookCopy={selectedBookCopy}
                                onSuccess={() => { setEditDialogOpen(false); fetchBooks(); }}
                            />
                        )}
                        <Dialog.Close asChild>
                            <Button variant="soft" className="mt-4 w-full">Annuler</Button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Dialog pour Détails */}
            <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 space-y-4">
                        <Dialog.Title className="text-lg font-bold">Détails de l'exemplaire</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">Informations sur l'exemplaire sélectionné</Dialog.Description>
                        {selectedBookCopy && (
                            <div className="space-y-3">
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Titre</span>
                                    <span className="text-gray-800">{selectedBookCopy.book?.title}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Auteur</span>
                                    <span className="text-gray-800">{selectedBookCopy.book?.author}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Statut</span>
                                    <span className="text-gray-800">{selectedBookCopy.status}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">État</span>
                                    <span className="text-gray-800">{selectedBookCopy.conditionRating}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Emplacement</span>
                                    <span className="text-gray-800">{selectedBookCopy.location}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Acquisition</span>
                                    <span className="text-gray-800">{new Date(selectedBookCopy.acquisitionDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                        <Dialog.Close asChild>
                            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md">
                                Fermer
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Dialog pour Suppression */}
            <AlertDialog.Root open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialog.Content>
                    <AlertDialog.Title>Supprimer l'exemplaire</AlertDialog.Title>
                    <AlertDialog.Description>
                        Es-tu sûr de vouloir supprimer "{selectedBookCopy?.book?.title}" ?
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-2 mt-4">
                        <AlertDialog.Cancel asChild>
                            <Button variant="soft">Annuler</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button color="red" onClick={handleDelete}>Supprimer</Button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </div>
    );
};

export default ListBookCopy;