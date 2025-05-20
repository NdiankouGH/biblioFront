"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const FormMember = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        registrationDate: "",
        isActive: true,
    });

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/members/addMember`, formData);
            setFeedback({ type: "success", message: "Nouveau lecteur ajouté avec succès." });

        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ajout du membre.");
            console.log('Erreur lors de l\'ajout', error);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 shadow-sm";

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-white p-6 rounded-xl shadow-md"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Date d'inscription</label>
                <input
                    type="date"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                />
                <label className="text-sm">Actif</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
                {loading ? "Envoi..." : "Ajouter le membre"}
            </button>

            {feedback && (
                <div className={`text-sm p-2 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                </div>
                )}
        </motion.form>
    );
};

export default FormMember;
