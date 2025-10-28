import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      title: 'Revenus totaux',
      value: '45 231 €',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Utilisateurs',
      value: '2 350',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Ventes',
      value: '12 234',
      change: '-5.2%',
      trend: 'down',
      icon: TrendingUp,
    },
    {
      title: 'Activité',
      value: '89%',
      change: '+2.4%',
      trend: 'up',
      icon: Activity,
    },
  ];

  const recentActivity = [
    { id: 1, user: 'Marie Dupont', action: 'Nouveau compte créé', time: 'Il y a 5 min' },
    { id: 2, user: 'Jean Martin', action: 'Achat effectué', time: 'Il y a 12 min' },
    { id: 3, user: 'Sophie Bernard', action: 'Document téléchargé', time: 'Il y a 23 min' },
    { id: 4, user: 'Pierre Leroy', action: 'Commentaire ajouté', time: 'Il y a 1 heure' },
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Bienvenue sur votre tableau de bord
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.title}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Activité récente
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Actions rapides
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                Créer un projet
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                Inviter un membre
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                Générer un rapport
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                Voir les statistiques
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
