import { LogModel } from 'src/app/tools/models';
import { Store, StoreSchema } from 'src/app/tools/store';

export class LogStore extends Store<LogModel> {
    schema: StoreSchema<LogModel> = {
        model: LogModel,
        listProxy: 'logs/get_system_logs',
        idProperty: 'i_log',
        rootProperty: 'logs'
    };
}
