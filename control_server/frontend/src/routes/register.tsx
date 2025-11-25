import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Flag, User, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import { useJoinQueue } from '../hooks/useQueue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [playerName, setPlayerName] = useState('')
  const joinQueueMutation = useJoinQueue()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim().length >= 1 && playerName.trim().length <= 50) {
      joinQueueMutation.mutate(playerName.trim())
    }
  }

  const isSuccess = joinQueueMutation.isSuccess
  const isLoading = joinQueueMutation.isPending
  const isError = joinQueueMutation.isError

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black text-white flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="max-w-3xl w-full relative z-10">
        {/* Success State */}
        {isSuccess && joinQueueMutation.data && (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-green-500 border-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-green-500/20">
            <CardContent className="pt-10 pb-10 px-6 md:px-8">
              <CheckCircle className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-8 text-green-400 animate-in zoom-in duration-700 animate-[pulse_2s_ease-in-out_infinite]" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-green-400 leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                Registration Successful!
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                Welcome to the track, <span className="font-bold text-white">{playerName}</span>!
              </p>

              <div className="bg-gray-900/70 rounded-xl p-8 mb-8 border-2 border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500 hover:border-gray-600 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="py-4 group hover:scale-105 transition-transform duration-300">
                    <p className="text-gray-400 text-xl mb-3 font-semibold">Your Rig</p>
                    <p className="text-6xl md:text-7xl font-bold text-red-400 group-hover:text-red-300 transition-colors">
                      #{joinQueueMutation.data.rigId}
                    </p>
                  </div>
                  <div className="py-4 group hover:scale-105 transition-transform duration-300">
                    <p className="text-gray-400 text-xl mb-3 font-semibold">Queue Position</p>
                    <p className="text-6xl md:text-7xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                      {joinQueueMutation.data.queuePosition === 0 
                        ? 'Next!' 
                        : `#${joinQueueMutation.data.queuePosition}`}
                    </p>
                  </div>
                  <div className="py-4 group hover:scale-105 transition-transform duration-300">
                    <p className="text-gray-400 text-xl mb-3 font-semibold">Player ID</p>
                    <p className="text-lg font-mono text-gray-300 mt-3 break-all leading-relaxed group-hover:text-white transition-colors">
                      {joinQueueMutation.data.playerId}
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="bg-yellow-500/10 border-yellow-500/30 border-2 mb-8 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700">
                <AlertCircle className="h-8 w-8 text-yellow-300" />
                <div className="text-yellow-300 text-xl leading-relaxed">
                  <strong className="text-2xl">Next Steps:</strong>
                  <p className="mt-2">Head to Rig #{joinQueueMutation.data.rigId} and wait for your turn. 
                  The rig operator will call you when it's time to race!</p>
                </div>
              </Alert>

              <Button
                onClick={() => {
                  setPlayerName('')
                  joinQueueMutation.reset()
                }}
                size="lg"
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-2xl py-8 px-12 h-auto min-h-[80px] w-full md:w-auto touch-manipulation animate-in fade-in slide-in-from-bottom-2 duration-500 delay-1000 hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-red-500/50"
              >
                Register Another Player
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        {!isSuccess && (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 border-4 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-red-500/10 hover:border-gray-600 transition-all">
            <CardHeader className="text-center pt-10 pb-8">
              <Flag className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 text-red-500 animate-in zoom-in duration-700 animate-[pulse_2s_ease-in-out_infinite]" />
              <CardTitle className="text-5xl md:text-6xl text-white font-bold leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">Join the Race</CardTitle>
              <CardDescription className="text-gray-400 text-2xl md:text-3xl mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                Enter your name to get in the queue
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 md:px-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
                  <label
                    htmlFor="playerName"
                    className="block text-2xl font-bold text-gray-300 mb-4 uppercase tracking-wide"
                  >
                    Driver Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-8 h-8 z-10 group-focus-within:text-red-400 transition-colors duration-300" />
                    <Input
                      type="text"
                      id="playerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      minLength={1}
                      maxLength={50}
                      required
                      disabled={isLoading}
                      className="pl-20 pr-6 py-8 bg-gray-900/70 border-gray-700 border-2 text-white placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-3xl h-auto rounded-xl touch-manipulation transition-all duration-300 hover:border-gray-600 focus:scale-[1.02]"
                    />
                  </div>
                  <p className="text-lg text-gray-500 mt-4 leading-relaxed">
                    1-50 characters • This name will appear on the leaderboards
                  </p>
                </div>

                {isError && (
                  <Alert className="bg-red-500/10 border-red-500 border-2 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                    <div>
                      <p className="font-bold text-red-400 text-2xl">Registration Failed</p>
                      <p className="text-xl text-gray-300 mt-2 leading-relaxed">
                        {joinQueueMutation.error?.message || 'An error occurred. Please try again.'}
                      </p>
                    </div>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    playerName.trim().length < 1 ||
                    playerName.trim().length > 50
                  }
                  className="w-full py-8 h-auto min-h-[90px] bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold text-3xl rounded-xl touch-manipulation transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-red-500/50 disabled:hover:scale-100 animate-in fade-in slide-in-from-bottom-2 delay-700"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-10 h-10 animate-spin mr-3" />
                      Joining Queue...
                    </>
                  ) : (
                    <>
                      <Flag className="w-10 h-10 mr-3 group-hover:animate-pulse" />
                      Join the Queue
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-10 pt-8 border-t-2 border-gray-700 animate-in fade-in duration-500 delay-1000">
                <h3 className="text-2xl font-bold text-gray-400 uppercase tracking-wide mb-6">
                  Track Rules
                </h3>
                <ul className="space-y-5 text-xl text-gray-400 leading-relaxed">
                  <li className="flex items-start gap-4 group hover:text-gray-300 transition-colors duration-300">
                    <Badge variant="outline" className="text-red-500 border-red-500 text-3xl px-3 py-1 mt-1 group-hover:bg-red-500/10 transition-colors">•</Badge>
                    <span>Be present at your assigned rig when called</span>
                  </li>
                  <li className="flex items-start gap-4 group hover:text-gray-300 transition-colors duration-300">
                    <Badge variant="outline" className="text-red-500 border-red-500 text-3xl px-3 py-1 mt-1 group-hover:bg-red-500/10 transition-colors">•</Badge>
                    <span>Respect other drivers and track officials</span>
                  </li>
                  <li className="flex items-start gap-4 group hover:text-gray-300 transition-colors duration-300">
                    <Badge variant="outline" className="text-red-500 border-red-500 text-3xl px-3 py-1 mt-1 group-hover:bg-red-500/10 transition-colors">•</Badge>
                    <span>Each session is limited to maintain fair queue times</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
