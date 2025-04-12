"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Paperclip, Mic, Send, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import VoiceRecorder from "@/components/voice-recorder"

export default function FeedbackForm() {
  const [activeTab, setActiveTab] = useState("feedback")
  const [feedback, setFeedback] = useState("")
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; fileName?: string }[]>([])
  const [isAttaching, setIsAttaching] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "urgent") {
      // Simulate phone call initiation
      const confirmCall = window.confirm("Would you like to call HCX Resort support now?")
      if (confirmCall) {
        // In a real app, this would initiate a call
        alert("Calling HCX Resort support at +1-800-HCX-HELP...")
      }
    }
  }

  const handleFileAttachment = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setAttachedFile(file)
      setIsAttaching(true)
    }
  }

  const handleVoiceRecording = () => {
    setIsVoiceDialogOpen(true)
  }

  const handleSendFeedback = () => {
    if (feedback.trim() === "" && !attachedFile) return

    // Add user message
    const newMessages = [
      ...messages,
      {
        text: feedback,
        isUser: true,
        fileName: attachedFile ? attachedFile.name : undefined,
      },
    ]
    setMessages(newMessages)
    setFeedback("")

    // Add dummy response after a short delay
    setTimeout(() => {
      const responses = [
        "Thank you for your feedback! We'll look into this right away.",
        "We appreciate your input. Our team will address this shortly.",
        "Thanks for letting us know. We're committed to improving your stay.",
        "Your feedback is valuable to us. We'll have this resolved soon.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages([...newMessages, { text: randomResponse, isUser: false }])
    }, 1000)

    // Reset attachment
    if (attachedFile) {
      setAttachedFile(null)
      setIsAttaching(false)
    }
  }

  const handleVoiceFeedbackComplete = (transcript: string) => {
    setIsVoiceDialogOpen(false)
    if (transcript) {
      setFeedback(transcript)
      // Auto-send after a short delay
      setTimeout(() => {
        handleSendFeedback()
      }, 500)
    }
  }

  return (
    <section className="py-6 md:py-8 mb-10">
      <div className="rounded-2xl backdrop-blur-sm bg-white/30 border border-gray-100 shadow-sm p-4 md:p-6">
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "feedback" ? "default" : "outline"}
            className={`rounded-full ${
              activeTab === "feedback" ? "bg-black text-white" : "bg-transparent text-gray-600"
            }`}
            onClick={() => handleTabChange("feedback")}
          >
            Guest Feedback
          </Button>
          <Button
            variant={activeTab === "urgent" ? "default" : "outline"}
            className={`rounded-full relative ${
              activeTab === "urgent" ? "bg-black text-white" : "bg-transparent text-gray-600"
            }`}
            onClick={() => handleTabChange("urgent")}
          >
            Urgent
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700">
            Hello! How can we make your stay at HCX Resort more enjoyable? Feel free to share any feedback or requests.
          </p>
        </div>

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="mb-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl max-w-[80%] ${
                  message.isUser ? "bg-gray-100 text-gray-800 ml-auto" : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
                {message.fileName && (
                  <div className="mt-2 text-sm flex items-center">
                    <Paperclip className="h-3 w-3 mr-1" />
                    <span className="text-gray-600">{message.fileName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Attachment preview */}
        {attachedFile && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 truncate max-w-[200px]">{attachedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full p-0"
              onClick={() => {
                setAttachedFile(null)
                setIsAttaching(false)
              }}
            >
              ×
            </Button>
          </div>
        )}

        <div className="relative">
          <Textarea
            placeholder="Type your feedback..."
            className="resize-none rounded-xl border-gray-200 focus:border-gray-300 focus:ring-0 pr-24"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendFeedback()
              }
            }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={handleFileAttachment}
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={handleVoiceRecording}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Voice Feedback</DialogTitle>
                </DialogHeader>
                <VoiceRecorder onComplete={handleVoiceFeedbackComplete} />
              </DialogContent>
            </Dialog>

            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-black text-white hover:bg-gray-800"
              onClick={handleSendFeedback}
              disabled={feedback.trim() === "" && !attachedFile}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {activeTab === "urgent" && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                window.location.href = "tel:+18004429876" // Dummy phone number
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Support Now
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
