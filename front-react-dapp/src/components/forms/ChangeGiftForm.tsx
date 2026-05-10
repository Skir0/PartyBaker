import { ItemNameField } from './ItemNameField.tsx';
import type { ChangeGiftFormProps } from '../../types/event.types.ts';


export function ChangeGiftForm({formData, onChange}: ChangeGiftFormProps) {


    return (
        <section>

            <ItemNameField
                value={formData.name}
                onChange={onChange('name')}
                placeholder="Enter gift name"
                item={"Gift"}
            />

            <ItemNameField
                value={formData.price}
                onChange={onChange('price')}
                placeholder="Enter gift price"
                item={"Gift"}
            />

            <ItemNameField
                value={formData.description}
                onChange={onChange('description')}
                placeholder="Enter gift description"
                item={"Gift"}
            />


            <ItemNameField
                value={formData.url}
                onChange={onChange('url')}
                placeholder="Enter gift url"
                item={"Gift"}
            />
        </section>
    );
}