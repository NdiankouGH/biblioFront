import { useSession } from "next-auth/react";

export default function DashboardContent({ data }) {
  const { data: session } = useSession();

  // Affichage d'informations de débogage pour comprendre la structure de session
  console.log("Session dans DashboardContent:", session);

  if (!data) return null;

  // Déterminer le nom de l'utilisateur en fonction de la structure de session
  const userName = () => {
    if (session?.user?.prenom && session?.user?.nom) {
      return `${session.user.prenom} ${session.user.nom}`;
    } else if (session?.user?.name) {
      return session.user.name;
    } else if (session?.user?.email) {
      // Fallback vers l'email sans le domaine
      return session.user.email.split('@')[0];
    } else {
      return "utilisateur";
    }
  };

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Bienvenue {userName()} !</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon="📚" color="text-blue-600" value={data.booksCount} label="Livres" />
        <StatCard icon="👤" color="text-blue-600" value={data.usersCount} label="Utilisateurs" />
        <StatCard icon="📕" color="text-red-400" value={data.loansCount} label="Emprunts en cours" />
        <StatCard icon="⚠️" color="text-yellow-400" value={data.lateCount} label="Retards" />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Activité récente</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Emprunts</h3>
            {data.recentActivity && data.recentActivity.filter(a => a.type === 'loan').length === 0 && (
              <div className="text-gray-400">Aucune activité récente</div>
            )}
            {data.recentActivity && data.recentActivity.filter(a => a.type === 'loan').map((item, idx) => (
              <div key={idx} className="mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="font-medium">{item.title}</div>
                <div className="text-gray-500 text-sm">Emprunté par {item.user}</div>
                {item.date && <div className="text-gray-400 text-xs mt-1">{item.date}</div>}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Retours</h3>
            {data.recentActivity && data.recentActivity.filter(a => a.type === 'return').length === 0 && (
              <div className="text-gray-400">Aucune activité récente</div>
            )}
            {data.recentActivity && data.recentActivity.filter(a => a.type === 'return').map((item, idx) => (
              <div key={idx} className="mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="font-medium">{item.title}</div>
                <div className="text-gray-500 text-sm">Retourné par {item.user}</div>
                {item.date && <div className="text-gray-400 text-xs mt-1">{item.date}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, value, label }) {
  return (
    <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center text-center">
      <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}