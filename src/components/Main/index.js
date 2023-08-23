import MainBreadcrumbs from '@/components/Main/Breadcrumbs/MainBreadcrumbs';
import MainMenu from '@/components/Main/Menu/MainMenu';
import MainCarousel from '@/components/Main/Carousel';
import MainTable from '@/components/Main/Table/table';
import MainCard from '@/components/Main/Card/MainCard';
import SiderPanel from '@/components/Main/Sider/SiderPanel';
import { MainHeader } from '@/components/Main/Header/MainHeader';
import { MainFooter } from '@/components/Main/Footer/MainFooter';
import { MainInfo } from '@/components/Main/Info/MainInfo';
import { MainSteps } from '@/components/Main/Steps/steps';

export default {
  Header: MainHeader,
  Footer: MainFooter,
  Table: MainTable,
  Card: MainCard,
  Carousel: MainCarousel,
  Breadcrumbs: MainBreadcrumbs,
  Menu: MainMenu,
  Sider: SiderPanel,
  Info: MainInfo,
  Steps: MainSteps
};