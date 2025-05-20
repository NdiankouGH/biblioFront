"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AuthCheck from "./components/utils/AuthCheck";
import DashboardContent from "./components/DashboardContent";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        setError('URL de l\'API non configurée');
        setLoading(false);
        return;
      }

      // Vérifions la structure de la session pour le débogage
      console.log("Session actuelle:", session);

      // Récupération du token - adapté selon la structure de votre session
      const token = session?.accessToken || session?.token || session?.user?.token;
      
      if (!token) {
        console.warn("Token d'authentification introuvable dans la session:", session);
      }

      try {
        const endpoints = [
          `${apiUrl}/api/book/listBooks`,
          `${apiUrl}/api/bookCopy/list`,
          `${apiUrl}/api/members/listMember`,
          `${apiUrl}/api/loan/listLoan`
        ];

        // Utilisation des en-têtes avec ou sans token
        const headers = token 
          ? { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          : { 
              'Content-Type': 'application/json' 
            };

        console.log("En-têtes utilisés:", headers);

        const responses = await Promise.all(
          endpoints.map(url => 
            fetch(url, { 
              headers,
              credentials: 'include' // Inclut les cookies pour l'authentification si nécessaire
            })
          )
        );

        // Vérifier les réponses individuellement
        const responseStatuses = responses.map((res, i) => {
          return {
            endpoint: endpoints[i],
            status: res.status,
            ok: res.ok
          };
        });
        
        console.log("Statuts des réponses:", responseStatuses);

        // Vérifier s'il y a des erreurs
        const failedResponse = responses.find(res => !res.ok);
        if (failedResponse) {
          const errorText = await failedResponse.text();
          throw new Error(`Erreur API: ${failedResponse.status} - ${errorText || 'Aucun détail'}`);
        }

        const [books, copies, members, loans] = await Promise.all(
          responses.map(res => res.json())
        );

        // Adaptation aux différentes structures de réponse possibles
        const booksData = books?.data || books || [];
        const copiesData = copies?.data || copies || [];
        const membersData = members?.data || members || [];
        const loansData = loans?.data || loans || [];

        // Calcul des statistiques
        const booksCount = Array.isArray(booksData) ? booksData.length : 0;
        const bookCopiesCount = Array.isArray(copiesData) ? copiesData.length : 0;
        const usersCount = Array.isArray(membersData) ? membersData.length : 0;
        const loansCount = Array.isArray(loansData) 
          ? loansData.filter(l => l.status !== 'Retourné').length
          : 0;
        const lateCount = Array.isArray(loansData) 
          ? loansData.filter(l => l.isLate).length 
          : 0;
        
        // Activité récente
        const recentActivity = Array.isArray(loansData)
          ? loansData
              .sort((a, b) => new Date(b.loanDate || b.date || Date.now()) - new Date(a.loanDate || a.date || Date.now()))
              .slice(0, 5)
              .map(l => ({ 
                type: l.status === 'Retourné' ? 'return' : 'loan', 
                title: l.bookTitle || (l.book && l.book.title) || 'N/A', 
                user: l.memberName || (l.member && l.member.name) || 'N/A',
                date: new Date(l.loanDate || l.date || Date.now()).toLocaleDateString()
              }))
          : [];

        setData({
          booksCount, 
          bookCopiesCount,
          usersCount,
          loansCount,
          lateCount,
          recentActivity,
        });
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', {
          message: err.message,
          apiUrl: apiUrl
        });
        setError(`Erreur de chargement des statistiques: ${err.message}`);
        setLoading(false);
      }
    };

    // Ne lancer l'appel API que lorsque la session est chargée et que nous sommes authentifiés
    if (status === 'authenticated') {
      fetchData();
    } else if (status === 'unauthenticated') {
      // Si explicitement non authentifié, afficher un message (bien que AuthCheck devrait gérer cela)
      setLoading(false);
      setError('Authentification requise');
    }
  }, [session, status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthCheck>
      <div className="p-8 font-sans">
        <DashboardContent data={data} />
      </div>
    </AuthCheck>
  );
}