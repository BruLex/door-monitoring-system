import { Model, ModelSchema } from 'src/app/tools/model';

export class DeviceModel extends Model {
    i_device: number = null;
    name: string = '';
    description: string = '';
    ip: string = '';
    schema: ModelSchema = {
        addProxy: 'device/add_device',
        deleteProxy: 'device/delete_device',
        updateProxy: 'device/update_device',
        fields: {
            i_device: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            i_group: { type: 'number' }
        },
        idProperty: 'i_device',
        rootProperty: 'device_info'
    };
}
