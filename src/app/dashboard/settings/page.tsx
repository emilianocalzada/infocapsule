"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import TimeSelection from "../components/TimeSelection";

export default function SettingsPage() {
  const user = useQuery(api.functions.users.getAuthUser);
  const setPreferredTime = useMutation(api.functions.users.setPreferredTime);
  const togglePaused = useMutation(api.functions.users.togglePaused);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTogglingPaused, setIsTogglingPaused] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);
  const [showPauseSuccess, setShowPauseSuccess] = useState(false);

  // Initialize selected time when user data loads
  if (user?.preferredTime && selectedTime === null) {
    setSelectedTime(user.preferredTime);
  }

  const handleSave = async () => {
    if (!selectedTime) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await setPreferredTime({ 
        preferredTime: selectedTime as "06:00" | "12:00" | "18:00" | "24:00"
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
      console.error("Failed to save preferred time:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedTime(user?.preferredTime || null);
    setError(null);
  };

  const handleTogglePaused = async () => {
    setIsTogglingPaused(true);
    setPauseError(null);

    try {
      await togglePaused();
      setShowPauseSuccess(true);
      setTimeout(() => setShowPauseSuccess(false), 3000);
    } catch (err) {
      setPauseError("Failed to update email sending status. Please try again.");
      console.error("Failed to toggle paused status:", err);
    } finally {
      setIsTogglingPaused(false);
    }
  };

  const hasChanges = selectedTime !== user?.preferredTime;

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/dashboard" className="hover:text-gray-700 transition-colors">
            Dashboard
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">Settings</span>
        </div>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-lg text-gray-600">
          Customize your InfoCapsule experience
        </p>
      </div>

      {/* Settings Form */}
      <div className="max-w-4xl">
        {/* Email Address Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Digest Delivery Email
            </h2>
            <p className="text-gray-600">
              Your daily digest will be delivered to this email address.
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200"
              placeholder="No email address set"
            />
            <p className="text-xs text-gray-500 mt-2">
              This email was verified during sign-in and cannot be changed here.
            </p>
          </div>
        </div>

        {/* Email Sending Control Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Email Sending Status
            </h2>
            <p className="text-gray-600">
              Control whether you receive daily digest emails. When paused, no emails will be sent to your inbox.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="email-toggle" className="block text-sm font-medium text-gray-700 mb-1">
                Email Delivery
              </label>
              <p className="text-sm text-gray-500">
                {user?.paused ? "Email sending is currently paused" : "Email sending is currently active"}
              </p>
            </div>

            <div className="flex items-center">
              <button
                id="email-toggle"
                onClick={handleTogglePaused}
                disabled={isTogglingPaused}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  user?.paused
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-r from-orange-400 to-amber-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    user?.paused ? 'translate-x-1' : 'translate-x-6'
                  }`}
                />
              </button>
              {isTogglingPaused && (
                <div className="ml-3">
                  <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {pauseError && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">{pauseError}</p>
            </div>
          )}

          {/* Success Message */}
          {showPauseSuccess && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-600">
                Email sending status updated successfully!
              </p>
            </div>
          )}
        </div>

        {/* Email Delivery Time Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Email Delivery Time
            </h2>
            <p className="text-gray-600">
              Choose when you'd like to receive your daily digest. Times are shown in your local timezone.
            </p>
          </div>

          <TimeSelection
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
            disabled={isSubmitting}
          />

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-600">Settings saved successfully!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSubmitting}
              className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-6 py-3 rounded-xl hover:from-orange-500 hover:to-amber-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={!hasChanges || isSubmitting}
              className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
