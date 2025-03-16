import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getTypes = query({
  handler: async ctx => {
    return await ctx.db.query('types').collect();
  }
});

export const getType = query({
  args: {
    id: v.id('types')
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const createType = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('types', args);
  }
});

export const updateType = mutation({
  args: {
    id: v.id('types'),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      name: args.name,
      imageUrl: args.imageUrl,
      description: args.description
    });
  }
});

export const deleteType = mutation({
  args: {
    id: v.id('types')
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
