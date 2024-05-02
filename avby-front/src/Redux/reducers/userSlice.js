import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  announcements: [],
  favorites: [],
  notifications: [
    {
      id: 0,
      text: "Здравствуйте! Мы рады что вы зашли к нам в гости",
    },
    {
      id: 1,
      text: "Ваша машина добавлена в избранное",
    },
  ],
  isLoading: false,

  lastNotificationId: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = true;
    },
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
      state.isLoading = true;
    },
    removeAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(
        (item) => item.id !== action.payload
      );
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      state.isLoading = true;
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (item) => item.id !== action.payload
      );
    },
    addNotification: (state, action) => {
      const newNotification = {
        id: state.notifications.length + 1,
        text: action.payload,
      };
      state.notifications = [...state.notifications, newNotification];
      state.isLoading = true;
    },
    removeNotification: (state, action) => {
      const notification = action.payload;
      state.notifications = state.notifications.filter(
        (item) => item.id !== notification.id
      );
    },
  },
});

export const { setUser, setAnnouncements, removeAnnouncement, addNotification, removeNotification } =
  userSlice.actions;

export default userSlice.reducer;
