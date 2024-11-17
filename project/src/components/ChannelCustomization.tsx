import React, { useState } from 'react';
import { X, Image as ImageIcon, Link as LinkIcon, Palette } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

interface ChannelCustomizationProps {
  onClose: () => void;
}

export function ChannelCustomization({ onClose }: ChannelCustomizationProps) {
  const { user } = useAuthStore();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const [activeTab, setActiveTab] = useState<'branding' | 'layout' | 'basic'>('branding');
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    description: '',
    links: [{ title: '', url: '' }],
    featured: [] as string[],
    layout: 'grid',
    theme: 'default',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile({
        uid: user.uid,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { title: '', url: '' }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Customize your channel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-1">
              {[
                { id: 'branding', label: 'Branding', icon: ImageIcon },
                { id: 'layout', label: 'Layout', icon: Palette },
                { id: 'basic', label: 'Basic info', icon: LinkIcon },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                    activeTab === id
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>

          <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profile picture
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Banner image
                  </label>
                  <div className="aspect-[3/1] bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span>Upload banner</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Channel layout
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['grid', 'list'].map((layout) => (
                      <button
                        key={layout}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, layout }))}
                        className={`p-4 border rounded-xl ${
                          formData.layout === layout
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded mb-2" />
                        <p className="font-medium capitalize">{layout} view</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Featured video
                  </label>
                  <button
                    type="button"
                    className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center"
                  >
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <span>Select featured video</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Channel name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, displayName: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Links</label>
                  <div className="space-y-4">
                    {formData.links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Title"
                          value={link.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              links: prev.links.map((l, i) =>
                                i === index ? { ...l, title: e.target.value } : l
                              ),
                            }))
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="url"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              links: prev.links.map((l, i) =>
                                i === index ? { ...l, url: e.target.value } : l
                              ),
                            }))
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLink}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      + Add link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}