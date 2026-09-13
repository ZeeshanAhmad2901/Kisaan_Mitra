import type { QueueEntry } from '../types/queue'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_QUEUE: QueueEntry[] = [
  {
    id: '1',
    farmerName: 'Amit Singh',
    crop: 'Potato',
    quantity: '50 quintal',
    vehicleNumber: 'UP-32-GH-3456',
    arrivalTime: '7:00 AM',
    estimatedWait: '15 min',
    status: 'waiting',
    position: 1,
  },
  {
    id: '2',
    farmerName: 'Vikram Pal',
    crop: 'Mustard',
    quantity: '15 quintal',
    vehicleNumber: 'UP-32-IJ-7890',
    arrivalTime: '7:30 AM',
    estimatedWait: '45 min',
    status: 'waiting',
    position: 2,
  },
  {
    id: '3',
    farmerName: 'Dinesh Verma',
    crop: 'Wheat',
    quantity: '30 quintal',
    vehicleNumber: 'UP-32-MN-1234',
    arrivalTime: '7:45 AM',
    estimatedWait: '1 hr 15 min',
    status: 'waiting',
    position: 3,
  },
]

export async function getQueue(_mandiId: string): Promise<QueueEntry[]> {
  await delay(500)
  return MOCK_QUEUE
}

export async function updateQueueStatus(
  _entryId: string,
  _status: QueueEntry['status']
): Promise<void> {
  await delay(400)
}

export async function removeFromQueue(_entryId: string): Promise<void> {
  await delay(300)
}