"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const FormEditMember = ({ selectedMember, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        registrationDate: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (selectedMember) {
            setFormData({
                id: selectedMember.id,
                name: selectedMember.name || "",
                address: selectedMember.address || "",
                phoneNumber: selectedMember.phoneNumber || "",
                registrationDate: selectedMember.registrationDate?.slice(0, 10) || "",
                isActive: selectedMember.isActive ?? true,
            });
        }
    }, [selectedMember]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/members/update/${formData.id}`, formData, {
                headers: { "Content-Type": "application/json" },
            });
            setFeedback({ type: "success", message: "Lecteur mis à jour avec succès." });
            onSuccess(); // Fermer le Dialog et rafraîchir la liste
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            setFeedback({ type: "error", message: "Erreur lors de la mise à jour." });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "mt-1 h-10 px-3 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
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
                <label className="text-sm text-gray-700">Lecteur Actif</label>
            </div>

            {feedback && (
                <div className={`text-sm p-2 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                </div>
            )}

            <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {loading ? "Envoi..." : "Mettre à jour le lecteur"}
            </motion.button>
        </motion.form>
    );
};

export default FormEditMember;
