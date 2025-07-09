"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, Sparkles, Palette, Camera, Lightbulb } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hi! I'm your Lightmark AI assistant. I can help you organize your photography workflow, suggest color profiles, recommend presets, and answer questions about your collection. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Suggest presets for portrait photography",
        "Help me organize my color profiles",
        "What's the best workflow for wedding photos?",
        "Recommend color grading for landscape shots",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (message?: string) => {
    const messageText = message || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("preset") || lowerMessage.includes("presets")) {
      return {
        content:
          "For portrait photography, I recommend starting with these preset categories:\n\n• **Skin Tone Presets**: Focus on natural skin rendering\n• **Mood Presets**: Create atmosphere (moody, bright, airy)\n• **Film Emulation**: Vintage looks like Kodak Portra or Fuji\n\nWould you like me to help you create a custom preset based on your specific style?",
        suggestions: [
          "Create a custom portrait preset",
          "Show me film emulation options",
          "Help with skin tone adjustments",
        ],
      }
    }

    if (lowerMessage.includes("color profile") || lowerMessage.includes("color")) {
      return {
        content:
          "Color profiles are crucial for consistent results! Here's how to organize them:\n\n• **By Camera Brand**: Canon, Nikon, Sony profiles\n• **By Shooting Condition**: Studio, Natural Light, Low Light\n• **By Style**: Natural, Vibrant, Neutral\n\nI notice you have several Canon profiles. Would you like me to suggest the best ones for different scenarios?",
        suggestions: [
          "Best Canon profiles for portraits",
          "Color profiles for landscape photography",
          "How to create custom color profiles",
        ],
      }
    }

    if (lowerMessage.includes("workflow") || lowerMessage.includes("organize")) {
      return {
        content:
          "Here's an efficient photography workflow I recommend:\n\n1. **Import & Sort**: Use albums to categorize by shoot type\n2. **Apply Profiles**: Start with camera-specific color profiles\n3. **Batch Processing**: Apply presets to similar images\n4. **Fine-tuning**: Individual adjustments as needed\n5. **Export & Archive**: Organized file naming and storage\n\nWould you like me to help set up a specific workflow for your photography style?",
        suggestions: [
          "Set up wedding photography workflow",
          "Organize landscape photo workflow",
          "Create batch processing templates",
        ],
      }
    }

    if (lowerMessage.includes("wedding") || lowerMessage.includes("event")) {
      return {
        content:
          "Wedding photography requires a versatile workflow:\n\n• **Ceremony**: Natural, documentary style presets\n• **Portraits**: Skin-flattering, romantic presets\n• **Reception**: Low-light, vibrant presets\n• **Details**: High-contrast, artistic presets\n\nI can help you create a wedding preset collection with consistent color grading across all these scenarios.",
        suggestions: [
          "Create wedding preset collection",
          "Low-light reception presets",
          "Romantic portrait adjustments",
        ],
      }
    }

    if (lowerMessage.includes("landscape") || lowerMessage.includes("nature")) {
      return {
        content:
          "Landscape photography benefits from these approaches:\n\n• **Golden Hour**: Warm, enhanced sunset/sunrise presets\n• **Blue Hour**: Cool, moody twilight adjustments\n• **Dramatic Skies**: High contrast, vibrant presets\n• **Minimalist**: Clean, subtle enhancement\n\nWould you like me to analyze your landscape photos and suggest the best color grading approach?",
        suggestions: ["Golden hour color grading", "Dramatic sky enhancements", "Minimalist landscape presets"],
      }
    }

    // Default response
    return {
      content:
        "I'd be happy to help you with that! I can assist with:\n\n• **Preset Recommendations**: Based on your photography style\n• **Color Profile Organization**: Efficient categorization\n• **Workflow Optimization**: Streamlined editing process\n• **Creative Suggestions**: New techniques to try\n\nWhat specific aspect of your photography workflow would you like to improve?",
      suggestions: [
        "Analyze my photo collection",
        "Suggest new presets to try",
        "Help organize my albums",
        "Optimize my editing workflow",
      ],
    }
  }

  if (!isOpen) return null

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">
                <Bot className="h-4 w-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">AI Assistant</CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[400px]">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                {message.type === "assistant" && (
                  <Avatar className="w-6 h-6 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">
                      <Bot className="h-3 w-3 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>

                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 mr-1 mb-1 bg-transparent"
                          onClick={() => handleSend(suggestion)}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-6 h-6 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">
                    <Bot className="h-3 w-3 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about photography..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button size="sm" onClick={() => handleSend()} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 mt-2">
            <Badge
              variant="outline"
              className="text-xs cursor-pointer"
              onClick={() => handleSend("Suggest presets for my style")}
            >
              <Palette className="h-3 w-3 mr-1" />
              Presets
            </Badge>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer"
              onClick={() => handleSend("Help organize my workflow")}
            >
              <Camera className="h-3 w-3 mr-1" />
              Workflow
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => handleSend("Creative ideas")}>
              <Lightbulb className="h-3 w-3 mr-1" />
              Ideas
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
