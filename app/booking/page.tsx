'use client'

import { useState } from 'react'
import { Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react'

// Mock data for class types
const classTypes = [
  {
    id: '1',
    name: 'Beginner Vietnamese',
    duration: 60,
    price: 50,
    description: 'Perfect for absolute beginners. Learn basic vocabulary, pronunciation, and essential phrases.',
  },
  {
    id: '2',
    name: 'Intermediate Vietnamese',
    duration: 60,
    price: 60,
    description: 'Build on your foundation with more complex grammar and conversational skills.',
  },
  {
    id: '3',
    name: 'Advanced Conversation',
    duration: 60,
    price: 70,
    description: 'Practice advanced Vietnamese through real-world conversations and cultural discussions.',
  },
  {
    id: '4',
    name: 'Business Vietnamese',
    duration: 90,
    price: 100,
    description: 'Learn professional Vietnamese for business settings and workplace communication.',
  },
]

// Mock available time slots
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const selectedClassType = classTypes.find(ct => ct.id === selectedClass)

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    // TODO: Implement actual booking logic
    console.log({
      classType: selectedClass,
      date: selectedDate,
      time: selectedTime,
      student: studentInfo
    })
    setStep(5)
  }

  const canProceed = () => {
    if (step === 1) return selectedClass !== null
    if (step === 2) return selectedDate !== null
    if (step === 3) return selectedTime !== null
    if (step === 4) return studentInfo.name && studentInfo.email
    return false
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Book a Class</h1>
          <p className="text-xl text-gray-600">
            Schedule your personalized Vietnamese lesson today
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= num ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {num}
              </div>
              {num < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > num ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Class Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classTypes.map((classType) => (
                  <button
                    key={classType.id}
                    onClick={() => setSelectedClass(classType.id)}
                    className={`text-left p-6 rounded-lg border-2 transition ${
                      selectedClass === classType.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {classType.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{classType.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={16} />
                        <span>{classType.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-600 font-semibold">
                        <DollarSign size={16} />
                        <span>${classType.price}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Date</h2>
              <div className="flex justify-center">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-lg"
                />
              </div>
              {selectedDate && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600">Selected Date:</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Time</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-lg border-2 font-medium transition ${
                      selectedTime === time
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>

              {/* Booking Summary */}
              <div className="bg-indigo-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class Type:</span>
                    <span className="font-medium">{selectedClassType?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedClassType?.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-indigo-200">
                    <span className="text-gray-900 font-semibold">Total:</span>
                    <span className="text-indigo-600 font-bold text-lg">${selectedClassType?.price}</span>
                  </div>
                </div>
              </div>

              {/* Student Info Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={studentInfo.email}
                    onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={studentInfo.phone}
                    onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={studentInfo.message}
                    onChange={(e) => setStudentInfo({ ...studentInfo, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    placeholder="Tell me about your Vietnamese learning goals..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your class has been successfully booked. Check your email for confirmation details.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-medium">{selectedClassType?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setStep(1)
                  setSelectedClass(null)
                  setSelectedDate(null)
                  setSelectedTime(null)
                  setStudentInfo({ name: '', email: '', phone: '', message: '' })
                }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Book Another Class
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-8 border-t">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={step === 4 ? handleSubmit : handleNext}
                disabled={!canProceed()}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 4 ? 'Confirm Booking' : 'Next'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">
                Choose a time that works best for your schedule
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalized Lessons</h3>
              <p className="text-gray-600 text-sm">
                Each class is tailored to your learning goals
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Rescheduling</h3>
              <p className="text-gray-600 text-sm">
                Free cancellation up to 24 hours before class
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
