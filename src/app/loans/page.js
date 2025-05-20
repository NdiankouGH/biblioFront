"use client"
import AddDialog from "@/app/components/addDialog";
import FormBookCopy from "@/app/components/bookCopy/FormBookCopy";
import ListBookCopy from "@/app/components/bookCopy/ListBookCopy";
import ListLoans from "@/app/components/loan/ListLoans";
import {useState} from "react";
import FormLoan from "@/app/components/loan/FormLoan";
import AuthCheck from "../components/utils/AuthCheck";

const Loan = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <AuthCheck>

        <div>
            <div className="p-6 space-y-6">
                {/* En-tête */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des emprunts</h1>
                    <AddDialog
                        titleButton="Nouveau emprunt"
                        description="Remplis les informations ci-dessous."
                    >
                        <FormLoan />
                    </AddDialog>
                </div>

                {/* Barre de recherche */}
                <div>
                    <input
                        type="text"
                        placeholder="Rechercher ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Liste */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <ListLoans searchTerm={searchTerm} />
                </div>
            </div>
        </div>
        </AuthCheck>
    )
}
export default Loan;