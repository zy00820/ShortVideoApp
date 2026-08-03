import { create } from 'zustand';
import { mockVideos, currentUser } from '../data/mockData';

const initialFollowedUsers = new Set(
  mockVideos.filter((v) => v.author.isFollowing).map((v) => v.author.id)
);

export const useVideoStore = create((set) => ({
  videos: mockVideos,
  currentUser: currentUser,
  likedVideos: new Set(),
  savedVideos: new Set(),
  followedUsers: initialFollowedUsers,

  updateUser: (updates) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...updates },
    })),

  toggleLike: (videoId) =>
    set((state) => {
      const newLiked = new Set(state.likedVideos);
      if (newLiked.has(videoId)) {
        newLiked.delete(videoId);
      } else {
        newLiked.add(videoId);
      }
      return { likedVideos: newLiked };
    }),

  toggleSave: (videoId) =>
    set((state) => {
      const newSaved = new Set(state.savedVideos);
      if (newSaved.has(videoId)) {
        newSaved.delete(videoId);
      } else {
        newSaved.add(videoId);
      }
      return { savedVideos: newSaved };
    }),

  toggleFollow: (userId) =>
    set((state) => {
      const newFollowed = new Set(state.followedUsers);
      if (newFollowed.has(userId)) {
        newFollowed.delete(userId);
      } else {
        newFollowed.add(userId);
      }
      return { followedUsers: newFollowed };
    }),

  isFollowingUser: (userId) =>
    (state) => state.followedUsers.has(userId),

  addComment: (videoId, comment) =>
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === videoId
          ? { ...v, comments: [...v.comments, { id: `c_${Date.now()}`, ...comment }] }
          : v
      ),
    })),

  addVideo: (video) =>
    set((state) => ({
      videos: [video, ...state.videos],
    })),
}));
