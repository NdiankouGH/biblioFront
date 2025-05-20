"use client";
import { useEffect, useState } from "react";
import AuthCheck from "../components/utils/AuthCheck";
import axios from "axios";
import { useSession } from "next-auth/react"; // Utiliser useSession au lieu de useAuth

export default function ProfilPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    biblioName: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Mettre à jour le formulaire lorsque les données utilisateur sont chargées
  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const initializeUserData = async () => {
      try {
        const userData = session.user;
        
        if (userData) {
          console.log("Données utilisateur récupérées:", userData);
          setForm({
            nom: userData.nom || "",
            prenom: userData.prenom || "",
            email: userData.email || "",
            telephone: userData.telephone || "",
            biblioName: userData.biblioName || ""
          });
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation des données:', err);
        setError('Erreur lors de la récupération des données utilisateur');
      }
    };

    initializeUserData();
  }, [session?.user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    
    try {
      if (!session?.user?.id) {
        throw new Error('Utilisateur non connecté');
      }

      console.log("Envoi des données de mise à jour:", form);
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/edit/${session.user.id}`, form, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Réponse de mise à jour:", response.data);
      setSuccess("Profil mis à jour !");
      setForm({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        biblioName: form.biblioName
      });
      setEditMode(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;
    
    setLoading(true);
    setError("");
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Rediriger ou déconnecter l'utilisateur après suppression
      window.location.href = "/logout";
    } catch (err) {
      console.error("Erreur lors de la suppression du compte:", err);
      setError("Une erreur est survenue lors de la suppression du compte.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <AuthCheck>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                {editMode ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                      readOnly
                    />
                    <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={form.prenom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={form.telephone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bibliothèque</label>
                    <input
                      type="text"
                      name="biblioName"
                      value={form.biblioName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      readOnly
                    />
                    <p className="text-xs text-gray-400 mt-1">Le nom de la bibliothèque ne peut pas être modifié.</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Email</div>
                  <div className="font-medium">{form.email || <span className="italic text-gray-400">Non renseigné</span>}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Nom</div>
                  <div className="font-medium">{form.nom || <span className="italic text-gray-400">Non renseigné</span>}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Prénom</div>
                  <div className="font-medium">{form.prenom || <span className="italic text-gray-400">Non renseigné</span>}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Téléphone</div>
                  <div className="font-medium">{form.telephone || <span className="italic text-gray-400">Non renseigné</span>}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Bibliothèque</div>
                  <div className="font-medium">{form.biblioName || <span className="italic text-gray-400">Non renseigné</span>}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AuthCheck>
    </div>
  );
}