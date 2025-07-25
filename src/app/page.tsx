import { Icon, HealthIcon, RoleIcon, SportIcon } from "@/components/ui/icon";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Icon name="heart" className="text-red-500" size="2xl" />
            <h1 className="text-4xl font-bold text-gray-800">VigorLog</h1>
          </div>
          <p className="text-lg text-gray-600">
            Athleten-Monitoring für Jugendliche
          </p>
        </div>

        {/* User Roles Demo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="athlete" className="text-blue-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Athlet</h3>
            <p className="text-sm text-gray-600">Daily Check-in</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="coach" className="text-green-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Coach</h3>
            <p className="text-sm text-gray-600">Team Dashboard</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="parent" className="text-purple-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Eltern</h3>
            <p className="text-sm text-gray-600">Kind-Übersicht</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="admin" className="text-orange-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Admin</h3>
            <p className="text-sm text-gray-600">Vereinsverwaltung</p>
          </div>
        </div>

        {/* Health Metrics Demo */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Icon name="chart" className="text-blue-600" />
            Gesundheitsmetriken
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <HealthIcon metric="sleep" className="text-blue-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Schlaf</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <HealthIcon metric="fatigue" className="text-orange-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Müdigkeit</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <HealthIcon metric="mood" className="text-yellow-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Stimmung</p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <HealthIcon metric="pain" className="text-red-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Schmerzen</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <HealthIcon metric="heart" className="text-green-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Herz-Rate</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Icon name="chart" className="text-purple-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Trends</p>
            </div>
          </div>
        </div>

        {/* Sports Demo */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Icon name="running" className="text-green-600" />
            Unterstützte Sportarten
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="fußball" className="text-green-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Fußball</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="basketball" className="text-orange-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Basketball</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="tennis" className="text-yellow-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Tennis</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="baseball" className="text-red-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Baseball</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="football" className="text-amber-700 mb-2" size="xl" />
              <p className="text-sm font-medium">Football</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="squash" className="text-purple-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Squash</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="schwimmen" className="text-blue-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Schwimmen</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}