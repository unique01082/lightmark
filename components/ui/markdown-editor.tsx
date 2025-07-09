"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Eye,
  Edit,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  height = "400px",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (before: string, after = "", placeholder = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)

    onChange(newText)

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }

  const formatMarkdown = (markdown: string) => {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/\n/g, "<br>")
  }

  const toolbarButtons = [
    { icon: Heading1, action: () => insertText("# ", "", "Heading 1"), title: "Heading 1" },
    { icon: Heading2, action: () => insertText("## ", "", "Heading 2"), title: "Heading 2" },
    { icon: Heading3, action: () => insertText("### ", "", "Heading 3"), title: "Heading 3" },
    { icon: Bold, action: () => insertText("**", "**", "bold text"), title: "Bold" },
    { icon: Italic, action: () => insertText("*", "*", "italic text"), title: "Italic" },
    { icon: Code, action: () => insertText("`", "`", "code"), title: "Inline Code" },
    { icon: Link, action: () => insertText("[", "](url)", "link text"), title: "Link" },
    { icon: ImageIcon, action: () => insertText("![", "](image-url)", "alt text"), title: "Image" },
    { icon: List, action: () => insertText("* ", "", "list item"), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. ", "", "list item"), title: "Numbered List" },
    { icon: Quote, action: () => insertText("> ", "", "quote"), title: "Quote" },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <TabsList className="grid w-32 grid-cols-2">
            <TabsTrigger value="edit" className="text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-0 resize-none focus-visible:ring-0 font-mono"
            style={{ height, minHeight: height }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className="p-4 prose prose-sm max-w-none dark:prose-invert"
            style={{ height, minHeight: height, overflow: "auto" }}
            dangerouslySetInnerHTML={{
              __html: value ? formatMarkdown(value) : '<p class="text-muted-foreground">Nothing to preview</p>',
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
