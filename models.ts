import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users';
  @field('name') name!: string;
  @field('email') email?: string;
  @field('phone') phone?: string;
  @field('image_url') imageUrl?: string;
  @field('created_at') createdAt?: string;
}

export class Inventory extends Model {
  static table = 'inventory';
  @field('name') name!: string;
  @field('category') category?: string;
  @field('total_quantity') totalQuantity!: number;
  @field('unit') unit?: string;
  @field('item_per_pack') itemPerPack?: number;
  @field('item_per_pack_unit') itemPerPackUnit?: string; // Added field
  @field('company_name') companyName?: string;
  @field('color') color?: string;
  @field('color_quantity') colorQuantity?: number;
  @field('selling_quantity') sellingQuantity?: number;
  @field('how_much_in_one_box') howMuchInOneBox?: number;
  @field('how_much_in_one_box_unit') howMuchInOneBoxUnit?: string;
  @field('purchase_price') purchasePrice?: number;
  @field('selling_price') sellingPrice?: number;
  @field('quality') quality?: string;
  @field('description') description?: string;
  @field('specification') specification?: string;
  @field('image_uri') imageUri?: string;
  @field('qr_code') qrCode?: string;
  @field('is_added') isAdded?: boolean;
  @field('created_at') createdAt?: string;
}

export class Sale extends Model {
  static table = 'sales';
  @field('inventory_id') inventoryId?: string;
  @field('price_per_unit') pricePerUnit?: number;
  @field('quantity') quantity?: number;
  @field('unit') unit?: string;
  @field('discount') discount?: number;
  @field('color') color?: string;
  @field('vat') vat?: number;
  @field('payment_method') paymentMethod?: string;
  @field('total_price') totalPrice?: number;
  @field('is_sold') isSold?: boolean;
  @field('sold_at') soldAt?: string;
  @field('created_at') createdAt?: string;
}

export class Contact extends Model {
  static table = 'contacts';
  @field('name') name!: string;
  @field('phone') phone?: string;
  @field('work_type') workType?: string;
  @field('company_name') companyName?: string;
  @field('created_at') createdAt?: string;
}

export class Debt extends Model {
  static table = 'debts';
  @field('customer_name') customerName?: string;
  @field('phone') phone?: string;
  @field('payment_method') paymentMethod?: string;
  @field('due_date') dueDate?: string;
  @field('is_paid') isPaid?: boolean;
  @field('created_at') createdAt?: string;
}

export class DebtItem extends Model {
  static table = 'debt_items';
  @field('debt_id') debtId?: string;
  @field('item_name') itemName?: string;
  @field('quantity') quantity?: number;
  @field('unit') unit?: string;
  @field('discount') discount?: number;
  @field('color') color?: string;
  @field('vat') vat?: number;
  @field('price_per_unit') pricePerUnit?: number;
  @field('total_price') totalPrice?: number;
}

export class Notification extends Model {
  static table = 'notifications';
  @field('type') type?: string;
  @field('message') message?: string;
  @field('is_read') isRead?: boolean;
  @field('created_at') createdAt?: string;
}

export class Analytics extends Model {
  static table = 'analytics';
  @field('week_start') weekStart?: string;
  @field('week_end') weekEnd?: string;
  @field('total_profit') totalProfit?: number;
  @field('total_expense') totalExpense?: number;
  @field('total_sales') totalSales?: number;
  @field('total_stock') totalStock?: number;
  @field('created_at') createdAt?: string;
}

export class Report extends Model {
  static table = 'reports';
  @field('inventory_id') inventoryId?: string;
  @field('type') type?: string;
  @field('description') description?: string;
  @field('created_at') createdAt?: string;
}

export class Setting extends Model {
  static table = 'settings';
  @field('user_id') userId?: string;
  @field('language') language?: string;
}
