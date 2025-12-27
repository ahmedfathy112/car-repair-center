import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../utils/supabase";

// Async thunk for fetching job card
export const fetchJobCard = createAsyncThunk(
  "jobCard/fetchJobCard",
  async (jobCardId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("repair_orders")
        .select("*, customer:customers(*), vehicle:vehicles(*)")
        .eq("id", jobCardId)
        .single();

      if (error) throw error;

      // Fetch job card items
      const { data: items, error: itemsError } = await supabase
        .from("repair_order_items")
        .select("*, part:inventory_parts(*)")
        .eq("repair_order_id", jobCardId);

      if (itemsError) throw itemsError;

      return {
        ...data,
        items: items || [],
        labor: [], // You might want to fetch labor separately
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for saving job card
export const saveJobCard = createAsyncThunk(
  "jobCard/saveJobCard",
  async (jobCardData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      const { items, labor, ...jobCard } = jobCardData;

      // Save or update repair order
      const { data: savedOrder, error: orderError } = await supabase
        .from("repair_orders")
        .upsert({
          ...jobCard,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order items
      for (const item of items) {
        const { error: itemError } = await supabase
          .from("repair_order_items")
          .upsert({
            ...item,
            repair_order_id: savedOrder.id,
            updated_at: new Date().toISOString(),
          });

        if (itemError) throw itemError;
      }

      // Trigger dashboard KPIs update
      await supabase.rpc("get_dashboard_kpis");

      return savedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const jobCardSlice = createSlice({
  name: "jobCard",
  initialState: {
    activeJobCard: null,
    items: [],
    labor: [],
    loading: false,
    error: null,
    totals: {
      subtotal: 0,
      tax: 0,
      grandTotal: 0,
    },
  },
  reducers: {
    setActiveJobCard: (state, action) => {
      state.activeJobCard = action.payload;
    },
    addPartToJobCard: (state, action) => {
      const newItem = {
        id: action.payload.id || `temp_${Date.now()}`,
        ...action.payload,
      };
      state.items.push(newItem);
      // Recalculate totals
      state.totals.subtotal = calculateSubtotal(state.items, state.labor);
      state.totals.tax = state.totals.subtotal * 0.14;
      state.totals.grandTotal = state.totals.subtotal + state.totals.tax;
    },
    removePartFromJobCard: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Recalculate totals
      state.totals.subtotal = calculateSubtotal(state.items, state.labor);
      state.totals.tax = state.totals.subtotal * 0.14;
      state.totals.grandTotal = state.totals.subtotal + state.totals.tax;
    },
    updatePartQuantityInJobCard: (state, action) => {
      const { itemId, quantity, maxQuantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.quantity = Math.min(quantity, maxQuantity || 99);
        // Recalculate totals
        state.totals.subtotal = calculateSubtotal(state.items, state.labor);
        state.totals.tax = state.totals.subtotal * 0.14;
        state.totals.grandTotal = state.totals.subtotal + state.totals.tax;
      }
    },
    addLaborToJobCard: (state, action) => {
      const newLabor = {
        id: action.payload.id || `labor_${Date.now()}`,
        ...action.payload,
      };
      state.labor.push(newLabor);
      // Recalculate totals
      state.totals.subtotal = calculateSubtotal(state.items, state.labor);
      state.totals.tax = state.totals.subtotal * 0.14;
      state.totals.grandTotal = state.totals.subtotal + state.totals.tax;
    },
    removeLaborFromJobCard: (state, action) => {
      state.labor = state.labor.filter((labor) => labor.id !== action.payload);
      // Recalculate totals
      state.totals.subtotal = calculateSubtotal(state.items, state.labor);
      state.totals.tax = state.totals.subtotal * 0.14;
      state.totals.grandTotal = state.totals.subtotal + state.totals.tax;
    },
    updateCustomerInfo: (state, action) => {
      if (state.activeJobCard) {
        state.activeJobCard = {
          ...state.activeJobCard,
          ...action.payload,
        };
      }
    },
    updateVehicleInfo: (state, action) => {
      if (state.activeJobCard) {
        state.activeJobCard = {
          ...state.activeJobCard,
          ...action.payload,
        };
      }
    },
    updateStatus: (state, action) => {
      if (state.activeJobCard) {
        state.activeJobCard.status = action.payload;
      }
    },
    clearJobCard: (state) => {
      state.activeJobCard = null;
      state.items = [];
      state.labor = [];
      state.totals = {
        subtotal: 0,
        tax: 0,
        grandTotal: 0,
      };
    },
    calculateTotals: (state) => {
      state.totals.subtotal = calculateSubtotal(state.items, state.labor);
      state.totals.tax = state.totals.subtotal * 0.14;
      state.totals.grandTotal = state.totals.subtotal + state.totals.tax;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobCard.fulfilled, (state, action) => {
        state.loading = false;
        state.activeJobCard = action.payload;
        state.items = action.payload.items || [];
        state.labor = action.payload.labor || [];
        state.totals.subtotal = calculateSubtotal(state.items, state.labor);
        state.totals.tax = state.totals.subtotal * 0.14;
        state.totals.grandTotal = state.totals.subtotal + state.totals.tax;
      })
      .addCase(fetchJobCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveJobCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveJobCard.fulfilled, (state, action) => {
        state.loading = false;
        state.activeJobCard = action.payload;
      })
      .addCase(saveJobCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Helper function to calculate subtotal
const calculateSubtotal = (items, labor) => {
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const laborTotal = labor.reduce((sum, l) => sum + l.hours * l.rate, 0);
  return itemsTotal + laborTotal;
};

// Selectors
export const selectActiveJobCard = (state) => state.jobCard.activeJobCard;
export const selectJobCardItems = (state) => state.jobCard.items;
export const selectJobCardLabor = (state) => state.jobCard.labor;
export const selectJobCardTotals = (state) => state.jobCard.totals;
export const selectJobCardLoading = (state) => state.jobCard.loading;
export const selectJobCardError = (state) => state.jobCard.error;

// Export actions and reducer
export const {
  setActiveJobCard,
  addPartToJobCard,
  removePartFromJobCard,
  updatePartQuantityInJobCard,
  addLaborToJobCard,
  removeLaborFromJobCard,
  updateCustomerInfo,
  updateVehicleInfo,
  updateStatus,
  clearJobCard,
  calculateTotals,
} = jobCardSlice.actions;

export default jobCardSlice.reducer;
