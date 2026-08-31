import { useState } from 'react'

function SystemSettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-gray-500">Configure platform-wide settings</p>

        {saved && (
          <div className="p-3 mt-4 text-sm text-center text-green-700 border border-green-200 rounded-lg bg-green-50">
            ✅ Settings saved successfully!
          </div>
        )}

        {/* General Settings */}
        <div className="p-6 mt-8 bg-white border border-gray-200 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-900">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Platform Name</label>
              <input
                type="text"
                defaultValue="Kisaan Mitra"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Support Email</label>
              <input
                type="email"
                defaultValue="support@kisaanmitra.gov.in"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Support Phone</label>
              <input
                type="tel"
                defaultValue="1800-XXX-XXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-900">Booking Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Max Bookings Per Farmer Per Day</label>
              <input
                type="number"
                defaultValue={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Booking Window (days in advance)</label>
              <input
                type="number"
                defaultValue={7}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Slot Duration (minutes)</label>
              <input
                type="number"
                defaultValue={120}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-900">Feature Toggles</h2>
          <div className="space-y-4">
            {[
              { label: 'Enable Farmer Registration', desc: 'Allow new farmers to create accounts', defaultChecked: true },
              { label: 'Enable Mandi Owner Registration', desc: 'Allow new mandi owners to apply', defaultChecked: true },
              { label: 'Require Aadhaar Verification', desc: 'Mandatory Aadhaar for farmer registration', defaultChecked: false },
              { label: 'Enable SMS Notifications', desc: 'Send booking confirmations via SMS', defaultChecked: true },
              { label: 'Maintenance Mode', desc: 'Disable the platform for maintenance', defaultChecked: false },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{toggle.label}</p>
                  <p className="text-xs text-gray-500">{toggle.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={toggle.defaultChecked} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemSettingsPage