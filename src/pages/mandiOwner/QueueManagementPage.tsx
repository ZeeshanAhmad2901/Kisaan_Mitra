import { useMemo, useState } from 'react'

interface QueueItem {
  id: string
  position: number
  farmerName: string
  crop: string
  quantity: string
  vehicle: string
  arrivalTime: string
  estimatedWait: string
  status: 'next' | 'waiting' | 'in-progress' | 'completed'
}

const MOCK_QUEUE: QueueItem[] = [
  {
    id: '1',
    position: 1,
    farmerName: 'Amit Singh',
    crop: 'Potato',
    quantity: '50 quintal',
    vehicle: 'UP-32-GH-3456',
    arrivalTime: '7:00 AM',
    estimatedWait: '15 min',
    status: 'next',
  },
  {
    id: '2',
    position: 2,
    farmerName: 'Vikram Pal',
    crop: 'Mustard',
    quantity: '15 quintal',
    vehicle: 'UP-32-IJ-7890',
    arrivalTime: '7:30 AM',
    estimatedWait: '45 min',
    status: 'waiting',
  },
  {
    id: '3',
    position: 3,
    farmerName: 'Dinesh Verma',
    crop: 'Wheat',
    quantity: '30 quintal',
    vehicle: 'UP-32-MN-1234',
    arrivalTime: '7:45 AM',
    estimatedWait: '1 hr 15 min',
    status: 'waiting',
  },
  {
    id: '4',
    position: 4,
    farmerName: 'Prakash Jha',
    crop: 'Onion',
    quantity: '20 quintal',
    vehicle: 'UP-32-OP-5678',
    arrivalTime: '8:00 AM',
    estimatedWait: '1 hr 45 min',
    status: 'waiting',
  },
  {
    id: '5',
    position: 5,
    farmerName: 'Kamlesh Tiwari',
    crop: 'Sugarcane',
    quantity: '40 quintal',
    vehicle: 'UP-32-QR-9012',
    arrivalTime: '8:15 AM',
    estimatedWait: '2 hr',
    status: 'waiting',
  },
]

const CROP_ICONS: Record<string, string> = {
  Potato: '🥔',
  Mustard: '🌼',
  Wheat: '🌾',
  Onion: '🧅',
  Sugarcane: '🎋',
  Rice: '🌾',
  Maize: '🌽',
}

const STATUS_META: Record<
  QueueItem['status'],
  {
    label: string
    className: string
    dot: string
  }
