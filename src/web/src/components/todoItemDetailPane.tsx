import { Text, Stack, TextField, PrimaryButton, DefaultButton, Dropdown, IDropdownOption, FontIcon, SpinButton } from '@fluentui/react';
import { useEffect, useState, FC, ReactElement, MouseEvent } from 'react';
import { Product, ProductStatus } from '../models';
import { stackGaps, stackItemMargin, stackItemPadding, titleStackStyles } from '../ux/styles';

interface ProductDetailPaneProps {
    item?: Product;
    onEdit: (item: Product) => void
    onCancel: () => void
}

export const ProductDetailPane: FC<ProductDetailPaneProps> = (props: ProductDetailPaneProps): ReactElement => {
    const [name, setName] = useState(props.item?.name || '');
    const [description, setDescription] = useState(props.item?.description || '');
    const [price, setPrice] = useState(props.item?.price || 0);
    const [imageUrl, setImageUrl] = useState(props.item?.imageUrl || '');
    const [stock, setStock] = useState(props.item?.stock || 0);
    const [category, setCategory] = useState(props.item?.category || 'General');
    const [status, setStatus] = useState(props.item?.status || ProductStatus.Available);

    useEffect(() => {
        setName(props.item?.name || '');
        setDescription(props.item?.description || '');
        setPrice(props.item?.price || 0);
        setImageUrl(props.item?.imageUrl || '');
        setStock(props.item?.stock || 0);
        setCategory(props.item?.category || 'General');
        setStatus(props.item?.status || ProductStatus.Available);
    }, [props.item]);

    const saveProduct = (evt: MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();

        if (!props.item?.id) {
            return;
        }

        const product: Product = {
            id: props.item.id,
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl,
            stock: stock,
            category: category,
            status: status,
        };

        props.onEdit(product);
    };

    const cancelEdit = () => {
        props.onCancel();
    }

    const onStatusChange = (_evt: any, value?: IDropdownOption) => {
        if (value) {
            setStatus(value.key as ProductStatus);
        }
    }

    const productStatusOptions: IDropdownOption[] = [
        { key: ProductStatus.Available, text: 'Available' },
        { key: ProductStatus.OutOfStock, text: 'Out of Stock' },
        { key: ProductStatus.Discontinued, text: 'Discontinued' },
    ];

    return (
        <Stack>
            {props.item &&
                <>
                    <Stack.Item styles={titleStackStyles} tokens={stackItemPadding}>
                        <Text block variant="xLarge">{name}</Text>
                        <Text variant="small">{description}</Text>
                    </Stack.Item>
                    <Stack.Item tokens={stackItemMargin}>
                        <TextField label="Name" required value={name} onChange={(_e, value) => setName(value || '')} />
                        <TextField label="Description" multiline rows={3} value={description} onChange={(_e, value) => setDescription(value || '')} />
                        <Stack horizontal tokens={stackGaps}>
                            <Stack.Item grow={1}>
                                <SpinButton label="Price ($)" value={price.toString()} onIncrement={(v) => setPrice(parseFloat(v) + 1)} onDecrement={(v) => setPrice(Math.max(0, parseFloat(v) - 1))} onValidate={(v) => setPrice(parseFloat(v) || 0)} />
                            </Stack.Item>
                            <Stack.Item grow={1}>
                                <SpinButton label="Stock" value={stock.toString()} onIncrement={(v) => setStock(parseInt(v) + 1)} onDecrement={(v) => setStock(Math.max(0, parseInt(v) - 1))} onValidate={(v) => setStock(parseInt(v) || 0)} />
                            </Stack.Item>
                        </Stack>
                        <TextField label="Image URL" value={imageUrl} onChange={(_e, value) => setImageUrl(value || '')} />
                        <TextField label="Category" value={category} onChange={(_e, value) => setCategory(value || '')} />
                        <Dropdown label="Status" options={productStatusOptions} required selectedKey={status} onChange={onStatusChange} />
                    </Stack.Item>
                    <Stack.Item tokens={stackItemMargin}>
                        <Stack horizontal tokens={stackGaps}>
                            <PrimaryButton text="Save" onClick={saveProduct} />
                            <DefaultButton text="Cancel" onClick={cancelEdit} />
                        </Stack>
                    </Stack.Item>
                </>
            }
            {!props.item &&
                <Stack.Item tokens={stackItemPadding} style={{ textAlign: "center" }} align="center">
                    <FontIcon iconName="Product" style={{ fontSize: 24, padding: 20 }} />
                    <Text block>Select a product to edit</Text>
                </Stack.Item>}
        </Stack >
    );
}

export default ProductDetailPane;