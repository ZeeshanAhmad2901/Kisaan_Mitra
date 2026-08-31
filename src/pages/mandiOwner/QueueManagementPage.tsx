import { useState } from 'react'

const MOCK_QUEUE = [
  { id: '1', position: 1, farmerName: 'Amit Singh', crop: 'Potato', quantity: '50 quintal', vehicle: 'UP-32-GH-3456', arrivalTime: '7:00 AM', estimatedWait: '15 min', status: 'next' },
  { id: '2', position: 2, farmerName: 'Vikram Pal', crop: 'Mustard', quantity: '15 quintal', vehicle: 'UP-32-IJ-7890', arrivalTime: '7:30 AM', estimatedWait: '45 min', status: 'waiting' },
  { id: '3', position: 3, farmerName: 'Dinesh Verma', crop: 'Wheat', quantity: '30 quintal', vehicle: 'UP-32-MN-1234', arrivalTime: '7:45 AM', estimatedWait: '1 hr 15 min', status: 'waiting' },
  { id: '4', position: 4, farmerName: 'Prakash Jha', crop: 'Onion', quantity: '20 quintal', vehicle: 'UP-32-OP-5678', arrivalTime: '8:00 AM', estimatedWait: '1 hr 45 min', status: 'waiting' },
  { id: '5', position: 5, farmerName: 'Kamlesh Tiwari', crop: 'Sugarcane', quantity: '40 quintal', vehicle: 'UP-32-QR-9012', arrivalTime: '8:15 AM', estimatedWait: '2 hr', status: 'waiting' },
]

const STATUS_STYLE: Record<string, string> = {
  next: 'bg-green-100 text-green-800 border-green-300',
  waiting: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
}

function QueueManagementPage() {
  const [queue, setQueue] = useState(MOCK_QUEUE)

  const markInProgress = (id: string) => {
    setQueue(queue.map((q) => q.id === id ? { ...q, status: 'in-progress' as const } : q))
  }

  const markCompleted = (id: string) => {
    setQueue(queue.map((q) => q.id === id ? { ...q, status: 'completed' as const } : q))
  }

  const removeFromQueue = (id: string) => {
    setQueue(queue.filter((q) => q.id !== id))
  }

  const activeQueue = queue.filter((q) => q.status !== 'completed')

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
            <p className="mt-1 text-gray-500">Manage the current queue at your mandi gate</p>
          </div>
          <div className="px-4 py-2 text-center border border-green-200 rounded-lg bg-green-50">
            <p className="text-2xl font-bold text-green-800">{activeQueue.length}</p>
            <p className="text-xs text-green-600">In Queue</p>
          </div>
        </div>

        {/* Queue Visual */}
        <div className="mt-8 space-y-3">
          {queue.length === 0 ? (
            <div className="py-12 text-center border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-4xl">🎉</span>
              <p className="mt-3 text-gray-500">Queue is empty!</p>
            </div>
          ) : (
            queue.map((item) => (
              <div
                key={item.id}
                className={`bg-white border rounded-lg p-4 transition-all ${STATUS_STYLE[item.status] || 'border-gray-200'}`}
              >
                <div className="flex items-center gap-4">
                  {/* Position Number */}
                  <div className="flex items-center justify-center w-12 h-12 text-lg font-bold bg-white border-2 border-current rounded-full shrink-0">
                    {item.status === 'completed' ? '✓' : item.position}
                  </div>

                  {/* Farmer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{item.farmerName}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize bg-white/60">
                        {item.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap mt-1 text-sm gap-x-4 gap-y-1">
                      <span>🌾 {item.crop}</span>
                      <span>📦 {item.quantity}</span>
                      <span>🚛 {item.vehicle}</span>
                      <span>🕐 Arrived: {item.arrivalTime}</span>
                      {item.status === 'waiting' && <span>⏱️ Est. wait: {item.estimatedWait}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {item.status === 'next' && (
                      <button
                        onClick={() => markInProgress(item.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Start Processing
                      </button>
                    )}
                    {item.status === 'in-progress' && (
                      <button
                        onClick={() => markCompleted(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Mark Done
                      </button>
                    )}
                    {item.status !== 'completed' && (
                      <button
                        onClick={() => removeFromQueue(item.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default QueueManagementPage