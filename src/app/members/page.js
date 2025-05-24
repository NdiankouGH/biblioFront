"use client" ;
import AddDialog from "@/app/components/addDialog";
import FormBooks from "@/app/components/books/FormBooks";
import {useState} from "react";
import FormMember from "@/app/components/member/FormMember";
import ListMembers from "@/app/components/member/ListMembers";

const Members = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="p-6 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des lecteurs</h1>
                <AddDialog
                    titleButton="Nouveau lecteur"
                    description="Remplis les informations ci-dessous."
                >
                    <FormMember onSuccess={handleRefresh} />
                </AddDialog>
            </div>

            {/* Barre de recherche */}
            <div>
                <input
                    type="text"
                    placeholder="Rechercher un livre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Liste */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <ListMembers searchTerm={searchTerm} key={refreshKey} />
            </div>
        </div>
    )
}
export default Members;