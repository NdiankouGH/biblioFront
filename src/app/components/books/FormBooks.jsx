"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const FormBooks = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        isbn: '',
        publisher: '',
        publicationDate: '',
        category: '',
        totalCopy: '',
        availableCopy: '',

    });

    const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

        try {
        const response = await axios.post(`${process.env.API_URL}/api/books/addBook`, formData, {
            headers: {"Content-Type": "application/json"},
        });
        const data = response.data;
        console.log(data);
          alert('Livre ajouté avec succès !');
          setFormData({   title: '', author: '', description: '', isbn: '', publisher: '', publicationDate: '', category: '', totalCopy: '', availableCopy: '',})

      }catch (e) {
            alert(`Erreur : ${error.response?.data?.message || "Une erreur est survenue."}`);
          console.log('Erreur lors de l\'ajout', e.response?.data || e.message);

      }finally {
          setLoading(false);
      }

    };

    const inputClasses =
        'mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-300';

    return (
        <div className="max-w-lg mx-auto ">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
                onSubmit={handleSubmit}
            >
                {/* Titre */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Titre
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </motion.div>

                {/* Auteur */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                        Auteur
                    </label>
                    <input
                        type="text"
                        name="author"
                        id="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </motion.div>

                {/* Description */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 px-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-300"
                    />
                </motion.div>

                {/* ISBN */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                        ISBN
                    </label>
                    <input
                        type="text"
                        name="isbn"
                        id="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </motion.div>

                {/* Publication Date */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700">
                        Date de publication
                    </label>
                    <input
                        type="date"
                        name="publicationDate"
                        id="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </motion.div>
                {/* Publication Date */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700">
                        Nombre d'exmplaire
                    </label>
                    <input
                        type="number"
                        name="totalCopy"
                        id="totalCopy"
                        value={formData.totalCopy}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </motion.div>


                {/* Bouton d'envoi */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                </motion.button>
            </motion.form>
        </div>
    );
};

export default FormBooks;
