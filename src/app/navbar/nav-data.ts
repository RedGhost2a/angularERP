import {
  faClose,
  faAtom,
  faHome,
  faDashboard,
  faList, faFileInvoiceDollar, faBook, faGear, faChartLine
} from "@fortawesome/free-solid-svg-icons";

export const  btnClose = faClose
export const  btnHome = faAtom

export const navbarData = [
  {
    routeLink: '',
    icon: faHome,
    label: 'Home'
  },
  {
    routeLink: 'dashboard',
    icon: faChartLine,
    label: 'Dashboard'
  },
  {
    routeLink: 'clients',
    icon: faList,
    label: 'Clients'
  },
  {
    routeLink: 'devis',
    icon: faFileInvoiceDollar,
    label: 'Devis'
  },
  {
    routeLink: '/listCout',
    icon: faBook,
    label: 'Bibliothéque de couts'
  },
  {
    routeLink: '/listOuvrage',
    icon: faBook,
    label: "Bibliothéque d'ouvrages"
  },
  {
    routeLink: '/listFournisseur',
    icon: faBook,
    label: "Fournisseur"
  },
  {
    routeLink: '/listTypeCout',
    icon: faBook,
    label: "Type de Cout"
  },
  {
    routeLink: 'parametre',
    icon: faGear,
    label: 'Paramètres'
  }
];
