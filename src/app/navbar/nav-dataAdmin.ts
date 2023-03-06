import {
  faAtom,
  faBook,
  faBookOpen,
  faBuilding,
  faChartLine,
  faClose,
  faFileInvoiceDollar,
  faHome,
  faList,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";


export const btnClose = faClose
export const btnHome = faAtom

export const navbarDataAdmin = [
  {
    routeLink: 'admin',
    icon: faHome,
    label: 'Administration'
  },
  {
    routeLink: 'dashboard',
    icon: faChartLine,
    label: 'Dashboard'
  },
  {
    routeLink: 'users',
    icon: faUsers,
    label: 'Utilisateurs'
  },
  {
    routeLink: 'mon_profile',
    icon: faUser,
    label: 'Mon compte'
  },
  {
    routeLink: 'devis',
    icon: faFileInvoiceDollar,
    label: 'Devis'
  },
  {
    routeLink: 'clients',
    icon: faList,
    label: 'Clients'
  },
  {
    routeLink: 'blibli',
    icon: faBook,
    label: 'Bibliothèque',
    children: [
      {
        routeLink: '/listOuvrage',
        label: "Ouvrages",
        visible: true
      },
      {
        routeLink: '/listCout',
        label: "Couts",
        visible: true
      }
    ],
    visible: true
  },
  {
    routeLink: '/listFournisseur',
    icon: faBuilding,
    label: "Fournisseur"
  },
  {
    routeLink: '/listTypeCout',
    icon: faBookOpen,
    label: "Type de Cout"
  },
  // {
  //   routeLink: 'parametre',
  //   icon: faGear,
  //   label: 'Paramètres'
  // }
];
