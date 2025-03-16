import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getCategories = query({
  handler: async ctx => {
    return await ctx.db.query('categories').collect();
  }
});

export const getCategory = query({
  args: {
    id: v.id('categories')
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('categories', args);
  }
});

export const updateCategory = mutation({
  args: {
    id: v.id('categories'),
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

export const deleteCategory = mutation({
  args: {
    id: v.id('categories')
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
