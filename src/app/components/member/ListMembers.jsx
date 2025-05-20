"use client";
import {useEffect, useState} from "react";
import axios from "axios";
import {AlertDialog, Button, DropdownMenu, Select} from "@radix-ui/themes";
import {FaEdit, FaEye, FaTrash} from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";
import FormEditBook from "@/app/components/books/FormEdit";
import FormEditMember from "@/app/components/member/FormEditMember";
import Paginate from "../Paginate";

const  ListMembers = ({searchTerm = ""}) => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [sortBy, setSortBy] = useState("registrationDateDesc");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    //Chargement des lecteurs
    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/members/listMember`);
            setMembers(response.data);
        } catch (e) {
            console.error("Erreur :", e.response?.data || e.message);
            setError("Erreur lors du chargement des membres");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    },[]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/members/delete/${selectedMember.id}`);
            setDeleteConfirmOpen(false);
            await fetchMembers(); // Rafraîchir la liste après suppression
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const filteredMembers = members
        .filter(member =>
            member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member?.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.registrationDate);
            const dateB = new Date(b.registrationDate);
            return sortBy === "registrationDateDesc" ? dateB - dateA : dateA - dateB;
        });
        
    const pageCount = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice(
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
            {/* Filtres et tri */}
            <div className="flex justify-end items-center">
                <Select.Root value={sortBy} onValueChange={setSortBy}>
                    <Select.Trigger placeholder="Trier par date d'inscription" />
                    <Select.Content>
                        <Select.Item value="registrationDateDesc">Date d'inscription ↓</Select.Item>
                        <Select.Item value="registrationDateAsc">Date d'inscription ↑</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-gray-100">
                    <tr>
                        {['Nom', 'Adresse', 'Téléphone', 'Date d\'inscription', 'Statut', 'Actions']
                            .map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{header}</th>
                            ))}
                </tr>
                </thead>
                <tbody>
                {paginatedMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{member.name}</td>
                        <td className="px-6 py-4">{member.address}</td>
                        <td className="px-6 py-4">{member.phoneNumber}</td>
                        <td className="px-6 py-4">{new Date(member.registrationDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{member.status}</td>
                        <td className="px-6 py-4 flex justify-center">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <Button variant="soft" size="icon">...</Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Item onClick={() => {
                                        setSelectedMember(member);
                                        setViewDialogOpen(true);
                                    }}>
                                        <FaEye className="mr-2" /> Voir
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item onClick={() => {
                                        setSelectedMember(member);
                                        setEditDialogOpen(true);
                                    }}>
                                        <FaEdit className="mr-2" /> Modifier
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item color="red" onClick={() => {
                                        setSelectedMember(member);
                                        setDeleteConfirmOpen(true);
                                    }}>
                                        <FaTrash className="mr-2" /> Supprimer
                                    </DropdownMenu.Item>

                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <Paginate
                pageCount={pageCount}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />

            {/* Dialog Edition */}
            <Dialog.Root open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
                        <Dialog.Title className="text-lg font-bold">Modifier le lecteur</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">Modifie les informations du livre</Dialog.Description>
                        {selectedMember && (
                            <FormEditMember
                                selectedMember={selectedMember}
                                onSuccess={() => {
                                    setEditDialogOpen(false);
                                    fetchMembers();
                                }}
                            />

                        )}
                        <Dialog.Close asChild>
                            <Button variant="soft" className="mt-4 w-full">Annuler</Button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Dialog Suppression */}
            <AlertDialog.Root open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialog.Content>
                    <AlertDialog.Title>Supprimer le lecteur</AlertDialog.Title>
                    <AlertDialog.Description>
                        Es-tu sûr de vouloir supprimer "{selectedMember?.name}" ?
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


            {/* Dialog Details membres*/}
            <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 space-y-4">
                        <Dialog.Title className="text-lg font-bold">Détails du lecteur</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">Informations du membre sélectionné</Dialog.Description>

                        {selectedMember && (
                            <div className="space-y-3">
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Nom complet</span>
                                    <span className="text-gray-800">{selectedMember.name}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Adresse</span>
                                    <span className="text-gray-800">{selectedMember.address}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Telephone</span>
                                    <span className="text-gray-800">{selectedMember.phoneNumber}</span>
                                </div>

                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Date d'inscription</span>
                                    <span className="text-gray-800">{new Date(selectedMember.registrationDate).toLocaleDateString()}</span>
                                </div>

                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Disponibles</span>
                                    <span className="text-gray-800">{selectedMember.isActive === true ? 'Actif': 'Inactif'}</span>
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

            </div>
        </div>
    );
}
export default ListMembers;