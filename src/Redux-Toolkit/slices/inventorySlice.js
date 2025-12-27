import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../utils/supabase";

// دالة مساعدة لرفع الصور
const uploadImage = async (file) => {
  if (!file) return null;
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `parts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("inventory")
    .upload(filePath, file);

  if (uploadError) throw uploadError;
  return filePath;
};

// 1. جلب البيانات
export const fetchInventoryParts = createAsyncThunk(
  "inventory/fetchParts",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("inventory_parts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. إضافة قطعة (مع رفع الصورة)
export const addPart = createAsyncThunk(
  "inventory/addPart",
  async ({ partData, imageFile }, { rejectWithValue }) => {
    try {
      let imagePath = null;
      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }

      const { data, error } = await supabase
        .from("inventory_parts")
        .insert([{ ...partData, part_image_url: imagePath }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. تحديث قطعة
export const updatePart = createAsyncThunk(
  "inventory/updatePart",
  async ({ id, updates, imageFile }, { rejectWithValue }) => {
    try {
      let finalUpdates = { ...updates };
      if (imageFile) {
        const imagePath = await uploadImage(imageFile);
        finalUpdates.part_image_url = imagePath;
      }

      const { data, error } = await supabase
        .from("inventory_parts")
        .update(finalUpdates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. الحذف
export const deletePart = createAsyncThunk(
  "inventory/deletePart",
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("inventory_parts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    parts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryParts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
      })
      .addCase(fetchInventoryParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPart.fulfilled, (state, action) => {
        state.parts.unshift(action.payload);
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        const index = state.parts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.parts[index] = action.payload;
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.parts = state.parts.filter((p) => p.id !== action.payload);
      });
  },
});

// --- التصديرات المطلوبة لحل مشكلة Uncaught SyntaxError ---
export const selectAllParts = (state) => state.inventory.parts;
export const selectInventoryLoading = (state) => state.inventory.loading; // هذا هو السطر الذي كان ينقصك
export const selectInventoryError = (state) => state.inventory.error;

export default inventorySlice.reducer;
