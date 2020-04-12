import { GroupModel } from '../models/group.model';
import { Store, StoreSchema } from '../store';

export class GroupStore extends Store<GroupModel> {
    schema: StoreSchema<GroupModel> = {
        model: GroupModel,
        listProxy: 'group/get_group_list',
        idProperty: 'i_group',
        rootProperty: 'group_list',
        options: {
            extended_info: true
        }
    };
}
