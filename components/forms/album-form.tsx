'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { DirectusService } from '@/lib/directus';
import type { Album } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Plus, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PREDEFINED_LINK_TYPES = [
  'Website',
  'Portfolio',
  'Instagram',
  'Behance',
  'Flickr',
  'Dribbble',
  '500px',
  'Unsplash',
  'Youtube',
  'Vimeo',
  'Github',
  'Linkedin',
  'Twitter',
  'Facebook',
  'Other',
];

interface AlbumFormProps {
  album?: Album;
  isOpen: boolean;
  onClose: () => void;
  onSave: (album: Partial<Album>) => void;
}

export function AlbumForm({ album, isOpen, onClose, onSave }: AlbumFormProps) {
  const [formData, setFormData] = useState({
    name: album?.name || '',
    author: album?.author || '',
    links: album?.links || [],
    description: album?.description || '',
    avatar: album?.avatar || '',
  });

  const [linkTypeOpen, setLinkTypeOpen] = useState<{ [key: number]: boolean }>({});

  // Update form data when album prop changes
  useEffect(() => {
    if (album) {
      setFormData({
        name: album.name || '',
        author: album.author || '',
        links: album.links || [],
        description: album.description || '',
        avatar: album.avatar || '',
      });
    }
  }, [album]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Reset form for next use
    setFormData({
      name: '',
      author: '',
      links: [],
      description: '',
      avatar: '',
    });
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { url: '', type: 'website' }],
    }));
  };

  const updateLink = (index: number, field: 'url' | 'type', value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('file :>> ', file);
    if (file) {
      const fileInfo = await DirectusService.uploadFile(file);
      setFormData((prev) => ({ ...prev, avatar: fileInfo.id }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{album ? 'Edit Album' : 'Create New Album'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Album Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Urban Photography Collection"
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Photographer name"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>External Links (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLink}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </div>
              {formData.links.length > 0 ? (
                <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label htmlFor={`url-${index}`} className="text-sm">
                          URL
                        </Label>
                        <Input
                          id={`url-${index}`}
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="w-40">
                        <Label htmlFor={`type-${index}`} className="text-sm">
                          Type
                        </Label>
                        <Popover
                          open={linkTypeOpen[index] || false}
                          onOpenChange={(open) =>
                            setLinkTypeOpen((prev) => ({ ...prev, [index]: open }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={linkTypeOpen[index] || false}
                              className="w-full justify-between"
                            >
                              {link.type || 'Select type...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search or type custom..."
                                value={link.type}
                                onValueChange={(value) => updateLink(index, 'type', value)}
                              />
                              <CommandList>
                                <CommandEmpty>No type found.</CommandEmpty>
                                <CommandGroup>
                                  {PREDEFINED_LINK_TYPES.map((type) => (
                                    <CommandItem
                                      key={type}
                                      value={type}
                                      onSelect={() => {
                                        updateLink(index, 'type', type);
                                        setLinkTypeOpen((prev) => ({ ...prev, [index]: false }));
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          link.type === type ? 'opacity-100' : 'opacity-0',
                                        )}
                                      />
                                      {type}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No external links added</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your album..."
                rows={4}
              />
            </div>

            <div>
              <Label>Cover Image</Label>
              <div className="mt-2">
                {formData.avatar ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        formData.avatar
                          ? DirectusService.getAssetUrl(formData.avatar)
                          : '/placeholder.svg'
                      }
                      alt="Cover"
                      className="w-32 h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => setFormData((prev) => ({ ...prev, avatar: '' }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Upload a cover image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        Choose Image
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{album ? 'Update' : 'Create'} Album</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
