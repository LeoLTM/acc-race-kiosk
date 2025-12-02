import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type LapTime } from '@/lib/api'
import { socket } from '@/lib/socket'

export function useLapTimes() {
  const queryClient = useQueryClient()

  const query = useQuery<LapTime[]>({
    queryKey: ['lap-times'],
    queryFn: api.getLapTimes,
  })

  useEffect(() => {
    function onLapTimesUpdate() {
      // Invalidate and refetch lap times when update event received
      queryClient.invalidateQueries({ queryKey: ['lap-times'] })
    }

    socket.on('lap-times-update', onLapTimesUpdate)

    return () => {
      socket.off('lap-times-update', onLapTimesUpdate)
    }
  }, [queryClient])

  return query
}
