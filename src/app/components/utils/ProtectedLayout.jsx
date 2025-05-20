import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedLayout = ({ children }) => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(status === "loading") return;
        if(!session){
            // Redirection vers la page de connexion si non authentifié
            router.push("/auth/login");
        }else{
            // Session valide, arrêt du chargement
            setIsLoading(false);
        }
    }, [status, session, router]);

    // Affichage d'un état de chargement amélioré
    if(status === "loading" || (isLoading|| !session)){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-4 text-gray-600">Chargement de votre session...</p>
                </div>
            </div>
        )
    } 
    // Affichage du contenu protégé uniquement si l'utilisateur est authentifié
    return session ? children : null;
};

export default ProtectedLayout;