"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Combobox } from "@headlessui/react";

const FormLoan = ({ onSuccess }) => {
    const [bookCopies, setBookCopies] = useState([]);
    const [members, setMembers] = useState([]);
    const [bookQuery, setBookQuery] = useState("");
    const [memberQuery, setMemberQuery] = useState("");
    const [selectedBookCopies, setSelectedBookCopies] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [formData, setFormData] = useState({
        loanDate: "",
        dueDate: "",
        returnDate: "",
        status: "ACTIVE",
        location: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Charger uniquement les exemplaires disponibles
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bookCopy/list`)
            .then((res) => {
                // Filtrer pour n'avoir que les exemplaires disponibles
                const availableCopies = res.data.filter(copy => copy.status === "AVAILABLE");
                setBookCopies(availableCopies);
            })
            .catch(console.error);

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/members/listMember`)
            .then((res) => setMembers(res.data)
        )
            .catch(console.error);
    }, []);

    // Filtrer les exemplaires de livres par titre ou auteur
    const filteredBooks = bookQuery === ""
        ? bookCopies
        : bookCopies.filter(copy =>
            (copy.book?.title || "").toLowerCase().includes(bookQuery.toLowerCase()) ||
            (copy.book?.author || "").toLowerCase().includes(bookQuery.toLowerCase())
        );

    const filteredMembers = memberQuery === ""
        ? members
        : members.filter(member =>
            (member.name || "").toLowerCase().includes(memberQuery.toLowerCase()) ||
            (member.phoneNumber || "").toLowerCase().includes(memberQuery.toLowerCase())
        );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!selectedMember || selectedBookCopies.length === 0) {
            setFeedback({ type: "error", message: "Sélectionne au moins 1 livre et un lecteur." });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                member: { id: selectedMember.id },
                bookCopies: selectedBookCopies.map(copy => ({ id: copy.id }))
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/loan/addLoan`, payload, {
                headers: { "Content-Type": "application/json" },
            });
            setFeedback({ type: "success", message: "Prêt ajouté avec succès." });

            // reset form
            setFormData({
                loanDate: "",
                dueDate: "",
                returnDate: "",
                status: "ACTIVE",
                location: ""
            });
            setSelectedBookCopies([]);
            setSelectedMember(null);
            setBookQuery("");
            setMemberQuery("");

            // Appeler la fonction onSuccess pour rafraîchir la liste
            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", message: "Erreur lors de l'ajout du prêt." });
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour formater l'affichage des exemplaires sélectionnés
    const formatSelectedBooks = () => {
        if (selectedBookCopies.length === 0) return "";
        return selectedBookCopies.map(copy =>
            `${copy.book?.title} (ID: ${copy.id})`
        ).join(", ");
    };

    const inputClasses = "mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 shadow-sm";

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-white p-6 rounded-xl shadow-md"
        >
            {/* Choisir les livres */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Choisir des Exemplaires</label>
                <Combobox multiple value={selectedBookCopies} onChange={setSelectedBookCopies}>
                    <div className="relative">
                        <Combobox.Input
                            className={inputClasses}
                            placeholder="Rechercher un titre, auteur..."
                            onChange={(e) => setBookQuery(e.target.value)}
                            displayValue={() => formatSelectedBooks()}
                        />
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            {filteredBooks.length === 0 && bookQuery !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Aucun exemplaire disponible trouvé.
                                </div>
                            ) : (
                                filteredBooks.map((bookCopy) => (
                                    <Combobox.Option
                                        key={bookCopy.id}
                                        value={bookCopy}
                                        className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}
                                        disabled={selectedBookCopies.some(copy => copy.id === bookCopy.id)}
                                    >
                                        {({ selected, active }) => (
                                            <div className="flex flex-col">
                                                <div className="flex justify-between">
                                                    <span className={`${selected ? "font-bold" : "font-normal"}`}>
                                                        {bookCopy.book?.title || "Sans titre"}
                                                    </span>
                                                    <span className={`text-sm ${active ? "text-indigo-200" : "text-gray-500"}`}>
                                                        ID: {bookCopy.id}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">
                                                        {bookCopy.book?.author || "Auteur inconnu"}
                                                    </span>
                                                    <span className={`text-sm ${active ? "text-indigo-200" : "text-gray-500"}`}>
                                                        {bookCopy.location || "Emplacement non défini"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </div>
                </Combobox>
            </div>

            {/* Liste des exemplaires sélectionnés */}
            {selectedBookCopies.length > 0 && (
                <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Exemplaires sélectionnés:</h3>
                    <div className="space-y-2">
                        {selectedBookCopies.map((copy) => (
                            <div key={copy.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                                <div>
                                    <div className="font-medium">{copy.book?.title}</div>
                                    <div className="text-sm text-gray-500">
                                        {copy.book?.author} - Emplacement: {copy.location || "Non défini"}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBookCopies(prev => prev.filter(item => item.id !== copy.id))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Retirer
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Choisir l'emprunteur */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Choisir un Lecteur</label>
                <Combobox value={selectedMember} onChange={setSelectedMember}>
                    <div className="relative">
                        <Combobox.Input
                            className={inputClasses}
                            placeholder="Tape un nom ou numéro de téléphone..."
                            onChange={(e) => setMemberQuery(e.target.value)}
                            displayValue={(member) => member?.name || ""}
                        />
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            {filteredMembers.length === 0 && memberQuery !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Aucun lecteur trouvé.
                                </div>
                            ) : (
                                filteredMembers.map((member) => (
                                    <Combobox.Option
                                        key={member.id}
                                        value={member}
                                        className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}
                                    >
                                        {({ selected, active }) => (
                                            <div>
                                                <span className={`${selected ? "font-bold" : "font-normal"}`}>
                                                    {member.name}
                                                </span>
                                                <span className={`ml-2 text-sm ${active ? "text-indigo-200" : "text-gray-500"}`}>
                                                    {member.phoneNumber}
                                                </span>
                                            </div>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </div>
                </Combobox>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date de prêt</label>
                    <input
                        type="date"
                        name="loanDate"
                        value={formData.loanDate}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date de retour</label>
                    <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
            </div>

            {feedback && (
                <div className={`text-sm p-2 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                </div>
            )}

            <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2 px-4 text-white rounded-md shadow ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
            >
                {loading ? "Envoi en cours..." : "Ajouter le prêt"}
            </motion.button>
        </motion.form>
    );
};

export default FormLoan;