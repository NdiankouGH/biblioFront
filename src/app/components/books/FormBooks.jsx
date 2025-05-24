"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from "axios";

const FormBooks = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        isbn: '',
        publisher: '',
        publicationDate: '',
        category: '',
        totalCopies: '',
        availableCopies: '',
    });

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/book/addBook`, formData, {
                headers: { "Content-Type": "application/json" },
            });
            setFeedback({ type: 'success', message: 'Livre ajouté avec succès !' });
            setFormData({
                title: '',
                author: '',
                description: '',
                isbn: '',
                publisher: '',
                publicationDate: '',
                category: '',
                totalCopies: '',
                availableCopies: '',
            });
            
            // Appeler la fonction onSuccess pour rafraîchir la liste
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Erreur lors de l\'ajout.';
            setFeedback({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = 'mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-300';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" placeholder="Titre" value={formData.title} onChange={handleChange} required className={inputClasses} />
            <input name="author" placeholder="Auteur" value={formData.author} onChange={handleChange} required className={inputClasses} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className={`${inputClasses} h-24`} />
            <input name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} required className={inputClasses} />
            <input name="publisher" placeholder="Éditeur" value={formData.publisher} onChange={handleChange} required className={inputClasses} />
            <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} required className={inputClasses} />
            <input name="category" placeholder="Catégorie" value={formData.category} onChange={handleChange} required className={inputClasses} />
            <input type="number" name="totalCopies" placeholder="Nombre d'exemplaires" value={formData.totalCopies} onChange={handleChange} required className={inputClasses} />
            <input type="number" name="availableCopies" placeholder="Copies disponibles" value={formData.availableCopies} onChange={handleChange} required className={inputClasses} />

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
                {loading ? 'Envoi...' : 'Ajouter le livre'}
            </motion.button>
        </form>
    );
};

export default FormBooks;
