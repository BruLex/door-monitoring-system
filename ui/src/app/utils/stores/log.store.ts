import { LogModel } from '../models/log.model';
import { Store, StoreSchema } from './store';

export class LogStore extends Store<LogModel> {
    schema: StoreSchema<LogModel> = {
        model: LogModel,
        listProxy: 'logs/get_system_logs',
        idProperty: 'i_log',
        rootProperty: 'logs'
    };
}
