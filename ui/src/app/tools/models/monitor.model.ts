import { Model, ModelSchema } from 'src/app/tools/model';

export class MonitorModel extends Model {
    mac: string;
    locked: boolean;
    status: boolean;
    icon: 'lock' | 'lock_open' | 'security' | 'verified_user';
    schema: ModelSchema = {
        fields: {
            mac: { type: 'string' },
            locked: { type: 'boolean' },
            status: { type: 'boolean' },
            icon: { type: 'string' }
        }
    };
}
