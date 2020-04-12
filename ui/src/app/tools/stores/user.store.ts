import { UserModel } from 'src/app/tools/models/user.model';
import { Store, StoreSchema } from 'src/app/tools/store';

export class UserStore extends Store<UserModel> {
    schema: StoreSchema<UserModel> = {
        model: UserModel,
        listProxy: 'user/get_user_list',
        idProperty: 'i_user',
        rootProperty: 'user_list'
    };
}
