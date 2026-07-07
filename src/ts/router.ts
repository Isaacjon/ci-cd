import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import PlantPage from './pages/plant-page';
import { getAppPathname, getPublicPathname } from './base/routing';

class Router {
  static catalogPage: CatalogPage;
  static cartPage: CartPage;
  static plantPage: PlantPage;
  static errorPage: ErrorPage;

  constructor(cart: Cart) {
    Router.catalogPage = new CatalogPage(cart);
    Router.cartPage = new CartPage(cart);
    Router.plantPage = new PlantPage(cart);
    Router.errorPage = new ErrorPage(cart);
  }

  static render(pathname: string) {
    // console.log('render:', pathname);
    const appPathname = getAppPathname(pathname);
    switch (appPathname) {
      case PagesList.catalogPage:
        Router.catalogPage.draw();
        break;
      case PagesList.cartPage:
        Router.cartPage.draw();
        break;
      case '/':
        this.goTo(PagesList.catalogPage);
        break;
      default:
        if (isPlantsId(appPathname)) {
          Router.plantPage.draw(appPathname.slice(1));
        } else {
          Router.errorPage.draw();
        }
        break;
    }
    Router.changeLinks();
  }

  static goTo(pageId: string) {
    const url = new URL(pageId, window.location.origin);
    const appPathname = getAppPathname(url.pathname);
    const publicPathname = `${getPublicPathname(appPathname)}${url.search}${url.hash}`;
    window.history.pushState({ pageId: appPathname }, appPathname, publicPathname);
    Router.render(appPathname);
    window.scrollTo(0, 0);
  }

  static changeLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      if (!link.classList.contains('link-changed')) {
        link.addEventListener('click', (e) => {
          if (!(link instanceof HTMLAnchorElement)) return;
          if (link.getAttribute('href')?.startsWith('#')) return;
          if (link.origin !== window.location.origin) return;

          const linkUrl = new URL(link.href);
          const linkPathname = getAppPathname(linkUrl.pathname);
          const currentPathname = getAppPathname(window.location.pathname);
          const canRender =
            linkPathname === '/' ||
            linkPathname === PagesList.catalogPage ||
            linkPathname === PagesList.cartPage ||
            isPlantsId(linkPathname);

          if (canRender) {
            e.preventDefault();
            if (linkPathname !== currentPathname || linkUrl.search !== window.location.search) {
              Router.goTo(`${linkPathname}${linkUrl.search}${linkUrl.hash}`);
            }
          }
        });
        link.classList.add('link-changed');
      }
    });
  }

  static startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(getAppPathname(new URL(window.location.href).pathname));
    });
    const page = getAppPathname(new URL(window.location.href).pathname);
    Router.render(page);
  }
}

export default Router;
