'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

/**
 * Composant pour afficher un contenu spécifique si l'utilisateur n'est pas authentifié
 * ou afficher les enfants si l'utilisateur est authentifié
 */
const AuthCheck = ({ 
  children, 
  fallback = (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Accès restreint</h3>
      <p className="text-gray-600 mb-4 text-center">
        Vous devez être connecté pour accéder à cette page.
      </p>
      <Link 
        href="/auth/login" 
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Se connecter
      </Link>
    </div>
  )
}) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return status === 'authenticated' ? children : fallback;
};

export default AuthCheck;
