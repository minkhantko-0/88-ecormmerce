import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const addOrder = mutation({
  args: {
    productId: v.id('products'),
    name: v.string(),
    phoneNo: v.string(),
    note: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('orders', {
      productId: args.productId,
      customerName: args.name,
      customerPhoneNo: args.phoneNo,
      note: args.note,
      status: 'pending'
    });
  }
});

export const updateOrderStatus = mutation({
  args: {
    id: v.id('orders'),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('rejected')
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status
    });
  }
});

export const getOrders = query({
  handler: async ctx => {
    return await ctx.db
      .query('orders')
      .withIndex('by_creation_time')
      .order('desc')
      .collect();
  }
});
