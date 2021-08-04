import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import {
  getDisplayedColumnArray,
  isNumberOfProductsSameAsInSelectResultsOnPage
} from "../../../steps/catalog/products/productsListSteps";
import { waitForProgressBarToNotExist } from "../../../steps/shared/progressBar";
import filterTests from "../../../support/filterTests";
import { urlList } from "../../../url/urlList";

filterTests(["all"], () => {
  describe("Products", () => {
    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
      cy.visit(urlList.products);
    });
    it("Should go to the next page", () => {
      cy.softExpectSkeletonIsVisible();
      cy.get(PRODUCTS_LIST.productsList)
        .should("be.visible")
        .get(PRODUCTS_LIST.emptyProductRow)
        .should("not.exist")
        .get(PRODUCTS_LIST.previousPagePagination)
        .should("be.disabled");
      let firstPageProducts;
      getDisplayedColumnArray("name").then(
        productsList => (firstPageProducts = productsList)
      );
      cy.addAliasToGraphRequest("ProductList");
      cy.get(PRODUCTS_LIST.nextPageButton).click();
      waitForProgressBarToNotExist();
      cy.wait("@ProductList");
      getDisplayedColumnArray("name").then(productList => {
        expect(productList).to.not.equal(firstPageProducts);
      });
      cy.get(PRODUCTS_LIST.previousPagePagination).then($button => {
        expect($button).to.be.enabled;
      });
    });
    it("should displayed correct number of results per page", () => {
      cy.softExpectSkeletonIsVisible();
      isNumberOfProductsSameAsInSelectResultsOnPage().then(
        isTheSame =>
          expect(isTheSame, "check if number of displayed products is correct")
            .to.be.true
      );
      cy.get(PRODUCTS_LIST.resultsOnPageSelect)
        .click()
        .get(
          `${PRODUCTS_LIST.rowNumberOption}${BUTTON_SELECTORS.notSelectedOption}`
        )
        .first()
        .click();
      waitForProgressBarToNotExist();
      isNumberOfProductsSameAsInSelectResultsOnPage().then(
        isTheSame =>
          expect(
            isTheSame,
            "check if number of displayed products is correct, after changing results number in table footer"
          ).to.be.true
      );
    });
  });
});
