import { CommandBar, DetailsList, DetailsListLayoutMode, IStackStyles, Selection, Label, Spinner, SpinnerSize, Stack, IIconProps, SearchBox, Text, IGroup, IColumn, MarqueeSelection, CheckboxVisibility, IDetailsGroupRenderProps, getTheme, Image, ImageFit } from '@fluentui/react';
import { ReactElement, useEffect, useState, FormEvent, FC } from 'react';
import { useNavigate } from 'react-router';
import { Product, ProductStatus } from '../models';
import { stackItemPadding } from '../ux/styles';

interface ProductListPaneProps {
    items?: Product[]
    selectedItem?: Product;
    disabled: boolean
    onCreated: (item: Product) => void
    onDelete: (item: Product) => void
    onSelect: (item?: Product) => void
}

interface ProductDisplayItem extends Product {
    key: string;
    priceDisplay: string;
}

const addIconProps: IIconProps = {
    iconName: 'Add'
};

const createListItems = (items: Product[]): ProductDisplayItem[] => {
    return items.map(item => ({
        ...item,
        key: item.id || '',
        priceDisplay: `$${item.price.toFixed(2)}`,
    }));
};

const stackStyles: IStackStyles = {
    root: {
        alignItems: 'center'
    }
}

const ProductListPane: FC<ProductListPaneProps> = (props: ProductListPaneProps): ReactElement => {
    const theme = getTheme();
    const navigate = useNavigate();
    const [newItemName, setNewItemName] = useState('');
    const [items, setItems] = useState(createListItems(props.items || []));
    const [selectedItems, setSelectedItems] = useState<Product[]>([]);

    const selection = new Selection({
        onSelectionChanged: () => {
            const selected = selection.getSelection() as ProductDisplayItem[];
            setSelectedItems(selected);
        }
    });

    useEffect(() => {
        const sortedItems = [...(props.items || [])].sort((a, b) => (a.category < b.category ? -1 : 1));
        setItems(createListItems(sortedItems));
    }, [props.items]);

    const categories = Array.from(new Set(items.map(i => i.category)));
    const groups: IGroup[] = categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        return {
            key: cat,
            name: cat,
            startIndex: items.findIndex(i => i.category === cat),
            count: catItems.length,
        };
    });

    const onFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (newItemName && props.onCreated) {
            const item: Product = {
                name: newItemName,
                description: '',
                price: 0,
                imageUrl: '',
                stock: 0,
                category: 'General',
                status: ProductStatus.Available,
            }
            props.onCreated(item);
            setNewItemName('');
        }
    }

    const selectItem = (item: ProductDisplayItem) => {
        navigate(`/products/${item.id}`);
    }

    const deleteItems = () => {
        selectedItems.forEach(item => props.onDelete(item));
    }

    const columns: IColumn[] = [
        { key: 'image', name: '', fieldName: 'imageUrl', minWidth: 50, maxWidth: 50 },
        { key: 'name', name: 'Product Name', fieldName: 'name', minWidth: 150 },
        { key: 'price', name: 'Price', fieldName: 'priceDisplay', minWidth: 70 },
        { key: 'stock', name: 'Stock', fieldName: 'stock', minWidth: 50 },
        { key: 'status', name: 'Status', fieldName: 'status', minWidth: 80 },
    ];

    const groupRenderProps: IDetailsGroupRenderProps = {
        headerProps: {
            styles: {
                groupHeaderContainer: {
                    backgroundColor: theme.palette.neutralPrimary
                }
            }
        }
    }

    const renderItemColumn = (item: ProductDisplayItem, _index?: number, column?: IColumn) => {
        switch (column?.key) {
            case "image":
                return <Image src={item.imageUrl} width={40} height={40} imageFit={ImageFit.cover} />;
            case "name":
                return (
                    <Stack>
                        <Text variant="medium" block>{item.name}</Text>
                        <Text variant="small" style={{ color: theme.palette.neutralSecondary }}>{item.description}</Text>
                    </Stack>
                );
            default:
                return <Text variant="small">{(item as any)[column?.fieldName || '']}</Text>
        }
    }

    return (
        <Stack>
            <Stack.Item>
                <form onSubmit={onFormSubmit}>
                    <Stack horizontal styles={stackStyles}>
                        <Stack.Item grow={1}>
                            <SearchBox value={newItemName} placeholder="Quick add product name" iconProps={addIconProps} onChange={(_e, v) => setNewItemName(v || '')} disabled={props.disabled} />
                        </Stack.Item>
                        <Stack.Item>
                            <CommandBar
                                items={[
                                    {
                                        key: 'delete',
                                        text: 'Delete Selected',
                                        disabled: props.disabled || selectedItems.length === 0,
                                        iconProps: { iconName: 'Delete' },
                                        onClick: () => { deleteItems() }
                                    }
                                ]}
                                ariaLabel="Product actions" />
                        </Stack.Item>
                    </Stack>
                </form>
            </Stack.Item>
            {items.length > 0 ? (
                <Stack.Item>
                    <MarqueeSelection selection={selection}>
                        <DetailsList
                            items={items}
                            groups={groups}
                            columns={columns}
                            groupProps={groupRenderProps}
                            setKey="id"
                            onRenderItemColumn={renderItemColumn}
                            selection={selection}
                            layoutMode={DetailsListLayoutMode.justified}
                            checkboxVisibility={CheckboxVisibility.always}
                            onActiveItemChanged={selectItem} />
                    </MarqueeSelection>
                </Stack.Item>
            ) : (
                <Stack.Item align="center" tokens={stackItemPadding}>
                    {props.items ? <Text>No products found.</Text> : <Spinner size={SpinnerSize.large} label="Loading Products..." />}
                </Stack.Item>
            )}
        </Stack>
    );
};

export default ProductListPane;