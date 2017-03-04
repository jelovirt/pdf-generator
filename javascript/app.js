import PdfPageController from './app/PdfPageController'
import PageController from './app/features/PageController'
import HeaderController from './app/features/HeaderController'
import LayoutController from './app/features/LayoutController'
import StyleController from './app/features/StyleController'
import OtherController from './app/features/OtherController'
import CoverController from './app/features/CoverController'

window.addEventListener('load', () => {
  PdfPageController([
    PageController,
    HeaderController,
    LayoutController,
    CoverController,
    StyleController,
    OtherController
  ])
}, false)
