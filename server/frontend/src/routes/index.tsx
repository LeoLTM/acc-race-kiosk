import { createFileRoute, Link } from '@tanstack/react-router'
import { Flag, Gauge, UserPlus, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Flag className="w-24 h-24 text-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent">
            Assetto Corsa Race Kiosk
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            Welcome to the ultimate racing experience. Join the queue, hit the
            track, and compete for glory!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Link to="/register" className="block group">
            <Card className="bg-gradient-to-br from-red-600 to-red-800 border-red-500/50 hover:border-red-400 hover:scale-105 transition-all duration-300 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-white text-3xl">
                  <UserPlus className="w-12 h-12" />
                  Register
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-200 text-lg">
                  New here? Sign up and get assigned to a racing rig. Start your
                  journey to the podium!
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard" className="block group">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-red-500/50 hover:scale-105 transition-all duration-300 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-white text-3xl">
                  <Gauge className="w-12 h-12 text-cyan-400" />
                  Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-200 text-lg">
                  Check the live status of all racing rigs, current drivers, and
                  queue positions.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/lap-times" className="block group">
            <Card className="bg-gradient-to-br from-amber-600 to-yellow-700 border-amber-500/50 hover:border-yellow-400 hover:scale-105 transition-all duration-300 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-white text-3xl">
                  <Trophy className="w-12 h-12" />
                  Lap Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-200 text-lg">
                  View the leaderboard and see who holds the fastest lap times
                  on the track!
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
