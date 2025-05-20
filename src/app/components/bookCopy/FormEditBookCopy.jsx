"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Combobox } from "@headlessui/react";

const FormEditBookCopy = ({ selectedBookCopy, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        location: "",
        status: "AVAILABLE",
        acquisitionDate: "",
        conditionRating: "",
        book: null
    });
    const [feedback, setFeedback] = useState(null);
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');

    // Initialisation du formData quand selectedBookCopy change
    useEffect(() => {
        if (selectedBookCopy) {
            setFormData({
                id: selectedBookCopy.id || "",
                location: selectedBookCopy.location || "",
                status: selectedBookCopy.status || "AVAILABLE",
                acquisitionDate: selectedBookCopy.acquisitionDate ?
                    selectedBookCopy.acquisitionDate.slice(0, 10) : "",
                conditionRating: selectedBookCopy.conditionRating || "",
                book: selectedBookCopy.book || null
            });

            // Pour l'affichage dans le Combobox
            setQuery(selectedBookCopy.book?.title || "");
        }
    }, [selectedBookCopy]);

    // Chargement de la liste des livres
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/book/listBooks`)
            .then((res) => setBooks(res.data))
            .catch((err) => console.error('Erreur chargement livres', err));
    }, []);

    const filteredBooks = query === ""
        ? books
        : books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/bookCopy/updateBookCopy/${formData.id}`, {
                ...formData,
                bookId: formData.book?.id, // On passe seulement l'id du livre sélectionné
            }, {
                headers: { "Content-Type": "application/json" },
            });

            setFeedback({ type: "success", message: "Exemplaire modifié avec succès !" });
            onSuccess();
        } catch (e) {
            console.error('Erreur modification:', e.response?.data || e.message);
            setFeedback({ type: "error", message: "Erreur lors de la modification" });
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélecteur de livre */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un Livre</label>
                <Combobox value={formData.book} onChange={(book) => {
                    setFormData(prev => ({ ...prev, book: book }));
                    setQuery(book?.title || "");
                }}>
                    <div className="relative">
                        <Combobox.Input
                            className={inputClasses}
                            placeholder="Tape un titre..."
                            onChange={(e) => setQuery(e.target.value)}
                            displayValue={(book) => book?.title || ""}
                        />
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredBooks.map((book) => (
                                <Combobox.Option
                                    key={book.id}
                                    value={book}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                            active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {book.title} ({book.author})
                                        </span>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </div>
                </Combobox>
            </div>

            {/* Emplacement */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                />
            </div>

            {/* Statut */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="BORROWED">Emprunté</option>
                    <option value="DAMAGED">Endommagé</option>
                    <option value="LOST">Perdu</option>
                </select>
            </div>

            {/* Date d'acquisition */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'acquisition</label>
                <input
                    type="date"
                    name="acquisitionDate"
                    value={formData.acquisitionDate}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                />
            </div>

            {/* Condition */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">État du livre</label>
                <select
                    name="conditionRating"
                    value={formData.conditionRating}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                >
                    <option value="">Sélectionner</option>
                    <option value="10">Neuf</option>
                    <option value="8">Bon état</option>
                    <option value="6">Usagé</option>
                    <option value="4">Mauvais état</option>
                </select>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`text-sm p-2 rounded ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {feedback.message}
                </div>
            )}

            {/* Bouton Submit */}
            <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2 px-4 text-white rounded-md shadow ${
                    isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                } transition-colors`}
            >
                {isLoading ? "Envoi en cours..." : "Modifier l'exemplaire"}
            </motion.button>
        </form>
    );
};

export default FormEditBookCopy;