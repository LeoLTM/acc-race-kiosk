import { createFileRoute } from '@tanstack/react-router'
import { Flag, Gauge, Users } from 'lucide-react'
import { useDashboard } from '../hooks/useQueue'
import { RigState } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/Footer'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data, isLoading, isError } = useDashboard(1000) // Poll every 1 second

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Gauge className="w-24 h-24 mx-auto mb-6 animate-spin text-primary" />
            <p className="text-3xl font-bold text-foreground">Loading Dashboard...</p>
          </div>
        </div>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Flag className="w-24 h-24 mx-auto mb-6 text-destructive" />
            <p className="text-3xl font-bold text-destructive">Connection Lost</p>
            <p className="text-muted-foreground mt-4 text-xl">Reconnecting...</p>
          </div>
        </div>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Fully Responsive Grid - Adapts to number of rigs */}
      <div className={`flex-1 p-6 overflow-y-auto overflow-x-hidden`}>
        <div className={`h-full grid gap-6 ${
          data.rigs.length === 1 ? 'grid-cols-1' :
          data.rigs.length === 2 ? 'grid-cols-2' :
          data.rigs.length === 3 ? 'grid-cols-3' :
          data.rigs.length === 4 ? 'grid-cols-2 grid-rows-2' :
          data.rigs.length === 5 ? 'grid-cols-3 grid-rows-2' :
          data.rigs.length === 6 ? 'grid-cols-3 grid-rows-2' :
          'grid-cols-4 auto-rows-fr'
        }`}>
          {data.rigs.map((rig) => (
            <RigCard key={rig.id} rig={rig} rigCount={data.rigs.length} />
          ))}
        </div>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

interface RigCardProps {
  rig: {
    id: number
    state: RigState
    currentPlayer: {
      id: string
      name: string
      joinedAt: string
    } | null
    queue: Array<{
      id: string
      name: string
      joinedAt: string
    }>
  }
  rigCount: number
}

