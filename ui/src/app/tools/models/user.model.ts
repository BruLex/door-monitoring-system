import { Model, ModelSchema } from 'src/app/tools/model';

export class UserModel extends Model {
    i_user: number;
    name: string;
    uuid: string;
    i_group?: number;
    schema: ModelSchema = {
        addProxy: 'user/add_user',
        deleteProxy: 'user/delete_user',
        updateProxy: 'user/update_user',
        fields: {
            i_user: { type: 'number' },
            name: { type: 'string' },
            uuid: { type: 'string' },
            i_group: { type: 'number' }
        },
        idProperty: 'i_user',
        rootProperty: 'user_info'
    };
}
