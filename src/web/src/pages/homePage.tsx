import { useEffect, useContext, useMemo, useState, Fragment } from 'react';
import { Stack, Text, Shimmer, ShimmerElementType } from '@fluentui/react';
import ProductListPane from '../components/todoItemListPane';
import { Product } from '../models';
import * as itemActions from '../actions/itemActions';
import { TodoContext } from '../components/todoContext';
import { AppContext } from '../models/applicationState';
import { ItemActions } from '../actions/itemActions';
import { stackPadding, titleStackStyles } from '../ux/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators } from '../actions/actionCreators';
import WithApplicationInsights from '../components/telemetryWithAppInsights';

const HomePage = () => {
    const navigate = useNavigate();
    const appContext = useContext<AppContext>(TodoContext)
    const { productId } = useParams();
    const actions = useMemo(() => ({
        products: bindActionCreators(itemActions, appContext.dispatch) as unknown as ItemActions,
    }), [appContext.dispatch]);

    const [isReady, setIsReady] = useState(false)

    // Load products on initial load
    useEffect(() => {
        const loadProducts = async () => {
            await actions.products.list(); // pass empty string as we refactored listId out
            setIsReady(true)
        }
        loadProducts();
    }, [actions.products]);

    // React to selected product change
    useEffect(() => {
        if (productId && appContext.state.selectedItem?.id !== productId) {
            actions.products.load(productId);
        }
    }, [actions.products, appContext.state.selectedItem?.id, productId])

    const onProductCreated = async (item: Product) => {
        return await actions.products.save(item);
    }

    const onProductSelected = (item?: Product) => {
        actions.products.select(item);
    }

    const onProductDeleted = (item: Product) => {
        if (item.id) {
            actions.products.remove(item);
            navigate(`/products`);
        }
    }

    return (
        <Stack>
            <Stack.Item>
                <Stack horizontal styles={titleStackStyles} tokens={stackPadding}>
                    <Stack.Item grow={1}>
                        <Shimmer width={300}
                            isDataLoaded={isReady}
                            shimmerElements={
                                [
                                    { type: ShimmerElementType.line, height: 20 }
                                ]
                            } >
                            <Fragment>
                                <Text block variant="xLarge">Product Catalog</Text>
                                <Text variant="small">Manage your ecommerce inventory</Text>
                            </Fragment>
                        </Shimmer>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            <Stack.Item>
                <ProductListPane
                    items={appContext.state.selectedList?.items as Product[]} // In this refactor, items are stored in selectedList.items for now to minimize reducer changes
                    selectedItem={appContext.state.selectedItem as Product}
                    disabled={!isReady}
                    onSelect={onProductSelected}
                    onCreated={onProductCreated}
                    onDelete={onProductDeleted} />
            </Stack.Item>
        </Stack >
    );
};

const HomePageWithTelemetry = WithApplicationInsights(HomePage, 'HomePage');

export default HomePageWithTelemetry;

