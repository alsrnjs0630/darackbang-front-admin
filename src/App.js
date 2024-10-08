import { Provider } from 'react-redux';
import store from './store';
import {RouterProvider} from "react-router-dom";
import root from "./router/root";


function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={root} />
        </Provider>
    );
}
export default App;