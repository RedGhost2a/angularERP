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
    label: 'Couts'
  },
  {
    routeLink: '/listFrais',
    icon: faBook,
    label: 'Frais de chantier'
  },
  {
    routeLink: '/listOuvrageCout',
    icon: faBook,
    label: "Ouvrages de couts"
  },
  {
    routeLink: '/listOuvrageFrais',
    icon: faBook,
    label: "Ouvrages de frais de chantier"
  },
  {
    routeLink: 'parametre',
    icon: faGear,
    label: 'Paramètres'
  }
];
