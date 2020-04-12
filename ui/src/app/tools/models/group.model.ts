import { Model, ModelSchema } from 'src/app/tools/model';
import { DeviceModel } from 'src/app/tools/models/device.model';
import { UserModel } from 'src/app/tools/models/user.model';

export class GroupModel extends Model {
    i_group: number = null;
    name: string = '';
    allowed_all: boolean = false;
    allowed_devices?: DeviceModel[] = [];
    users: UserModel[] = [];
    schema: ModelSchema = {
        addProxy: 'group/add_group',
        deleteProxy: 'group/delete_group',
        updateProxy: 'group/update_group',
        fields: {
            i_group: { type: 'number' },
            name: { type: 'string' },
            allowed_all: { type: 'boolean' },
            allowed_devices: { type: 'array', items: { type: DeviceModel } },
            users: { type: 'array', items: { type: UserModel } }
        },
        idProperty: 'i_group',
        rootProperty: 'group_info'
    };
}
