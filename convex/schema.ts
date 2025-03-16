import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  products: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    price: v.number(),
    description: v.string(),
    isFeatured: v.boolean(),
    category: v.id('categories'),
    type: v.id('types')
  }).searchIndex('by_name', { searchField: 'name' }),
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  }),
  types: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  }),
  orders: defineTable({
    customerName: v.string(),
    customerPhoneNo: v.string(),
    note: v.optional(v.string()),
    productId: v.id('products'),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('rejected')
    )
  })
});
