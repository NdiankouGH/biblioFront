"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Register = () => {
    const router = useRouter(); // Correction: Ajout de l'initialisation du router
    
    // Schéma de validation avec messages d'erreur précis
    const schema = z.object({
        telephone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 caractères'),
        prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
        nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
        biblioName: z.string().min(2, 'Le nom de la bibliothèque doit contenir au moins 2 caractères'),
        email: z.string().email('Email invalide'),
        password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
    
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');
            
            // Extraction des champs à envoyer
            const { confirmPassword, ...formData } = data;
            
            console.log("Données à envoyer:", formData); // Pour déboguer
            
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Réponse du serveur:", response.data);

            if (response.status >= 200 && response.status < 300) {
                setSuccess('Inscription réussie !');
                // Redirection après un court délai
                setTimeout(() => {
                    router.push('/auth/login');
                }, 1500);
            } else {
                throw new Error(response.data.message || 'Une erreur est survenue');
            }
        }
        catch (error) {
            console.error("Erreur d'inscription:", error);
            setError(error.response?.data?.message || "Une erreur est survenue lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "mt-1 h-10 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Créer un compte</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {success}
                        </p>
                    </div>
                )}
                
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input
                                {...register("prenom")}
                                className={`${inputClasses} ${errors.prenom ? "border-red-500" : ""}`}
                                placeholder="Votre prénom"
                            />
                            {errors.prenom && (
                                <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
                            )}
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                {...register("nom")}
                                className={`${inputClasses} ${errors.nom ? "border-red-500" : ""}`}
                                placeholder="Votre nom"
                            />
                            {errors.nom && (
                                <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                            )}
                        </motion.div>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Nom de la bibliothèque</label>
                        <input
                            {...register("biblioName")}
                            className={`${inputClasses} ${errors.biblioName ? "border-red-500" : ""}`}
                            placeholder="Nom de votre bibliothèque"
                        />
                        {errors.biblioName && (
                            <p className="mt-1 text-sm text-red-600">{errors.biblioName.message}</p>
                        )}
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                        <input
                            {...register("telephone")}
                            className={`${inputClasses} ${errors.telephone ? "border-red-500" : ""}`}
                            placeholder="Votre numéro de téléphone"
                        />
                        {errors.telephone && (
                            <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
                        )}
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={`${inputClasses} ${errors.email ? "border-red-500" : ""}`}
                            placeholder="votre.email@exemple.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        >
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input
                                type="password"
                                {...register("password")}
                                className={`${inputClasses} ${errors.password ? "border-red-500" : ""}`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                        >
                            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className={`${inputClasses} ${errors.confirmPassword ? "border-red-500" : ""}`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </motion.div>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                        className="pt-2"
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md 
                                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                     transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Inscription en cours...
                                </span>
                            ) : (
                                "S'inscrire"
                            )}
                        </button>
                    </motion.div>
                </motion.form>
                
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    className="mt-6 text-center"
                >
                    <p className="text-sm text-gray-600">
                        Vous avez déjà un compte ?{" "}
                        <Link href="/auth/login" className="text-indigo-600 hover:underline font-medium">
                            Se connecter
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;