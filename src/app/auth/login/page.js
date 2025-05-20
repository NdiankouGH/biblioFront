"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validation de l'email avec regex
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation côté client
    if (!email.trim()) {
      setError("Veuillez entrer votre adresse email");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Veuillez entrer votre mot de passe");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Traiter les différents types d'erreurs
        if (result.error.includes("ID utilisateur manquant") || 
            result.error.includes("Email utilisateur manquant") || 
            result.error.includes("Token d'authentification manquant")) {
          setError("Problème avec la réponse du serveur. Veuillez contacter l'administrateur.");
        } else if (result.error.includes("Format de réponse invalide")) {
          setError("Problème de communication avec le serveur. Veuillez réessayer plus tard.");
        } else {
          setError(result.error || "Email ou mot de passe incorrect");
        }
        console.error("Erreur d'authentification:", result.error);
      } else if (result?.ok) {
        // Redirection vers la page d'accueil après connexion réussie
        router.push("/");
        router.refresh();
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur de connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <div role="alert" className="alert alert-error absolute top-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Connexion</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
              <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                placeholder="mail@adresse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
              />
            </div>
          </motion.div>

          {/* Mot de passe */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-gray-700 mb-1">Mot de passe</label>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
              <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
              />
            </div>
          </motion.div>

          {/* Bouton de connexion */}
          <motion.button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            disabled={loading}
          >
            {loading ? <span className="loading loading-dots loading-md"></span> : 'Se connecter'}
          </motion.button>

          {/* Lien pour créer un compte */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-gray-600">
              Pas encore de compte?{" "}
              <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-800">
                Créer un compte
              </Link>
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
}