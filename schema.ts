import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'image_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'inventory',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string', isOptional: true },
        { name: 'total_quantity', type: 'number' },
        { name: 'unit', type: 'string', isOptional: true },
        { name: 'item_per_pack', type: 'number', isOptional: true },
        { name: 'company_name', type: 'string', isOptional: true },
        { name: 'color', type: 'string', isOptional: true },
        { name: 'color_quantity', type: 'number', isOptional: true },
        { name: 'selling_quantity', type: 'number', isOptional: true },
        { name: 'how_much_in_one_box', type: 'number', isOptional: true },
        { name: 'how_much_in_one_box_unit', type: 'string', isOptional: true },
        { name: 'purchase_price', type: 'number', isOptional: true },
        { name: 'selling_price', type: 'number', isOptional: true },
        { name: 'quality', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'specification', type: 'string', isOptional: true },
        { name: 'image_uri', type: 'string', isOptional: true },
        { name: 'qr_code', type: 'string', isOptional: true },
        { name: 'is_added', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'sales',
      columns: [
        { name: 'inventory_id', type: 'string', isOptional: true },
        { name: 'price_per_unit', type: 'number', isOptional: true },
        { name: 'quantity', type: 'number', isOptional: true },
        { name: 'unit', type: 'string', isOptional: true },
        { name: 'discount', type: 'number', isOptional: true },
        { name: 'color', type: 'string', isOptional: true },
        { name: 'vat', type: 'number', isOptional: true },
        { name: 'payment_method', type: 'string', isOptional: true },
        { name: 'total_price', type: 'number', isOptional: true },
        { name: 'is_sold', type: 'boolean', isOptional: true },
        { name: 'sold_at', type: 'string', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'contacts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'work_type', type: 'string', isOptional: true },
        { name: 'company_name', type: 'string', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'debts',
      columns: [
        { name: 'customer_name', type: 'string', isOptional: true },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'payment_method', type: 'string', isOptional: true },
        { name: 'due_date', type: 'string', isOptional: true },
        { name: 'is_paid', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'debt_items',
      columns: [
        { name: 'debt_id', type: 'string', isOptional: true },
        { name: 'item_name', type: 'string', isOptional: true },
        { name: 'quantity', type: 'number', isOptional: true },
        { name: 'unit', type: 'string', isOptional: true },
        { name: 'discount', type: 'number', isOptional: true },
        { name: 'color', type: 'string', isOptional: true },
        { name: 'vat', type: 'number', isOptional: true },
        { name: 'price_per_unit', type: 'number', isOptional: true },
        { name: 'total_price', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'notifications',
      columns: [
        { name: 'type', type: 'string', isOptional: true },
        { name: 'message', type: 'string', isOptional: true },
        { name: 'is_read', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'analytics',
      columns: [
        { name: 'week_start', type: 'string', isOptional: true },
        { name: 'week_end', type: 'string', isOptional: true },
        { name: 'total_profit', type: 'number', isOptional: true },
        { name: 'total_expense', type: 'number', isOptional: true },
        { name: 'total_sales', type: 'number', isOptional: true },
        { name: 'total_stock', type: 'number', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'reports',
      columns: [
        { name: 'inventory_id', type: 'string', isOptional: true },
        { name: 'type', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'created_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'settings',
      columns: [
        { name: 'user_id', type: 'string', isOptional: true },
        { name: 'language', type: 'string', isOptional: true },
      ],
    }),
  ],
});
