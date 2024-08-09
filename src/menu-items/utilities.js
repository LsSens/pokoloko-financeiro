// assets
import { IconSettings, IconCash } from '@tabler/icons-react';

// constant
const icons = {
    IconSettings,
    IconCash
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilidades',
    type: 'group',
    children: [
        {
            id: 'fechamentos',
            title: 'Fechamentos',
            type: 'item',
            url: '/fechamentos',
            icon: icons.IconCash,
            breadcrumbs: false
        },
        {
            id: 'configuracoes',
            title: 'Configurações',
            type: 'item',
            url: '/configuracoes',
            icon: icons.IconSettings,
            breadcrumbs: false
        }
    ]
};

export default utilities;
