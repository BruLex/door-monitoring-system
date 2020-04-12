import { MonitorModel } from 'src/app/tools/models/monitor.model';
import { Store, StoreSchema } from 'src/app/tools/store';

export class MonitorStore extends Store<MonitorModel> {
    schema: StoreSchema<MonitorModel> = {
        model: MonitorModel,
        listProxy: 'monitor/get_monitor_logs',
        rootProperty: 'logs'
    };
}
