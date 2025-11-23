import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api, GoogleSignInRequest, RegisterRequest, User } from '@suleigolden/sulber-api-client';
import { RootState } from '~/redux-action/store';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  credits: number;
};


const initialState: AuthState = {
  user:  null,
  token:  null,
  isLoading: false,
  error: null,
  credits: 0,
};

// Async Thunks
export const authenticate = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.service('auth').create(credentials);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || 'Failed to login',
      );
    }
  },
);
export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (data: GoogleSignInRequest, { rejectWithValue }) => {
    try {
      const response = await api.service('auth').googleSignIn(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to sign in with Google');
    }
  }
);
export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await api.service('auth').register(credentials);
      return response;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || 'Failed to register',
      );
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      // const token = state.auth.user?.accessToken;

      // if (!token) {
      //   throw new Error('No token found');
      // }
      await dispatch(clearAuth());
      // await api.service('auth').signOut(token);

      return { success: true };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || 'Failed to logout',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; email: string }>) {
      const userData = action.payload as unknown as User;
      state.user = {
        ...userData,
      };
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.credits = 0;
    },
    updateUserCredits: (state, action: PayloadAction<number>) => {
      if (state.user) {
        // state.user = {
        //   ...state.user,
        //   credits: action.payload
        // };
        state.credits = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        if (payload) {
          state.user = payload as User;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(authenticate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticate.fulfilled, (state, { payload }) => {
        if (payload) {
          state.user = payload as User;
        }
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(googleSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, { payload }) => {
        if (payload) {
          state.user = payload as User;
        }
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { setUser, setToken, clearAuth, updateUserCredits } = authSlice.actions;

export const selectUser = ({ auth }: RootState) => auth.user;
export const selectToken = ({ auth }: RootState) => auth.token;
export const selectCredits = ({ auth }: RootState) => auth.credits;
export const selectIsAuthLoading = ({ auth }: RootState) => auth.loading;
export const selectIsAdminRole = ({ auth }: RootState) =>
  auth.user.roles && auth.user.roles[0] === 'admin';

export default authSlice.reducer;
