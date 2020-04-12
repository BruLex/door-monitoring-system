import { Model, ModelSchema } from 'src/app/tools/model';

export class LogModel extends Model {
    i_log: number = null;

    i_device: number = null;
    device_name: string = '';

    i_group: number = null;
    group_name: string = '';

    i_user: number = null;
    user_name: string = '';

    time: Date = null;
    access: number = null;
    device_ip: string = '';
    uuid: string = '';
    schema: ModelSchema = {
        fields: {
            i_log: { type: 'number' },
            i_device: { type: 'number' },
            device_name: { type: 'string' },
            i_group: { type: 'number' },
            group_name: { type: 'string' },
            i_user: { type: 'number' },
            user_name: { type: 'string' },
            time: { type: 'string' },
            access: { type: 'number' },
            device_ip: { type: 'string' },
            uuid: { type: 'string' }
        },
        idProperty: 'i_log'
    };
}
