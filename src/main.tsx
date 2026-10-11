import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AddProductPage } from './components/AddProductPage.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const isAddProductPage = path === '/add-product';

createRoot(document.getElementById('root')!).render(
  isAddProductPage ? <AddProductPage /> : <App />
);
