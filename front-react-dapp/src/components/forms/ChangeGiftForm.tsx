import { ItemField } from './ItemField.tsx';
import { type ChangeGiftFormProps, SheetType } from '../../types/event.types.ts';


export function ChangeGiftForm({formData, onChange}: ChangeGiftFormProps) {


    return (
        <section>

            <ItemField
                value={formData.name}
                onChange={onChange('name')}
                propertyName="Name"
                item={SheetType.GIFT}
                type={"text"}
            />

            <ItemField
                value={formData.price}
                onChange={onChange('price')}
                propertyName="Price"
                item={SheetType.GIFT}
                type={"number"}

            />

            <ItemField
                value={formData.description}
                onChange={onChange('description')}
                propertyName="Description"
                item={SheetType.GIFT}
                type={"text"}
            />


            <ItemField
                value={formData.url}
                onChange={onChange('url')}
                propertyName="Url"
                item={SheetType.GIFT}
                type={"url"}
            />
        </section>
    );
}