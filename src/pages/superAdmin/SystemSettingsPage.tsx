import { useEffect, useState } from 'react'
import {
  getSystemSettings,
  updateSystemSettings,
  type SystemSettingsUpdate,
} from '../../api/systemSettingsApi'

function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettingsUpdate>({
    platform_name: '',
    support_email: '',
    support_phone: '',
    max_bookings_per_farmer_per_day: 1,
    booking_window_days: 1,
    slot_duration_minutes: 120,
    enable_farmer_registration: false,
    enable_mandi_owner_registration: false,
    require_aadhaar_verification: false,
    enable_sms_notifications: false,
    maintenance_mode: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setLoading(true)
      setError('')

      const data = await getSystemSettings()

      setSettings({
        platform_name: data.platform_name,
        support_email: data.support_email,
        support_phone: data.support_phone,
        max_bookings_per_farmer_per_day:
          data.max_bookings_per_farmer_per_day,
        booking_window_days: data.booking_window_days,
        slot_duration_minutes: data.slot_duration_minutes,
        enable_farmer_registration:
          data.enable_farmer_registration,
        enable_mandi_owner_registration:
          data.enable_mandi_owner_registration,
        require_aadhaar_verification:
          data.require_aadhaar_verification,
        enable_sms_notifications:
          data.enable_sms_notifications,
        maintenance_mode: data.maintenance_mode,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load system settings.',
      )
    } finally {
      setLoading(false)
    }
  }

  function updateField<K extends keyof SystemSettingsUpdate>(
    field: K,
    value: SystemSettingsUpdate[K],
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }))
    setSaved(false)
  }

  async function handleSave() {
    try {
      setSaving(true)
      setSaved(false)
      setError('')

      await updateSystemSettings(settings)

      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 3000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save system settings.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 text-center bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">
              Loading system settings...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          System Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Configure platform-wide settings
        </p>

        {saved && (
          <div className="p-3 mt-4 text-sm text-center text-green-700 border border-green-200 rounded-lg bg-green-50">
            ✅ Settings saved successfully!
          </div>
        )}

        {error && (
          <div className="p-3 mt-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {/* General Settings */}
        <div className="p-6 mt-8 bg-white border border-gray-200 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-900">
            General
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Platform Name
              </label>

              <input
                type="text"
                value={settings.platform_name}
                onChange={(event) =>
                  updateField(
                    'platform_name',
                    event.target.value,
                  )
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Support Email
              </label>

              <input
                type="email"
                value={settings.support_email}
                onChange={(event) =>
                  updateField(
                    'support_email',
                    event.target.value,
                  )
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Support Phone
              </label>

              <input
                type="tel"
                value={settings.support_phone}
                onChange={(event) =>
                  updateField(
                    'support_phone',
                    event.target.value,
                  )
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-900">
            Booking Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Max Bookings Per Farmer Per Day
              </label>

              <input
                type="number"
                min={1}
                max={100}
                value={
                  settings.max_bookings_per_farmer_per_day
                }
                onChange={(event) =>
                  updateField(
                    'max_bookings_per_farmer_per_day',
                    Number(event.target.value),
                  )
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Booking Window (days in advance)
              </label>

              <input
                type="number"
                min={1}
                max={365}
                value={settings.booking_window_days}
                onChange={(event) =>
                  updateField(
                    'booking_window_days',
                    Number(event.target.value),
                  )
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Slot Duration (minutes)
              </label>

              <input
                type="number"
                min={15}
                max={1440}
                value={settings.slot_duration_minutes}
                onChange={(event) =>
                  updateField(
                    'slot_duration_minutes',
                    Number(event.target.value),
                  )
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-900">
            Feature Toggles
          </h2>

          <div className="space-y-4">
            {[
              {
                field: 'enable_farmer_registration' as const,
                label: 'Enable Farmer Registration',
                desc: 'Allow new farmers to create accounts',
              },
              {
                field: 'enable_mandi_owner_registration' as const,
                label: 'Enable Mandi Owner Registration',
                desc: 'Allow new mandi owners to apply',
              },
              {
                field: 'require_aadhaar_verification' as const,
                label: 'Require Aadhaar Verification',
                desc: 'Mandatory Aadhaar for farmer registration',
              },
              {
                field: 'enable_sms_notifications' as const,
                label: 'Enable SMS Notifications',
                desc: 'Send booking confirmations via SMS',
              },
              {
                field: 'maintenance_mode' as const,
                label: 'Maintenance Mode',
                desc: 'Disable the platform for maintenance',
              },
            ].map((toggle) => (
              <div
                key={toggle.field}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {toggle.label}
                  </p>

                  <p className="text-xs text-gray-500">
                    {toggle.desc}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[toggle.field]}
                    onChange={(event) =>
                      updateField(
                        toggle.field,
                        event.target.checked,
                      )
                    }
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 font-medium text-white bg-green-700 rounded-lg transition-colors hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemSettingsPage