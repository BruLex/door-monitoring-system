import { DeviceModel } from '../models/device.model';
import { Store, StoreSchema } from '../store';

export class DeviceStore extends Store<DeviceModel> {
    schema: StoreSchema<DeviceModel> = {
        model: DeviceModel,
        listProxy: 'device/get_device_list',
        idProperty: 'i_device',
        rootProperty: 'device_list'
    };
}
