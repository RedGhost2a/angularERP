import {faAtom, faChartLine, faClose, faHome, faList} from "@fortawesome/free-solid-svg-icons";

export const btnClose = faClose
export const btnHome = faAtom

export const navbarDataAdmin = [
  {
    routeLink: 'admin',
    icon: faHome,
    label: 'Administration'
  },
  {
    routeLink: 'entreprises',
    icon: faChartLine,
    label: 'Entreprise'
  },
  {
    routeLink: 'users',
    icon: faList,
    label: 'Utilisateur'
  },
  // {
  //   routeLink: 'devis',
  //   icon: faFileInvoiceDollar,
  //   label: 'Devis'
  // },
  // {
  //   routeLink: '/listCout',
  //   icon: faBook,
  //   label: 'Bibliothéque de couts'
  // },
  // {
  //   routeLink: '/listOuvrage',
  //   icon: faBook,
  //   label: "Bibliothéque d'ouvrages"
  // },
  // {
  //   routeLink: '/listFournisseur',
  //   icon: faBook,
  //   label: "Fournisseur"
  // },
  // {
  //   routeLink: '/listTypeCout',
  //   icon: faBook,
  //   label: "Type de Cout"
  // },
  // {
  //   routeLink: 'parametre',
  //   icon: faGear,
  //   label: 'Paramètres'
  // }
];
