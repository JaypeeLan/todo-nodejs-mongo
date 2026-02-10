import { AppContext } from '../models/applicationState';
import { ProductContext } from '../components/productContext';
import * as itemActions from '../actions/itemActions';
import { ItemActions } from '../actions/itemActions';
import { Product } from '../models';
import { headerStackStyles, mainStackStyles, rootStackStyles, sidebarStackStyles } from '../ux/styles';
import ProductDetailPane from '../components/productDetailPane';
import { bindActionCreators } from '../actions/actionCreators';
import { FC, ReactElement, useContext, useMemo } from 'react';
import Header from './header';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from '../pages/homePage';
import { Stack } from '@fluentui/react';

const Layout: FC = (): ReactElement => {
    const navigate = useNavigate();
    const appContext = useContext<AppContext>(ProductContext)
    const actions = useMemo(() => ({
        items: bindActionCreators(itemActions, appContext.dispatch) as unknown as ItemActions,
    }), [appContext.dispatch]);

    const onItemEdited = (item: Product) => {
        actions.items.save(item);
        actions.items.select(undefined);
        navigate(`/products`);
    }

    const onItemEditCancel = () => {
        actions.items.select(undefined);
        navigate(`/products`);
    }

    return (
        <Stack styles={rootStackStyles}>
            <Stack.Item styles={headerStackStyles}>
                <Header></Header>
            </Stack.Item>
            <Stack horizontal grow={1}>
                <Stack.Item grow={1} styles={mainStackStyles}>
                    <Routes>
                        <Route path="/products/:productId" element={<HomePage />} />
                        <Route path="/products" element={<HomePage />} />
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </Stack.Item>
                <Stack.Item styles={sidebarStackStyles}>
                    <ProductDetailPane
                        item={appContext.state.selectedItem as Product}
                        onEdit={onItemEdited}
                        onCancel={onItemEditCancel} />
                </Stack.Item>
            </Stack>
        </Stack>
    );
}

export default Layout;
