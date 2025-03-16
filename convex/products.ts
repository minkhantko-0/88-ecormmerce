import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getProducts = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.id('categories')),
    type: v.optional(v.id('types'))
  },
  handler: async (ctx, { search, category, type }) => {
    let productsQuery = search
      ? ctx.db
          .query('products')
          .withSearchIndex('by_name', q => q.search('name', search))
      : ctx.db.query('products');

    if (category) {
      productsQuery = productsQuery.filter(q =>
        q.eq(q.field('category'), category)
      );
    }
    if (type) {
      productsQuery = productsQuery.filter(q => q.eq(q.field('type'), type));
    }

    return await productsQuery.collect();
  }
});

export const getProduct = query({
  args: {
    id: v.id('products')
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const addProduct = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    price: v.number(),
    description: v.string(),
    isFeatured: v.boolean(),
    category: v.id('categories'),
    type: v.id('types')
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('products', args);
  }
});

export const updateProduct = mutation({
  args: {
    id: v.id('products'),
    name: v.string(),
    imageUrl: v.string(),
    price: v.number(),
    description: v.string(),
    isFeatured: v.boolean(),
    category: v.id('categories'),
    type: v.id('types')
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      name: args.name,
      imageUrl: args.imageUrl,
      price: args.price,
      description: args.description,
      isFeatured: args.isFeatured,
      category: args.category,
      type: args.type
    });
  }
});

export const deleteProduct = mutation({
  args: {
    id: v.id('products')
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
