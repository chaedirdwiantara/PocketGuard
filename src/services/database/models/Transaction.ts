import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Category from './Category';

export default class Transaction extends Model {
    static table = 'transactions';

    @field('amount') amount!: number;
    @text('note') note?: string;
    @date('date') date!: Date;
    @text('type') type!: 'income' | 'expense';

    @relation('categories', 'category_id') category!: Relation<Category>;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}
