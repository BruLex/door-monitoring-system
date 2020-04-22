import { creatValidators } from '@utils';

import { Model, ModelSchema } from '../model';

export class CardModel extends Model {
    i_card: number;
    name: string;
    uuid: string;
    i_role?: number;
    schema: ModelSchema = {
        addProxy: 'card/add_card',
        deleteProxy: 'card/delete_card',
        updateProxy: 'card/update_card',
        fields: {
            i_card: { type: 'number' },
            name: { type: 'string', validation: creatValidators({ type: 'str', required: true }) },
            uuid: { type: 'string', validation: creatValidators({ type: 'str', required: true }) },
            i_role: { type: 'number' }
        },
        idProperty: 'i_card',
        rootProperty: 'card_info'
    };
}
