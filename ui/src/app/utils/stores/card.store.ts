import { CardModel } from '../models/card.model';
import { Store, StoreSchema } from './store';

export class CardStore extends Store<CardModel> {
    schema: StoreSchema<CardModel> = {
        model: CardModel,
        listProxy: 'card/get_card_list',
        idProperty: 'i_card',
        rootProperty: 'card_list'
    };
}
