/**
 * @jest-environment jsdom
 */

 import {fireEvent, getByTestId, screen, waitfor } from "@testing-library/dom"
 import {toHaveClass, toHaveAttribute, tohaveStyle} from "@testing-library/jest-dom"
 import userEvent from "@testing-library/user-event"
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import Store from "../app/Store.js"
 import {ROUTES, ROUTES_PATH} from "../constants/routes.js"
 import Router from "../app/Router.js"
 import { localStorageMock } from "../__mocks__/localStorage.js"
 import store from "../__mocks__/store.js"
 


 
 describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       //to-do write expect expression
       expect(icon.classList.contains('active-icon')).toBeTruthy
 
     })
     test("Then bills should be ordered from earliest to latest", () => {
       document.body.innerHTML = BillsUI({ data: bills })
      //KUNKANYA : below Regex format is (Ex: 1978-10-04)
      //const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      //KUNKANYA : change REGEX to match this format ( 04 Jan. 98) because the above Regex formt doesnt match in the date format in BillUL.js
      //const dates = screen.getAllByText(/^([0-9]|[12][0-9]|3[01])[- /.]([a-z][a-z][a-z])[- /.][ ]\d\d$/i).map(a=> a.innerHTML)

       const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
       const antiChrono = (a, b) => ((a < b) ? 1 : -1)
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
   })
 })