function RigCard({ rig, rigCount }: RigCardProps) {
  const isRacing = rig.state === RigState.RACING
  // A rig is waiting for a player when it's FREE and has someone in the queue
  const isWaitingForPlayer = !isRacing && rig.queue.length > 0
  
  // Adjust sizes based on number of rigs for better space utilization
  const isCompact = rigCount > 4
  const queueItemsToShow = rigCount <= 2 ? 5 : rigCount <= 4 ? 4 : 3

  return (
    <Card className={`h-full flex flex-col transition-all duration-500 ${
      isCompact ? 'border-2' : 'border-4'
    } ${
      isWaitingForPlayer
        ? 'border-amber-500 shadow-lg'
        : isRacing 
        ? 'border-primary shadow-md' 
        : 'border-green-500 shadow-md'
    }`}>
      <CardHeader className={isCompact ? 'pb-3' : 'pb-6'}>
        <div className="flex items-center justify-between">
          <CardTitle className={`font-bold flex items-center gap-4 text-foreground ${
            isCompact ? 'text-4xl' : rigCount <= 2 ? 'text-7xl' : 'text-6xl'
          }`}>
            <div className={`rounded-full ${
              isCompact ? 'w-5 h-5' : 'w-8 h-8'
            } ${
              isWaitingForPlayer 
                ? 'bg-amber-500 animate-pulse' 
                : isRacing 
                ? 'bg-primary animate-pulse' 
                : 'bg-green-500'
            }`}></div>
            RIG {rig.id}
          </CardTitle>
          <Badge 
            variant={isRacing ? 'default' : 'secondary'}
            className={`font-bold ${
              isCompact ? 'text-lg px-4 py-2' : 'text-3xl px-8 py-4'
            } ${
              isWaitingForPlayer
                ? 'bg-amber-500 text-white border-amber-600'
                : isRacing 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-green-500 text-white border-green-600'
            }`}
          >
            {isWaitingForPlayer ? '⚠️ READY!' : isRacing ? '🏁 RACING' : '✓ FREE'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={`flex-1 flex flex-col overflow-hidden ${
        isCompact ? 'space-y-3' : 'space-y-6'
      }`}>
        {/* Current Player - Responsive Size with Attention-Grabbing Style */}
        <div className={`rounded-lg flex-shrink-0 ${
          isCompact ? 'p-4 border-2' : 'p-8 border-4'
        } ${
          isWaitingForPlayer
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500'
            : isRacing 
            ? 'bg-primary/10 border-primary/50' 
            : 'bg-muted border-border'
        }`}>
          <p className={`uppercase tracking-wider font-bold ${
            isWaitingForPlayer ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
          } ${
            isCompact ? 'text-base mb-2' : 'text-3xl mb-4'
          }`}>
            {isWaitingForPlayer 
              ? '👉 PLAYER PLEASE COME TO THIS RIG!' 
              : isRacing 
              ? '🏎️ Current Driver' 
              : '⏳ Waiting for Players'}
          </p>
          {isRacing && rig.currentPlayer ? (
            <div className="flex items-center gap-4">
              <Flag className={`text-primary flex-shrink-0 ${
                isCompact ? 'w-6 h-6' : 'w-12 h-12'
              }`} />
              <span className={`font-bold text-foreground truncate ${
                isCompact ? 'text-2xl' : rigCount <= 2 ? 'text-6xl' : 'text-5xl'
              }`}>{rig.currentPlayer.name}</span>
            </div>
          ) : isWaitingForPlayer && rig.queue[0] ? (
            <div className="flex items-center gap-4">
              <Flag className={`text-amber-500 animate-bounce flex-shrink-0 ${
                isCompact ? 'w-6 h-6' : 'w-12 h-12'
              }`} />
              <span className={`font-bold text-foreground truncate ${
                isCompact ? 'text-2xl' : rigCount <= 2 ? 'text-6xl' : 'text-5xl'
              }`}>{rig.queue[0].name}</span>
            </div>
          ) : (
            <p className={`text-muted-foreground italic ${
              isCompact ? 'text-xl' : 'text-4xl'
            }`}>No players in queue</p>
          )}
        </div>

        {/* Queue - Responsive and Scrollable if needed */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className={`flex items-center justify-between flex-shrink-0 ${
            isCompact ? 'mb-2' : 'mb-4'
          }`}>
            <p className={`text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-2 ${
              isCompact ? 'text-base' : 'text-2xl'
            }`}>
              <Users className={isCompact ? 'w-4 h-4' : 'w-6 h-6'} />
              {isWaitingForPlayer ? 'Coming Next' : 'Next Up'}
            </p>
            <Badge variant="outline" className={`border-amber-400 text-amber-600 dark:text-amber-400 font-bold ${
              isCompact ? 'text-sm px-3 py-1' : 'text-xl px-4 py-2'
            }`}>
              {isWaitingForPlayer ? rig.queue.length - 1 : rig.queue.length} waiting
            </Badge>
          </div>
          
          {rig.queue.length > 0 ? (
            <div className={`flex-1 overflow-y-auto ${
              isCompact ? 'space-y-2' : 'space-y-3'
            }`}>
              {/* If waiting for player, show queue starting from position 2 (skip first), otherwise show all */}
              {rig.queue.slice(isWaitingForPlayer ? 1 : 0, isWaitingForPlayer ? queueItemsToShow + 1 : queueItemsToShow).map((player, index) => {
                const displayPosition = isWaitingForPlayer ? index + 2 : index + 1;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 bg-muted rounded-lg border-2 border-border hover:border-primary/50 transition-all ${
                      isCompact ? 'p-2' : 'p-4'
                    }`}
                  >
                    <Badge 
                      variant="outline" 
                      className={`border-amber-400 text-amber-600 dark:text-amber-400 font-bold justify-center flex-shrink-0 ${
                        isCompact ? 'text-base px-2 py-1 min-w-[40px]' : 'text-2xl px-4 py-2 min-w-[70px]'
                      }`}
                    >
                      #{displayPosition}
                    </Badge>
                    <span className={`text-foreground font-medium truncate ${
                      isCompact ? 'text-lg' : rigCount <= 2 ? 'text-3xl' : 'text-2xl'
                    }`}>{player.name}</span>
                  </div>
                );
              })}
              {rig.queue.length > (isWaitingForPlayer ? queueItemsToShow + 1 : queueItemsToShow) && (
                <p className={`text-muted-foreground text-center pt-2 font-semibold ${
                  isCompact ? 'text-sm' : 'text-xl'
                }`}>
                  + {rig.queue.length - (isWaitingForPlayer ? queueItemsToShow + 1 : queueItemsToShow)} more in queue
                </p>
              )}
            </div>
          ) : (
            <div className={`text-center bg-muted rounded-lg border-4 border-dashed border-border flex-1 flex flex-col items-center justify-center ${
              isCompact ? 'py-6' : 'py-12'
            }`}>
              <p className={`text-muted-foreground font-bold ${
                isCompact ? 'text-xl' : 'text-3xl'
              }`}>Queue Empty</p>
              <p className={`text-muted-foreground/60 mt-2 ${
                isCompact ? 'text-base' : 'text-xl'
              }`}>Ready for new players!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
