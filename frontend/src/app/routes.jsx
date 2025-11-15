import { useRoutes } from 'react-router-dom';
import { allRoutes } from './routes/index';

const AppRoutes = () => {
    const element = useRoutes(allRoutes);
    return element;
}

export default AppRoutes;