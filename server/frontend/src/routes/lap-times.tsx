import { createFileRoute, Link } from '@tanstack/react-router'
import { Trophy, ArrowLeft } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { useLapTimes } from '@/hooks/useLapTimes'
import { ConnectionIndicator } from '@/components/ConnectionIndicator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { LapTime } from '@/lib/api'

export const Route = createFileRoute('/lap-times')({
  component: LapTimesPage,
})

const columnHelper = createColumnHelper<LapTime & { rank: number }>()

const columns = [
  columnHelper.accessor('rank', {
    header: '#',
    cell: (info) => (
      <span className={`font-bold ${getRankColor(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('nickName', {
    header: 'Driver',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor('formattedTime', {
    header: 'Best Time',
    cell: (info) => (
      <span className="font-mono text-primary">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (info) => (
      <span className="text-muted-foreground">
        {new Date(info.getValue()).toLocaleDateString()}
      </span>
    ),
  }),
]

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-yellow-500' // Gold
    case 2:
      return 'text-gray-400' // Silver
    case 3:
      return 'text-amber-600' // Bronze
    default:
      return 'text-muted-foreground'
  }
}

function LapTimesPage() {
  const { data: lapTimes, isLoading, isError, error } = useLapTimes()

  // Sort by best lap time (ascending) and add rank
  const dataWithRank =
    lapTimes
      ?.slice()
      .sort((a, b) => a.bestLapTimeMs - b.bestLapTimeMs)
      .map((lt, index) => ({
        ...lt,
        rank: index + 1,
      })) ?? []

  const table = useReactTable({
    data: dataWithRank,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10 text-amber-500" />
              <h1 className="text-4xl font-bold text-foreground">
                Lap Times
              </h1>
            </div>
          </div>
          <ConnectionIndicator />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-12 bg-muted" />
                  <Skeleton className="h-8 w-48 bg-muted" />
                  <Skeleton className="h-8 w-32 bg-muted" />
                  <Skeleton className="h-8 w-24 bg-muted" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <p className="text-destructive text-lg">
                Failed to load lap times: {error?.message}
              </p>
            </div>
          ) : dataWithRank.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No lap times recorded yet. Be the first to set a time!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-border hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-muted-foreground font-semibold bg-muted"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Stats */}
        {lapTimes && lapTimes.length > 0 && (
          <div className="mt-6 text-center text-muted-foreground">
            <p>
              Total entries: <span className="text-foreground">{lapTimes.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
