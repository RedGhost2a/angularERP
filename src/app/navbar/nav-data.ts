import {
  faAtom,
  faBook,
  faChartLine,
  faClose,
  faFileInvoiceDollar,
  faHome,
  faList
} from "@fortawesome/free-solid-svg-icons";
import {faUser} from '@fortawesome/free-regular-svg-icons';


export const btnClose = faClose
export const btnHome = faAtom

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
    routeLink: "blibli",
    icon: faBook,
    label: 'Bibliothèque',
    children: [
      {
        routeLink: '/listOuvrage',
        icon: faBook,
        label: "Bibliothèque d'ouvrages",
        visible: true
      },
      {
        routeLink: '/listCout',
        icon: faBook,
        label: "Bibliothèque de couts",
        visible: true
      }
    ],
    visible: true
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
    routeLink: 'mon_profile',
    icon: faUser,
    label: 'Mon compte'
  }]

