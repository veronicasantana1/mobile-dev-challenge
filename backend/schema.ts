import { graphql, list } from '@keystone-6/core';
import {
  text,
  integer,
  select,
  relationship,
  timestamp,
  virtual,
} from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const lists = {
  InstantNoodle: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
      }),
      brand: text({
        validation: { isRequired: true },
      }),
      spicinessLevel: integer({
        validation: {
          isRequired: true,
          min: 1,
          max: 5,
        },
        defaultValue: 3,
        ui: { description: 'Scale of 1 (mild) to 5 (🔥)' },
      }),
      spicinessDescription: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve(item) {
            const level = (item as { spicinessLevel: number }).spicinessLevel;
            if (level <= 2) return 'Mild';
            if (level <= 4) return 'Medium';
            return 'Hot';
          },
        }),
        ui: {
          description: 'Description of spiciness level',
          itemView: { fieldMode: 'read' },
        },
      }),
      originCountry: select({
        type: 'enum',
        options: [
          { label: 'South Korea', value: 'south_korea' },
          { label: 'Indonesia', value: 'indonesia' },
          { label: 'Malaysia', value: 'malaysia' },
          { label: 'Thailand', value: 'thailand' },
          { label: 'Japan', value: 'japan' },
          { label: 'Singapore', value: 'singapore' },
          { label: 'Vietnam', value: 'vietnam' },
          { label: 'China', value: 'china' },
          { label: 'Taiwan', value: 'taiwan' },
          { label: 'Philippines', value: 'philippines' },
        ],
        validation: { isRequired: true },
      }),
      rating: integer({
        validation: {
          isRequired: true,
          min: 1,
          max: 10,
        },
        defaultValue: 5,
        ui: { description: 'Your personal rating (1–10)' },
      }),
      imageURL: text({
        validation: { isRequired: false },
        ui: { description: 'URL to the noodle image' },
      }),
      category: relationship({
        ref: 'Category.noodles',
        many: false,
        ui: { displayMode: 'select' },
      }),
      reviewsCount: integer({
        validation: { isRequired: false, min: 0 },
        defaultValue: 0,
        ui: { description: 'Number of reviews for this noodle' },
      }),
      lastReviewedAt: timestamp({
        validation: { isRequired: false },
        ui: { description: 'Timestamp of most recent review' },
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },

    hooks: {
      validateInput: async ({
        operation,
        resolvedData,
        item,
        addValidationError,
      }) => {
        if (operation === 'update' && resolvedData.reviewsCount !== undefined) {
          const newCount = resolvedData.reviewsCount;
          const oldCount = item?.reviewsCount ?? 0;
          if (newCount < oldCount) {
            addValidationError('reviewsCount cannot be decreased.');
          }
        }
      },

      resolveInput: async ({ operation, resolvedData, item }) => {
        if (operation === 'update' && resolvedData.reviewsCount !== undefined) {
          const newCount = resolvedData.reviewsCount;
          const oldCount = item?.reviewsCount ?? 0;
          if (newCount > oldCount) {
            resolvedData.lastReviewedAt = new Date().toISOString();
          }
        }
        return resolvedData;
      },
    },
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      noodles: relationship({ ref: 'InstantNoodle.category', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
};
