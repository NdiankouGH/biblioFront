"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Combobox } from "@headlessui/react";
import axios from "axios";

const FormBookCopy = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        acquisitionDate: '',
        conditionRating: '',
        location: '',
        status: '',
        bookId: '',
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/book/listBooks`);
                setBooks(res.data);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBooks();
    }, []);

    // Liste filtrée pour l'autocomplete
    const filteredBooks = query === ""
        ? books
        : books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!selectedBook) {
            setFeedback({ type: "error", message: "Sélectionne un livre." });
            setLoading(false);
            return;
        }

        try {
            const buildPayload = () => ({
                ...formData,
                title: selectedBook.title,
                book: {
                    id: selectedBook.id
                }
            });

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bookCopy/add`, buildPayload(), {
                headers: { "Content-Type": "application/json" },
            });

            setFeedback({ type: "success", message: "Exemplaire ajouté avec succès." });            setFormData({
                title: '',
                acquisitionDate: '',
                conditionRating: '',
                location: '',
                status: 'AVAILABLE',
                bookId: '',
            });
            setSelectedBook(null);
            setQuery("");
            
            // Appeler la fonction onSuccess pour rafraîchir la liste
            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error('Erreur lors de l\'ajout :', error.response?.data || error.message);
            alert(`Erreur : ${error.response?.data?.message || "Une erreur est survenue."}`);
        } finally {
            setLoading(false);
        }
    };



    const inputClasses = "mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-300";

    return (
        <div className="max-w-lg mx-auto">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
            >
                {/* Recherche Livre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un Livre</label>
                    <Combobox value={selectedBook} onChange={setSelectedBook}>
                        <div className="relative">
                            <Combobox.Input
                                className={inputClasses}
                                placeholder="Tape un titre..."
                                onChange={(e) => setQuery(e.target.value)}
                                displayValue={(book) => book?.title || ""}
                            />
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredBooks.length === 0 && query !== "" ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Aucun livre trouvé.
                                    </div>
                                ) : (
                                    filteredBooks.map((book) => (
                                        <Combobox.Option
                                            key={book.id}
                                            value={book}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {book.title} ({book.author})
                                                </span>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
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
                        placeholder="Ex: Rayonnage A3"
                        required
                        className={inputClasses}
                    />
                </div>

                {/* Statut */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut de l'exemplaire</label>
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

                {/* Date acquisition */}
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

                {/* Etat (Condition Rating) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">État du livre</label>
                    <select
                        name="conditionRating"
                        value={formData.conditionRating}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    >
                        <option value="">Sélectionner l'état</option>
                        <option value="10">Neuf</option>
                        <option value="8">Bon état</option>
                        <option value="6">Usagé</option>
                        <option value="4">Mauvais état</option>
                    </select>
                </div>

                {feedback && (
                    <div className={`text-sm p-2 rounded ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {feedback.message}
                    </div>
                )}

                {/* Bouton envoyer */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                        loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Ajout...' : 'Ajouter l\'exemplaire'}
                </motion.button>
            </motion.form>
        </div>
    );
};

export default FormBookCopy;
