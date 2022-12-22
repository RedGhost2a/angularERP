import {
  faAtom,
  faBook,
  faChartLine,
  faClose,
  faFileInvoiceDollar,
  faGear,
  faHome,
  faList
} from "@fortawesome/free-solid-svg-icons";

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
    routeLink: '',
    icon: faBook,
    label: 'Bibliothèque',
    children: [
      {
        routeLink: '/listOuvrage',
        icon: faBook,
        label: "Bibliothéque d'ouvrages",
        visible: false
      },
      {
        routeLink: '/listCout',
        icon: faBook,
        label: "Bibliothéque de couts",
        visible: false
      }
    ]
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
  }]

