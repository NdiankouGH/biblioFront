import {useEffect, useState} from "react";
import axios from "axios";
import {AlertDialog, Button, DropdownMenu, Select} from "@radix-ui/themes";
import {FaEdit, FaEye, FaTrash} from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";
import FormEditBookCopy from "@/app/components/bookCopy/FormEditBookCopy";
import Paginate from "../Paginate";

const ListLoans = ({searchTerm = ""}) => { 
    const [members, setMembers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [sortBy, setSortBy] = useState("loanDateDesc");
    const [loanStatus, setLoanStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const fetchMembers = async () => {
        const res = await axios.get("http://localhost:8082/api/members/listMember");
        setMembers(res.data);
    };

    const fetchLoans = async () => {
        const res = await axios.get("http://localhost:8082/api/loan/listLoan");
        setLoans(res.data);
    };

    useEffect(() => {
        fetchMembers();
        fetchLoans();
    }, []);

    const getLoansByMember = (memberId) => {
        return loans.filter(loan => loan.member.id === memberId);
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "ACTIVE":
                return "En cours";
            case "OVERDUE":
                return "En retard";
            case "RETURNED":
                return "Retourné";
            case "RENEWED":
                return "Prolongé";
            default:
                return status || "Inconnu";
        }
    };

    const filteredMembers = members.filter(member => {
        const memberLoans = getLoansByMember(member.id);
        
        // Filter members based on their loan status if a loan status filter is applied
        if (loanStatus !== "all") {
            const hasMatchingLoan = memberLoans.some(loan => {
                return loan.status?.toUpperCase() === loanStatus;
            });
            if (!hasMatchingLoan) return false;
        }
        
        return member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               member.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => {
        // Sort by most recent loan date first
        const loansA = getLoansByMember(a.id);
        const loansB = getLoansByMember(b.id);
        
        if (loansA.length === 0) return 1;
        if (loansB.length === 0) return -1;
        
        const latestLoanA = new Date(Math.max(...loansA.map(loan => new Date(loan.loanDate))));
        const latestLoanB = new Date(Math.max(...loansB.map(loan => new Date(loan.loanDate))));
        
        return sortBy === "loanDateDesc" ? latestLoanB - latestLoanA : latestLoanA - latestLoanB;
    });
    
    const pageCount = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleChangeStatus = async (loanId) => {
        try {
            await axios.put(`http://localhost:8082/api/loan/changeStatus/${loanId}?status=Retourné`)
            await fetchMembers();  // recharge tous les membres + leurs emprunts après changement
            await fetchLoans();
            setViewDialogOpen(false);
        }catch(err) {
            console.error("Erreur lors du changement de statut :", err);

        }
    }

    return (
        <div className="space-y-4">
            {/* Filtres */}
            <div className="flex justify-between items-center">
                <Select.Root value={loanStatus} onValueChange={setLoanStatus}>
                    <Select.Trigger placeholder="Filtrer par statut" />
                    <Select.Content>
                        <Select.Item value="all">Tous les statuts</Select.Item>
                        <Select.Item value="ACTIVE">En cours</Select.Item>
                        <Select.Item value="OVERDUE">En retard</Select.Item>
                        <Select.Item value="RETURNED">Retourné</Select.Item>
                        <Select.Item value="RENEWED">Prolongé</Select.Item>
                    </Select.Content>
                </Select.Root>

                <Select.Root value={sortBy} onValueChange={setSortBy}>
                    <Select.Trigger placeholder="Trier par date" />
                    <Select.Content>
                        <Select.Item value="loanDateDesc">Date d'emprunt ↓</Select.Item>
                        <Select.Item value="loanDateAsc">Date d'emprunt ↑</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead className="bg-gray-100">
                    <tr>
                        {['Nom', 'Téléphone', 'Emprunts actifs', 'Actions'].map(header => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedMembers.map((member) => {
                        const memberLoans = getLoansByMember(member.id);
                        return (
                            <tr key={member.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{member.name}</td>
                                <td className="px-6 py-4">{member.phoneNumber}</td>
                                <td className="px-6 py-4">{memberLoans.length}</td>
                                <td className="px-6 py-4 ">
                                    <Button
                                        variant="soft"
                                        onClick={() => {
                                            setSelectedMember(member);
                                            setViewDialogOpen(true);
                                        }}
                                    >
                                        <FaEye className="mr-2" /> Voir emprunts
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                
                {/* Pagination */}
                <Paginate
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />

                {/* Dialog pour afficher les emprunts du membre */}
                <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg p-6 bg-white rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
                            <Dialog.Title className="text-lg font-bold mb-4">
                                Emprunts de {selectedMember?.name}
                            </Dialog.Title>

                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {selectedMember && getLoansByMember(selectedMember.id).map((loan) => (
                                    <div key={loan.id} className="p-4 border rounded-md bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-semibold">{loan.bookCopy?.title || 'Titre inconnu'}</p>
                                            <p className={`text-xs font-semibold ${loan.status === "RETURNED" ? "text-green-600" : "text-red-500"}`}>
                                                {getStatusLabel(loan.status)}
                                            </p>
                                            <p className="text-xs text-gray-500">Emprunté le : {new Date(loan.loanDate).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">Retour prévu : {new Date(loan.dueDate).toLocaleDateString()}</p>
                                        </div>

                                        {/* Bouton pour changer le status */}
                                        {loan.status !== "RETURNED" && (
                                            <Button
                                                variant="soft"
                                                size="sm"
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                                onClick={() => handleChangeStatus(loan.id)}
                                            >
                                                <span className="mt-6 w-64 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white">
                                                    Marquer comme retourné
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Dialog.Close asChild>
                                <Button > <span className="mt-6 w-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white">Fermer</span></Button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </div>
    );

}
export default ListLoans ;