/**
 * @jest-environment jsdom
 */
import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      //KUNKANYA : below Regex format is (Ex: 1978-10-04)
      //const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      //KUNKANYA : change REGEX to match this format ( 04 Jan. 98) because the above Regex formt doesnt match in the date format in BillUL.js
      const dates = screen.getAllByText(/^([0-9]|[12][0-9]|3[01])[- /.]([a-z][a-z][a-z])[- /.][ ]\d\d$/i).map(a=> a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})
