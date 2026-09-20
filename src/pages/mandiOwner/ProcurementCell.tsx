import { useEffect, useState } from 'react'
import {
  createProcurement,
  getBookingProcurement,
  updateProcurement,
  type Procurement,
} from '../../api/procurementApi'

interface ProcurementCellProps {
  bookingId: number
  bookedQuantity: number
}

export default function ProcurementCell({
  bookingId,
  bookedQuantity,
}: ProcurementCellProps) {
  const [procurement, setProcurement] = useState<Procurement | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [weighedQuantity, setWeighedQuantity] = useState(String(bookedQuantity))
  const [qualityGrade, setQualityGrade] = useState('')
  const [procurementAmount, setProcurementAmount] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProcurement = async () => {
      try {
        const data = await getBookingProcurement(bookingId)

        if (!cancelled) {
          setProcurement(data)
        }
      } catch (error) {
        console.error('Failed to load procurement:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadProcurement()

    return () => {
      cancelled = true
    }
  }, [bookingId])

  const handleCreate = async () => {
    const weighed = Number(weighedQuantity)
    const amount = Number(procurementAmount)

    if (!weighed || weighed <= 0) {
      alert('Enter a valid weighed quantity.')
      return
    }

    if (weighed > bookedQuantity) {
      alert('Weighed quantity cannot exceed booked quantity.')
      return
    }

    if (!qualityGrade.trim()) {
      alert('Enter the quality grade.')
      return
    }

    if (Number.isNaN(amount) || amount < 0) {
      alert('Enter a valid procurement amount.')
      return
    }

    try {
      setSaving(true)

      const created = await createProcurement({
        booking_id: bookingId,
        weighed_quantity: weighed,
        quality_grade: qualityGrade.trim(),
        procurement_amount: amount,
      })

      setProcurement(created)
      setShowForm(false)
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to record procurement.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleMarkPaid = async () => {
    if (!procurement) return

    try {
      setSaving(true)

      const updated = await updateProcurement(procurement.id, {
        payment_status: 'paid',
      })

      setProcurement(updated)
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update payment status.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <span className="text-xs text-gray-400">Loading...</span>
  }

  if (!procurement) {
    if (!showForm) {
      return (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-3 py-2 text-xs font-bold text-white bg-green-700 rounded-lg hover:bg-green-800"
        >
          Record Procurement
        </button>
      )
    }

    return (
      <div className="w-56 space-y-2">
        <input
          type="number"
          min="0.01"
          max={bookedQuantity}
          step="0.01"
          value={weighedQuantity}
          onChange={(event) => setWeighedQuantity(event.target.value)}
          placeholder="Weighed quantity"
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md"
        />

        <input
          type="text"
          value={qualityGrade}
          onChange={(event) => setQualityGrade(event.target.value)}
          placeholder="Quality grade"
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md"
        />

        <input
          type="number"
          min="0"
          step="0.01"
          value={procurementAmount}
          onChange={(event) => setProcurementAmount(event.target.value)}
          placeholder="Amount (?)"
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={saving}
            className="px-3 py-1.5 text-xs font-bold text-white bg-green-700 rounded-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            disabled={saving}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-w-[180px] space-y-1">
      <p className="text-sm font-bold text-gray-900">
        ?{procurement.procurement_amount.toLocaleString('en-IN')}
      </p>

      <p className="text-xs text-gray-500">
        {procurement.weighed_quantity} Q � Grade {procurement.quality_grade}
      </p>

      <p className="text-xs">
        Payment:{' '}
        <span
          className={
            procurement.payment_status === 'paid'
              ? 'font-bold text-green-700'
              : 'font-bold text-orange-600'
          }
        >
          {procurement.payment_status}
        </span>
      </p>

      {procurement.payment_status !== 'paid' && (
        <button
          type="button"
          onClick={() => void handleMarkPaid()}
          disabled={saving}
          className="px-2.5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Updating...' : 'Mark Paid'}
        </button>
      )}
    </div>
  )
}
