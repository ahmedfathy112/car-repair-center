// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../utils/supabase";
import toast from "react-hot-toast";

// دالة مساعدة للتعامل مع أخطاء قاعدة البيانات
const handleDatabaseError = (error) => {
  console.error("Database error details:", error);

  if (error.code === "PGRST116") {
    // الجدول غير موجود أو لا توجد بيانات
    return {
      error: true,
      message: "Database table not found",
      shouldRetry: false,
    };
  }

  if (error.code === "42501") {
    // خطأ في صلاحيات RLS
    return {
      error: true,
      message: "Permission denied (RLS error)",
      shouldRetry: false,
    };
  }

  if (
    error.message?.includes("relation") &&
    error.message?.includes("does not exist")
  ) {
    return {
      error: true,
      message: "Table does not exist",
      shouldRetry: false,
    };
  }

  return {
    error: true,
    message: "Database error: " + error.message,
    shouldRetry: true,
  };
};

// دالة لإنشاء ملف شخصي تلقائيًا إذا لم يكن موجودًا
const createUserProfileIfNotExists = async (userId, email) => {
  try {
    // تحقق أولاً إذا كان الملف الشخصي موجودًا
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingProfile) {
      // إنشاء ملف شخصي جديد
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          email: email,
          role: "customer", // الدور الافتراضي
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.warn("Failed to create user profile:", insertError);
        return null;
      }

      console.log("User profile created successfully");
      return {
        id: userId,
        email: email,
        role: "customer",
      };
    }

    return existingProfile;
  } catch (error) {
    console.error("Error in createUserProfileIfNotExists:", error);
    return null;
  }
};

// دالة محسنة لجلب بيانات الملف الشخصي
const fetchUserProfile = async (userId) => {
  try {
    // أولاً: حاول جلب البيانات من جدول profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url, department")
      .eq("id", userId)
      .maybeSingle(); // استخدم maybeSingle بدلاً من single

    if (profileError) {
      const dbError = handleDatabaseError(profileError);

      // إذا كان الجدول غير موجود، أنشئ ملف شخصي جديد
      if (
        dbError.message.includes("Table does not exist") ||
        dbError.message.includes("not found")
      ) {
        console.warn("Profiles table not found, attempting to create...");

        // حاول إنشاء الملف الشخصي
        const createdProfile = await createUserProfileIfNotExists(userId, "");
        if (createdProfile) {
          return {
            role: createdProfile.role || "customer",
            full_name: null,
            avatar_url: null,
            department: null,
          };
        }
      }

      throw profileError;
    }

    // إذا لم يكن هناك ملف شخصي، أنشئ واحدًا جديدًا
    if (!profileData) {
      const createdProfile = await createUserProfileIfNotExists(userId, "");
      if (createdProfile) {
        return {
          role: createdProfile.role || "customer",
          full_name: null,
          avatar_url: null,
          department: null,
        };
      }
    }

    return {
      role: profileData?.role || "customer",
      full_name: profileData?.full_name || null,
      avatar_url: profileData?.avatar_url || null,
      department: profileData?.department || null,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);

    // في حالة الخطأ، ارجع قيمًا افتراضية
    return {
      role: "customer",
      full_name: null,
      avatar_url: null,
      department: null,
    };
  }
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      toast.loading("جاري تسجيل الدخول...", { id: "login" });

      // 1. تسجيل الدخول باستخدام Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });

      if (authError) {
        toast.dismiss("login");

        let errorMessage = authError.message;

        if (authError.message.includes("Invalid login credentials")) {
          errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (authError.message.includes("Email not confirmed")) {
          errorMessage = "يرجى تأكيد بريدك الإلكتروني أولاً";
        }

        toast.error(errorMessage, { icon: "🔒" });
        return rejectWithValue(errorMessage);
      }

      // 2. محاولة جلب دور المستخدم
      let userRole = "customer";
      let full_name = null;

      try {
        // الطريقة الأولى: من جدول profiles
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (!profileError && profileData) {
          userRole = profileData.role || "customer";
          full_name = profileData.full_name;
        } else {
          // إذا لم يكن هناك ملف شخصي، أنشئ واحداً
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: authData.user.id,
                email: authData.user.email,
                role: "customer",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);

          if (insertError) {
            console.warn("Failed to create profile:", insertError);
          }
        }

        // الطريقة الثانية: من دالة get_my_role (اختياري)
        try {
          const { data: roleData } = await supabase.rpc("get_my_role");
          if (roleData && roleData.role) {
            userRole = roleData.role;
          }
        } catch (rpcError) {
          console.log("RPC function not used, continuing with table data");
        }
      } catch (error) {
        console.warn("Profile fetch failed, using default role:", error);
      }

      // 3. إعداد بيانات المستخدم
      const userData = {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: full_name,
        },
        session: authData.session,
        role: userRole,
        IsAdmin: userRole === "admin",
        IsMechanic: userRole === "mechanic",
        IsCustomer: userRole === "customer",
      };

      // 4. حفظ بيانات الاعتماد
      dispatch(setCredentials(userData));

      toast.dismiss("login");
      toast.success(`مرحباً ${full_name || userRole}!`);

      return userData;
    } catch (error) {
      toast.dismiss("login");
      console.error("Login error:", error);
      toast.error("فشل تسجيل الدخول");
      return rejectWithValue(error.message);
    }
  }
);

