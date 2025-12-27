import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../utils/supabase";
import { toast } from "react-hot-toast";

// Async thunks
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createService = createAsyncThunk(
  "services/createService",
  async (serviceData, { rejectWithValue }) => {
    try {
      // Check user role
      const { data: roleData } = await supabase.rpc("get_my_role");
      if (roleData?.role !== "admin") {
        throw new Error("Insufficient permissions");
      }

      const { data, error } = await supabase
        .from("services")
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Service created successfully");
      return data;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      // Check user role
      const { data: roleData } = await supabase.rpc("get_my_role");
      if (roleData?.role !== "admin") {
        throw new Error("Insufficient permissions");
      }

      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Service updated successfully");
      return data;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (id, { rejectWithValue }) => {
    try {
      // Check user role
      const { data: roleData } = await supabase.rpc("get_my_role");
      if (roleData?.role !== "admin") {
        throw new Error("Insufficient permissions");
      }

      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      toast.success("Service deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const toggleServiceAvailability = createAsyncThunk(
  "services/toggleAvailability",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { data: roleData } = await supabase.rpc("get_my_role");
      if (roleData?.role !== "admin") {
        throw new Error("Insufficient permissions");
      }

      const state = getState();
      const service = state.services?.items?.find((s) => s.id === id);

      if (!service) {
        throw new Error("Service not found");
      }

      const { data, error } = await supabase
        .from("services")
        .update({ is_available: !service.is_available })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast.success(
        `Service ${data.is_available ? "activated" : "deactivated"}`
      );
      return data;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearServices: (state) => {
      state.items = [];
      state.error = null;
    },
    setServices: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create service
      .addCase(createService.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      // Update service
      .addCase(updateService.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(
            (s) => s.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      // Delete service
      .addCase(deleteService.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = state.items.filter((s) => s.id !== action.payload);
        }
      })
      // Toggle availability
      .addCase(toggleServiceAvailability.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(
            (s) => s.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      });
  },
});

// Selectors - FIXED with optional chaining
export const selectServices = (state) => state.services?.items || [];
export const selectServicesLoading = (state) =>
  state.services?.loading || false;
export const selectServicesError = (state) => state.services?.error || null;
export const selectServicesLastUpdated = (state) =>
  state.services?.lastUpdated || null;

// Actions
export const { clearServices, setServices } = servicesSlice.actions;

export default servicesSlice.reducer;
