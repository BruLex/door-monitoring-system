import { MonitorModel } from '../models/monitor.model';
import { Store, StoreSchema } from '../store';

export class MonitorStore extends Store<MonitorModel> {
    schema: StoreSchema<MonitorModel> = {
        model: MonitorModel,
        listProxy: 'monitor/get_monitor_logs',
        rootProperty: 'logs'
    };
}