export const checkUserSession = createAsyncThunk(
  "auth/checkUserSession",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // 1. تحديد اسم المفتاح الخاص بـ Supabase في المتصفح
      // ملاحظة: استبدل 'sb-wvhbhaafwezqensepgto-auth-token' بمتغير بيئة إذا كان يتغير
      const STORAGE_KEY = "sb-wvhbhaafwezqensepgto-auth-token";
      const savedSession = localStorage.getItem(STORAGE_KEY);

      // إذا لم يوجد أي توكن في المتصفح، لا داعي لتكملة الطلب
      if (!savedSession) {
        return rejectWithValue("No session found in local storage");
      }

      // 2. طلب الجلسة رسمياً من سوبابيس (سيتولى هو التحقق من الـ access_token)
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data?.session) {
        const user = data.session.user;

        // 3. جلب بيانات الملف الشخصي (Profile)
        // يمكننا محاولة جلب الدور من metadata التوكن أولاً كحل سريع
        const userRole = user.user_metadata?.role || "customer";

        // استدعاء دالة fetchUserProfile لجلب البيانات الكاملة من قاعدة البيانات
        const userProfile = await fetchUserProfile(user.id);

        const userData = {
          user: {
            id: user.id,
            email: user.email,
            full_name: userProfile?.full_name || user.user_metadata?.full_name,
            avatar_url: userProfile?.avatar_url,
            department: userProfile?.department,
          },
          session: data.session,
          role: userProfile?.role || userRole,
          IsAdmin: (userProfile?.role || userRole) === "admin",
          IsMechanic: (userProfile?.role || userRole) === "mechanic",
          IsCustomer: (userProfile?.role || userRole) === "customer",
        };

        // 4. تحديث الـ Redux State فوراً
        dispatch(setCredentials(userData));
        return userData;
      }

      return null;
    } catch (error) {
      console.error("Session check error:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("تم تسجيل الخروج بنجاح");
      return null;
    } catch (error) {
      toast.error("فشل تسجيل الخروج");
      return rejectWithValue(error.message);
    }
  }
);

// دالة لإعادة تعيين كلمة المرور
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success(
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
      );
      return { success: true };
    } catch (error) {
      toast.error("فشل إرسال رابط إعادة التعيين");
      return rejectWithValue(error.message);
    }
  }
);

// دالة لتحديث بيانات الملف الشخصي
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast.success("تم تحديث الملف الشخصي بنجاح");

      // تحديث البيانات في الـ state
      const currentState = getState();
      return {
        ...currentState.auth.user,
        ...profileData,
      };
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("فشل تحديث الملف الشخصي");
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    session: null,
    IsAdmin: false,
    IsMechanic: false,
    IsCustomer: false,
    loading: false,
    error: null,
    isAuthenticated: false,
    profileLoaded: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.session = action.payload.session;
      state.IsAdmin = action.payload.IsAdmin;
      state.IsMechanic = action.payload.IsMechanic;
      state.IsCustomer = action.payload.IsCustomer;
      state.isAuthenticated = true;
      state.profileLoaded = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.role = null;
      state.session = null;
      state.IsAdmin = false;
      state.IsMechanic = false;
      state.IsCustomer = false;
      state.isAuthenticated = false;
      state.profileLoaded = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // تم تعيين البيانات في thunk عبر dispatch
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.session = null;
        state.IsAdmin = false;
        state.IsMechanic = false;
        state.IsCustomer = false;
        state.isAuthenticated = false;
        state.profileLoaded = false;
      })
      .addCase(checkUserSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.loading = false;
        // تم تعيين البيانات في thunk عبر dispatch
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.profileLoaded = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAdmin = (state) => state.auth.IsAdmin;
export const selectIsMechanic = (state) => state.auth.IsMechanic;
export const selectIsCustomer = (state) => state.auth.IsCustomer;
export const selectProfileLoaded = (state) => state.auth.profileLoaded;

// Export actions and reducer
export const { setCredentials, clearCredentials, clearError, updateUserData } =
  authSlice.actions;
export default authSlice.reducer;
