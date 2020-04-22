import { RoleModel } from '../models/role.model';
import { Store, StoreSchema } from '../store';

export class RoleStore extends Store<RoleModel> {
    schema: StoreSchema<RoleModel> = {
        model: RoleModel,
        listProxy: 'role/get_role_list',
        idProperty: 'i_role',
        rootProperty: 'role_list',
        options: {
            extended_info: true
        }
    };
}
