"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const FormEditBook = ({ selectedBook, onSuccess }) => {
    const [formData, setFormData] = useState(selectedBook);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        setFormData(selectedBook);
    }, [selectedBook]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/book/updateBook`, formData, {
                headers: {"Content-Type": "application/json"},
            });
            setFeedback({ type: "success", message: "Livre modifié avec succès !" });
            onSuccess();
        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", message: "Erreur lors de la modification" });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = 'mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" placeholder="Titre" value={formData.title || ''} onChange={handleChange} className={inputClasses} />
            <input name="author" placeholder="Auteur" value={formData.author || ''} onChange={handleChange} className={inputClasses} />
            <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} className={`${inputClasses} h-24`} />
            <input name="isbn" placeholder="ISBN" value={formData.isbn || ''} onChange={handleChange} className={inputClasses} />
            <input name="publisher" placeholder="Éditeur" value={formData.publisher || ''} onChange={handleChange} className={inputClasses} />
            <input type="date" name="publicationDate" value={formData.publicationDate?.slice(0,10) || ''} onChange={handleChange} className={inputClasses} />
            <input name="category" placeholder="Catégorie" value={formData.category || ''} onChange={handleChange} className={inputClasses} />
            <input type="number" name="totalCopies" placeholder="Nombre d'exemplaires" value={formData.totalCopies || 0} onChange={handleChange} className={inputClasses} />
            <input type="number" name="availableCopies" placeholder="Copies disponibles" value={formData.availableCopies || 0} onChange={handleChange} className={inputClasses} />

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
                {loading ? 'Envoi...' : 'Modifier le livre'}
            </motion.button>
        </form>
    );
};

export default FormEditBook;
