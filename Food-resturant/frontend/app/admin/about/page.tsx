'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { aboutPageAPI } from '@/lib/api';
import { Save, RefreshCw, Image, X, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from '@/components/Toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface MediaFile {
  filename: string;
  url: string;
}

interface AboutPageContent {
  [key: string]: {
    value: string;
    type: 'text' | 'json' | 'image';
    updated_at?: string;
  };
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export default function AdminAboutPage() {
  const router = useRouter();
  const [content, setContent] = useState<AboutPageContent>({});
  const [originalContent, setOriginalContent] = useState<AboutPageContent>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}${url}`;
  };

  const openMediaLibrary = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsLoadingMedia(true);
    setShowMediaModal(true);

    try {
      const response = await fetch(`${API_URL}/media`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMediaFiles(data.files || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const selectImage = (url: string) => {
    updateContent('about_image_url', url);
    setShowMediaModal(false);
  };

  const parseTimelineValue = (value: string): TimelineItem[] => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fall through
    }
    return [];
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await aboutPageAPI.getAll();

        // If no content exists yet, seed with default values from the current UI
        const defaultContent: AboutPageContent = {
          about_story_label: { value: 'Our Story', type: 'text' },
          about_heading: { value: 'ABOUT BONGOU', type: 'text' },
          about_paragraph_1: { value: 'Founded by passionate chefs with deep roots in Haitian cuisine and a love for Southern Soul Food, Bongou brings together the best of both worlds in every dish we serve.', type: 'text' },
          about_paragraph_2: { value: 'We believe that food is more than just sustenance; it is a way to share culture, history, and love. Our recipes have been passed down through generations, refined to perfection, yet retaining that comforting, home-cooked feel.', type: 'text' },
          about_paragraph_3: { value: 'From our crispy Soul Fried Chicken to our rich, hearty Griot, every item on our menu is prepared fresh daily using only the highest quality ingredients. Whether you are dining in, picking up, or booking our catering services for an event, we promise an unforgettable flavor experience that will keep you coming back for more.', type: 'text' },
          about_image_url: { value: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop', type: 'image' },
          about_badge_number: { value: '15+', type: 'text' },
          about_badge_label: { value: 'Years of Experience', type: 'text' },
          about_stat_1_title: { value: 'Authentic Flavors', type: 'text' },
          about_stat_1_desc: { value: 'Blended spices from traditional recipes.', type: 'text' },
          about_stat_2_title: { value: 'Fresh Ingredients', type: 'text' },
          about_stat_2_desc: { value: 'Locally sourced produce and premium meats.', type: 'text' },
          // Our Journey section
          journey_label: { value: 'Our Heritage', type: 'text' },
          journey_heading: { value: 'The Journey', type: 'text' },
          journey_paragraph_1: { value: 'We met in 2005 with no idea that life would lead us here. What started as two hearts finding each other grew into a family, and then into a dream we could build together.', type: 'text' },
          journey_paragraph_2: { value: 'Our restaurant is the next chapter of that story. It\'s where our roots meet: the bold, vibrant flavors of Haiti and the comforting warmth of Southern soul food. From tender griot to smothered pork chops, from diri ak djon djon to mac and cheese, we invite you to mix and match dishes and create a plate that feels like home.', type: 'text' },
          journey_paragraph_3: { value: 'We believe in keeping everything "Hot and Fresh, Fast and Friendly, Clean and Safe" because that\'s how families deserve to be served. This is more than food to us. It\'s culture, it\'s family, it\'s love on a plate. We welcome everyone to pull up a chair at our table.', type: 'text' },
          journey_timeline: { value: JSON.stringify([
            { year: '2005', title: 'Two Hearts Meet', description: 'We met in 2005, embarking on a shared journey of love and family, with no idea where this path would lead us next.' },
            { year: '2008', title: 'The Beginning', description: 'Started as a small family kitchen serving authentic Haitian food to the local community, building a foundation of flavor and love.' },
            { year: '2012', title: 'Expanding Roots', description: 'Introduced classic Southern Soul Food to our menu, creating our signature fusion that won the hearts of many.' },
            { year: '2018', title: 'First Restaurant', description: 'Opened our first official dine-in location in Elgin, IL, bringing our home-cooked meals to a wider audience.' },
            { year: 'Today', title: 'A Culinary Destination', description: 'Now an establishment known for exceptional quality, vibrant atmosphere, and a place where two rich culinary cultures meet.' }
          ]), type: 'json' },
        };

        const mergedContent = { ...defaultContent, ...(data.content || {}) };
        setContent(mergedContent);
        setOriginalContent(mergedContent);
        setTimelineItems(parseTimelineValue(mergedContent.journey_timeline?.value || '[]'));
      } catch (err: any) {
        if (err.message.includes('token') || err.message.includes('Invalid')) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          router.push('/admin/login');
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const updateContent = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
        type: prev[key]?.type || 'text'
      }
    }));
    setHasChanges(true);
  };

  const handleTimelineChange = (items: TimelineItem[]) => {
    setTimelineItems(items);
    updateContent('journey_timeline', JSON.stringify(items));
  };

  const addTimelineItem = () => {
    const newItem: TimelineItem = { year: '', title: '', description: '' };
    handleTimelineChange([...timelineItems, newItem]);
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    const updated = timelineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleTimelineChange(updated);
  };

  const removeTimelineItem = (index: number) => {
    const updated = timelineItems.filter((_, i) => i !== index);
    handleTimelineChange(updated);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsSaving(true);
    try {
      await aboutPageAPI.update(content, token);
      setOriginalContent(content);
      setHasChanges(false);
      toast.success('About page content saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save about page content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setContent(originalContent);
    setTimelineItems(parseTimelineValue(originalContent.journey_timeline?.value || '[]'));
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#E8B904] text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">About Us Management</h2>
            <p className="text-white/60 mt-2 max-w-2xl">
              Manage all About Us page content including sections, descriptions, and timeline.
            </p>
          </div>
          {hasChanges && (
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#E8B904] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#CFA203] transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Hero / About Story Section */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8 lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6">About Section</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Section Label (e.g. "Our Story")</label>
                <input
                  type="text"
                  value={content.about_story_label?.value || ''}
                  onChange={(e) => updateContent('about_story_label', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Heading</label>
                <input
                  type="text"
                  value={content.about_heading?.value || ''}
                  onChange={(e) => updateContent('about_heading', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">Image</label>
                <div className="flex items-center gap-4">
                  {content.about_image_url?.value ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#E8B904]/20">
                      <img src={getFullImageUrl(content.about_image_url.value)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
                      <Image className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={openMediaLibrary}
                    className="bg-[#E8B904]/20 text-[#E8B904] font-bold px-6 py-3 rounded-xl hover:bg-[#E8B904]/30 transition-colors"
                  >
                    Select from Media Library
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Paragraph 1</label>
                <textarea
                  value={content.about_paragraph_1?.value || ''}
                  onChange={(e) => updateContent('about_paragraph_1', e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Paragraph 2</label>
                <textarea
                  value={content.about_paragraph_2?.value || ''}
                  onChange={(e) => updateContent('about_paragraph_2', e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">Paragraph 3</label>
                <textarea
                  value={content.about_paragraph_3?.value || ''}
                  onChange={(e) => updateContent('about_paragraph_3', e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Badge & Stats Section */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Badge / Floating Stats</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Badge Number (e.g. "15+")</label>
                <input
                  type="text"
                  value={content.about_badge_number?.value || ''}
                  onChange={(e) => updateContent('about_badge_number', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Badge Label</label>
                <input
                  type="text"
                  value={content.about_badge_label?.value || ''}
                  onChange={(e) => updateContent('about_badge_label', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Stat 1 Title</label>
                <input
                  type="text"
                  value={content.about_stat_1_title?.value || ''}
                  onChange={(e) => updateContent('about_stat_1_title', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Stat 1 Description</label>
                <input
                  type="text"
                  value={content.about_stat_1_desc?.value || ''}
                  onChange={(e) => updateContent('about_stat_1_desc', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Stat 2 Title</label>
                <input
                  type="text"
                  value={content.about_stat_2_title?.value || ''}
                  onChange={(e) => updateContent('about_stat_2_title', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Stat 2 Description</label>
                <input
                  type="text"
                  value={content.about_stat_2_desc?.value || ''}
                  onChange={(e) => updateContent('about_stat_2_desc', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Our Journey Section */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Our Journey Section</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Section Label (e.g. "Our Heritage")</label>
                <input
                  type="text"
                  value={content.journey_label?.value || ''}
                  onChange={(e) => updateContent('journey_label', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Heading</label>
                <input
                  type="text"
                  value={content.journey_heading?.value || ''}
                  onChange={(e) => updateContent('journey_heading', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Paragraph 1</label>
                <textarea
                  value={content.journey_paragraph_1?.value || ''}
                  onChange={(e) => updateContent('journey_paragraph_1', e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Paragraph 2</label>
                <textarea
                  value={content.journey_paragraph_2?.value || ''}
                  onChange={(e) => updateContent('journey_paragraph_2', e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Paragraph 3</label>
                <textarea
                  value={content.journey_paragraph_3?.value || ''}
                  onChange={(e) => updateContent('journey_paragraph_3', e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Timeline Section - REPLACED with proper UI */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Timeline Events</h3>
              <button
                onClick={addTimelineItem}
                className="flex items-center gap-2 bg-[#E8B904]/20 text-[#E8B904] font-bold px-5 py-2.5 rounded-xl hover:bg-[#E8B904]/30 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>
            <p className="text-white/50 text-sm mb-6">
              Manage the timeline milestones. Each event has a year, title, and description.
            </p>

            {timelineItems.length === 0 ? (
              <div className="text-center py-12 bg-black/30 rounded-2xl border border-dashed border-white/10">
                <p className="text-white/40">No timeline events yet. Click "Add Event" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timelineItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-black/50 border border-[#E8B904]/15 rounded-2xl p-5 hover:border-[#E8B904]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <GripVertical className="w-4 h-4 text-white/30 flex-shrink-0" />
                      <span className="text-[#E8B904]/60 font-bold text-sm uppercase tracking-wider">
                        Event {index + 1}
                      </span>
                      <button
                        onClick={() => removeTimelineItem(index)}
                        className="ml-auto text-red-400/60 hover:text-red-400 transition-colors p-1"
                        title="Remove event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Year</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                          placeholder="e.g. 2005"
                          className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#E8B904] outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                          placeholder="e.g. Two Hearts Meet"
                          className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#E8B904] outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                          placeholder="e.g. We met in 2005..."
                          className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#E8B904] outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E8B904]/20">
              <h3 className="text-xl font-bold text-white">Media Library</h3>
              <button onClick={() => setShowMediaModal(false)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoadingMedia ? (
                <div className="text-center py-12">
                  <div className="text-[#E8B904] text-xl">Loading...</div>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">No images in media library.</p>
                  <p className="text-white/30 text-sm mt-2">Upload images from the Media Library page first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaFiles.map((file) => (
                    <button
                      key={file.filename}
                      onClick={() => selectImage(file.url)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#E8B904] transition-colors"
                    >
                      <img src={getFullImageUrl(file.url)} alt={file.filename} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