> = {
  next: {
    label: 'Next',
    className: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  waiting: {
    label: 'Waiting',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  'in-progress': {
    label: 'Processing',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    className: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
}

function QueueManagementPage() {
  const [queue, setQueue] = useState<QueueItem[]>(MOCK_QUEUE)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | QueueItem['status']>('all')

  const markInProgress = (id: string) => {
    setQueue((currentQueue) =>
      currentQueue.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'in-progress',
            }
          : item,
      ),
    )
  }

  const markCompleted = (id: string) => {
  setQueue((currentQueue) => {
    const updatedQueue = currentQueue.map((item) =>
      item.id === id
        ? {
            ...item,
            status: 'completed' as const,
          }
        : item,
    )

    // Promote the first waiting farmer to the next position
    const nextWaiting = updatedQueue.find(
      (item) => item.status === 'waiting',
    )

    if (!nextWaiting) {
      return updatedQueue
    }

    return updatedQueue.map((item) =>
      item.id === nextWaiting.id
        ? {
            ...item,
            status: 'next' as const,
          }
        : item,
    )
  })
}

  const removeFromQueue = (id: string) => {
    setQueue((currentQueue) =>
      currentQueue.filter((item) => item.id !== id),
    )
  }

  const activeQueue = queue.filter(
    (item) => item.status !== 'completed',
  )

  const waitingCount = queue.filter(
    (item) => item.status === 'waiting',
  ).length

  const processingCount = queue.filter(
    (item) => item.status === 'in-progress',
  ).length

  const completedCount = queue.filter(
    (item) => item.status === 'completed',
  ).length

  const nextItem =
    queue.find((item) => item.status === 'next') ??
    queue.find((item) => item.status === 'waiting') ??
    null

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const matchesFilter =
        filter === 'all' ? true : item.status === filter

      const query = search.toLowerCase().trim()

      const matchesSearch =
        !query ||
        item.farmerName.toLowerCase().includes(query) ||
        item.vehicle.toLowerCase().includes(query) ||
        item.crop.toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [queue, search, filter])

  const handleProcessNext = () => {
    const target =
      queue.find((item) => item.status === 'next') ??
      queue.find((item) => item.status === 'waiting')

    if (target) {
      markInProgress(target.id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                <span>🚦</span>
                Mandi Queue Operations
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Queue Management
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-500">
                Monitor farmer arrivals, control processing order and keep the
                procurement queue moving efficiently.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-green-50">
                🏪
              </div>

              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                  Centre Status
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                  <p className="text-sm font-bold text-green-700">
                    Gate Operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Active Queue
                </p>

                <p className="mt-2 text-3xl font-bold text-green-800">
                  {activeQueue.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Farmers awaiting completion
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-green-50">
                👨‍🌾
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-amber-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
                  Waiting
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-800">
                  {waitingCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  In waiting state
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-amber-50">
                ⏳
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Processing
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-800">
                  {processingCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Currently being handled
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-blue-50">
                ⚙️
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {completedCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Processed today
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-slate-100">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Priority panel */}
        <div className="grid gap-6 mt-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="overflow-hidden bg-white border border-green-200 shadow-sm rounded-2xl">
            <div className="px-6 py-5 border-b border-green-100 bg-green-50/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                    Priority Queue
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Next Farmer to Process
                  </h2>
                </div>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-green-700 border border-green-200 rounded-full bg-white">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Position #1
                </span>
              </div>
            </div>

            {nextItem ? (
              <div className="p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-4xl rounded-2xl bg-green-50">
                    {CROP_ICONS[nextItem.crop] ?? '🌾'}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {nextItem.farmerName}
                      </h3>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border rounded-full ${
                          STATUS_META[nextItem.status].className
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            STATUS_META[nextItem.status].dot
                          }`}
                        />
                        {STATUS_META[nextItem.status].label}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {nextItem.crop} • {nextItem.quantity}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg">
                        🚜 {nextItem.vehicle}
                      </span>

                      <span className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg">
                        🕐 Arrived {nextItem.arrivalTime}
                      </span>

                      <span className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg">
                        ⏱️ Wait {nextItem.estimatedWait}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:min-w-[150px]">
                    {nextItem.status === 'next' && (
                      <button
                        type="button"
                        onClick={() => markInProgress(nextItem.id)}
                        className="px-5 py-3 text-sm font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700"
                      >
                        Start Processing
                      </button>
                    )}

                    {nextItem.status === 'in-progress' && (
                      <button
                        type="button"
                        onClick={() => markCompleted(nextItem.id)}
                        className="px-5 py-3 text-sm font-semibold text-white transition-all bg-green-700 rounded-xl hover:bg-green-800"
                      >
                        ✓ Mark Done
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFromQueue(nextItem.id)}
                      className="px-5 py-2.5 text-xs font-semibold text-red-600 transition-colors border border-red-100 rounded-xl hover:bg-red-50"
                    >
                      Remove from Queue
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto text-3xl rounded-2xl bg-green-50">
                  🎉
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Queue is clear
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  There are no farmers waiting for processing.
                </p>
              </div>
            )}
          </section>

          {/* Quick operations */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
              Quick Operations
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Queue Controls
            </h2>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={handleProcessNext}
                disabled={!nextItem}
                className="w-full p-4 text-left transition-all border border-blue-100 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 text-lg bg-white rounded-xl">
                    ▶
                  </div>

                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Process Next Farmer
                    </p>

                    <p className="mt-1 text-xs text-blue-700">
                      Move the next queue record into processing.
                    </p>
                  </div>
                </div>
              </button>

              <div className="p-4 border rounded-xl border-amber-100 bg-amber-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 text-lg bg-white rounded-xl">
                    ⏱️
                  </div>

                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      Current Wait Time
                    </p>

                    <p className="mt-1 text-xs text-amber-700">
                      Estimated average: <strong>35 minutes</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-100 rounded-xl bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 text-lg bg-white rounded-xl">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-bold text-green-900">
                      Queue Processing Active
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      Gate operations are running normally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Filters */}
        <section className="p-4 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All', count: queue.length },
                {
                  id: 'next',
                  label: 'Next',
                  count: queue.filter((q) => q.status === 'next').length,
                },
                {
                  id: 'waiting',
                  label: 'Waiting',
                  count: waitingCount,
                },
                {
                  id: 'in-progress',
                  label: 'Processing',
                  count: processingCount,
                },
                {
                  id: 'completed',
                  label: 'Completed',
                  count: completedCount,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setFilter(
                      item.id as 'all' | QueueItem['status'],
                    )
                  }
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    filter === item.id
                      ? 'bg-green-700 text-white'
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  <span
                    className={`ml-2 text-xs ${
                      filter === item.id
                        ? 'text-green-100'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative lg:w-80">
              <span className="absolute -translate-y-1/2 left-3 top-1/2">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search farmer, crop or vehicle"
                className="w-full py-2.5 pl-10 pr-4 text-sm border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </section>

        {/* Queue timeline */}
        <section className="mt-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                Live Queue
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Farmer Processing Line
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              {filteredQueue.length} record
              {filteredQueue.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredQueue.length === 0 ? (
            <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto text-3xl rounded-2xl bg-slate-100">
                🔎
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No matching records
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search or status filter.
              </p>
            </div>
          ) : (
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-[27px] top-8 bottom-8 hidden w-0.5 bg-slate-200 md:block" />

              {filteredQueue.map((item) => {
                const status = STATUS_META[item.status]

                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden bg-white border shadow-sm rounded-2xl ${
                      item.status === 'in-progress'
                        ? 'border-blue-300 ring-2 ring-blue-50'
                        : item.status === 'next'
                          ? 'border-green-300 ring-2 ring-green-50'
                          : 'border-slate-200'
                    }`}
                  >
                    <div className="p-5 md:p-6">
                      <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        {/* Position */}
                        <div className="relative z-10 flex items-center gap-3 md:w-36">
                          <div
                            className={`flex items-center justify-center flex-shrink-0 w-14 h-14 text-lg font-bold border-2 rounded-2xl ${
                              item.status === 'completed'
                                ? 'bg-slate-50 border-slate-200 text-slate-400'
                                : item.status === 'in-progress'
                                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                                  : item.status === 'next'
                                    ? 'bg-green-50 border-green-300 text-green-700'
                                    : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            {item.status === 'completed'
                              ? '✓'
                              : `#${item.position}`}
                          </div>

                          <div className="md:hidden">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border rounded-full ${status.className}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                              />
                              {status.label}
                            </span>
                          </div>
                        </div>

                        {/* Farmer info */}
                        <div className="flex-1 min-w-0">
                          <div className="hidden mb-2 md:block">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border rounded-full ${status.className}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                              />
                              {status.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {item.farmerName}
                            </h3>

                            <span className="text-xl">
                              {CROP_ICONS[item.crop] ?? '🌾'}
                            </span>

                            <span className="text-sm font-semibold text-slate-600">
                              {item.crop}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 mt-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Quantity
                              </p>
                              <p className="mt-1 font-semibold text-slate-800">
                                📦 {item.quantity}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Vehicle
                              </p>
                              <p className="mt-1 font-mono font-semibold text-slate-800">
                                🚜 {item.vehicle}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Arrival
                              </p>
                              <p className="mt-1 font-semibold text-slate-800">
                                🕐 {item.arrivalTime}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Est. Wait
                              </p>
                              <p className="mt-1 font-semibold text-slate-800">
                                ⏱️ {item.estimatedWait}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 md:w-40">
                          {item.status === 'next' && (
                            <button
                              type="button"
                              onClick={() => markInProgress(item.id)}
                              className="w-full px-4 py-3 text-sm font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700"
                            >
                              ▶ Start Processing
                            </button>
                          )}

                          {item.status === 'in-progress' && (
                            <button
                              type="button"
                              onClick={() => markCompleted(item.id)}
                              className="w-full px-4 py-3 text-sm font-semibold text-white transition-all bg-green-700 rounded-xl hover:bg-green-800"
                            >
                              ✓ Mark Done
                            </button>
                          )}

                          {item.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => removeFromQueue(item.id)}
                              className="w-full px-4 py-2.5 text-xs font-semibold text-red-600 transition-colors border border-red-100 rounded-xl hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}

                          {item.status === 'completed' && (
                            <div className="px-4 py-3 text-sm font-semibold text-center border text-slate-500 rounded-xl border-slate-200 bg-slate-50">
                              ✓ Processed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Bottom info */}
        <div className="grid gap-4 mt-6 sm:grid-cols-3">
          <div className="p-5 border border-green-100 rounded-2xl bg-green-50">
            <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
              Queue Health
            </p>

            <p className="mt-2 text-xl font-bold text-green-900">
              Stable
            </p>

            <p className="mt-1 text-xs text-green-700">
              Active farmer flow is within current capacity.
            </p>
          </div>

          <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
              Processing Status
            </p>

            <p className="mt-2 text-xl font-bold text-blue-900">
              {processingCount > 0 ? 'In Progress' : 'Ready'}
            </p>

            <p className="mt-1 text-xs text-blue-700">
              {processingCount} farmer currently under processing.
            </p>
          </div>

          <div className="p-5 border rounded-2xl border-amber-100 bg-amber-50">
            <p className="text-xs font-semibold tracking-wide uppercase text-amber-700">
              Average Wait
            </p>

            <p className="mt-2 text-xl font-bold text-amber-900">
              35 min
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Queue is being monitored continuously.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QueueManagementPage