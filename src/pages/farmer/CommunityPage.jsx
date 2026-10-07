import { useState } from 'react';
import { Heart, MessageCircle, Plus, Tag, Info, Image } from 'lucide-react';
import { PageHeader, Modal, Button } from '../../components/ui/index';
import { COMMUNITY_POSTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CommunityPage() {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ content: '', tags: '' });
  const [activeComments, setActiveComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handlePost = () => {
    if (!form.content.trim()) { addToast('Post content is required', 'error'); return; }
    const newPost = {
      id: `cp${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorLocation: `${user.village}, ${user.district}`,
      content: form.content,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: [],
      likes: 0,
      liked: false,
      comments: [],
      date: new Date().toISOString(),
      disclaimer: 'This is a farmer experience shared for community discussion. Not a confirmed agricultural diagnosis.',
    };
    setPosts(prev => [newPost, ...prev]);
    setForm({ content: '', tags: '' });
    setShowNew(false);
    addToast('Post shared with the community!', 'success');
  };

  const addComment = (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    const comment = {
      id: `com${Date.now()}`,
      authorName: user.name,
      location: `${user.village}, ${user.district}`,
      content: text,
      date: new Date().toISOString(),
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    addToast('Comment added!', 'success');
  };

  const relativeTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)} min ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Farmer Community"
        subtitle="Share experiences, ask questions and learn from fellow farmers"
        breadcrumb="Community"
        actions={
          <Button onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4" /> New Post
          </Button>
        }
      />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Community Notice:</strong> Posts here represent individual farmer experiences and are shared for community learning. They are NOT confirmed agricultural diagnoses or professional advice. Please consult a certified expert before making treatment decisions.
        </p>
      </div>

      {/* Posts */}
      <div className="space-y-5">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            {/* Author */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{post.authorName?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{post.authorName}</p>
                <p className="text-xs text-gray-400">{post.authorLocation} · {relativeTime(post.date)}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>

            {/* Image */}
            {post.images?.[0] && (
              <img src={post.images[0]} alt="Post" className="w-full h-48 object-cover rounded-xl mb-3" />
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-300 italic mb-3">{post.disclaimer}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} /> {post.likes}
              </button>
              <button
                onClick={() => setActiveComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> {post.comments?.length} comments
              </button>
            </div>

            {/* Comments */}
            {activeComments[post.id] && (
              <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
                {post.comments?.map(c => (
                  <div key={c.id} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-xs font-bold">{c.authorName?.[0]}</span>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-semibold text-gray-700">{c.authorName} <span className="text-gray-400 font-normal">· {c.location}</span></p>
                      <p className="text-xs text-gray-600 mt-0.5">{c.content}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{user?.name?.[0]}</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                    />
                    <button onClick={() => addComment(post.id)} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-xl hover:bg-green-700 transition-colors">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Share with Community">
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            ⚠️ Share your farming experience — not as a diagnosis or treatment recommendation.
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Your Post *</label>
            <textarea
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              placeholder="Share what you observed on your farm, ask a question, or share a success story..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Tags (comma separated)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g., Tomato, Disease, Nashik"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handlePost}>Share Post</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
