import { creatValidators } from '@utils';

import { Model, ModelSchema } from '../model';

export class UserModel extends Model {
    i_user: number;
    name: string;
    uuid: string;
    i_role?: number;
    schema: ModelSchema = {
        addProxy: 'user/add_user',
        deleteProxy: 'user/delete_user',
        updateProxy: 'user/update_user',
        fields: {
            i_user: { type: 'number' },
            name: { type: 'string', validation: creatValidators({ type: 'str', required: true }) },
            uuid: { type: 'string', validation: creatValidators({ type: 'str', required: true }) },
            i_role: { type: 'number' }
        },
        idProperty: 'i_user',
        rootProperty: 'user_info'
    };
}
