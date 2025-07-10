"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: "1",
    question: "What is Lightmark and how does it help photographers?",
    answer:
      "Lightmark is a photography note-taking app designed to help photographers organize and manage their color profiles, presets, and styles. It allows you to create custom data types, link items to albums, and maintain detailed notes about your photography workflow.",
    category: "General",
  },
  {
    id: "2",
    question: "How do I create custom data types?",
    answer:
      "Go to Settings > Item Types & Custom Properties. Click 'Manage Types & Properties' to create new data types. You can define custom fields like text, numbers, dropdowns, tags, and more to suit your specific needs.",
    category: "Data Management",
  },
  {
    id: "3",
    question: "Can I import my existing presets and profiles?",
    answer:
      "Yes! Use the Import/Export feature in the header or Settings page. Lightmark supports various formats and can help you migrate your existing photography data seamlessly.",
    category: "Data Management",
  },
  {
    id: "4",
    question: "How do I organize photos into albums?",
    answer:
      "Navigate to the Albums section and click 'Create Album'. You can add photos, link them to your presets and profiles, and organize them by project, style, or any custom categorization that works for your workflow.",
    category: "Albums & Photos",
  },
  {
    id: "5",
    question: "What file formats are supported for photo uploads?",
    answer:
      "Lightmark supports all common image formats including JPG, PNG, WebP, TIFF, and RAW files. The media viewer can handle high-resolution images with zoom and navigation features.",
    category: "Albums & Photos",
  },
  {
    id: "6",
    question: "How do I link presets to specific albums or photos?",
    answer:
      "When creating or editing items, you can specify linked albums in the form. Similarly, when managing albums, you can link them to relevant presets, color profiles, or styles to maintain connections between your content.",
    category: "Organization",
  },
  {
    id: "7",
    question: "Can I collaborate with other photographers?",
    answer:
      "Currently, Lightmark is designed for individual use. However, you can export your data to share with others, and we're considering collaboration features for future updates.",
    category: "Sharing",
  },
  {
    id: "8",
    question: "How do I backup my data?",
    answer:
      "Go to Settings > Data Management and use the 'Export Data' feature to create backups. You can also use the Import/Export functionality to move data between devices or create regular backups.",
    category: "Data Management",
  },
  {
    id: "9",
    question: "Is my data stored locally or in the cloud?",
    answer:
      "By default, Lightmark stores data locally in your browser. For enhanced storage options and sync capabilities, you can configure cloud storage in the Settings > Data Management section.",
    category: "Storage",
  },
  {
    id: "10",
    question: "How do I customize the appearance and theme?",
    answer:
      "Visit Settings > Appearance to customize your theme. Lightmark supports both light and dark modes, with the dark theme being optimized for photography work with custom color schemes.",
    category: "Customization",
  },
];

const categories = [
  "All",
  "General",
  "Data Management",
  "Albums & Photos",
  "Organization",
  "Sharing",
  "Storage",
  "Customization",
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="container py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about using Lightmark for your
            photography workflow
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs */}
        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{faq.question}</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded mt-2 inline-block">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No FAQs match your search criteria. Try different keywords."
                : "No FAQs available for the selected category."}
            </p>
          </div>
        )}

        {/* Contact */}
        <div className="mt-12 text-center p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Contact Support
            </button>
            <button className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors">
              View Guides
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
