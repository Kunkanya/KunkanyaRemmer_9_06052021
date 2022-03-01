/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import {toHaveClass, toBeInTheDocument, toHaveTextContent} from "@testing-library/jest-dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import NewBillUI from "../views/NewBillUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

import Router from "../app/Router.js";
import userEvent from "@testing-library/user-event"

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { 
        value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      Router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      //Kunkanya add import {toHaveClass} from "@testing-library/jest-dom" and check the class
      expect(windowIcon).toHaveClass("active-icon")
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    //Kunkanya add test for button "Nouvelle note de frais"
    test("the button new bill should be visible", () =>{
      document.body.innerHTML = BillsUI({data: bills})
      const newBillButton = screen.getByTestId("btn-new-bill")
      expect(newBillButton).toBeTruthy()
    })

    test('Mes notes de frais should be on the page', ()=>{
      document.body.innerHTML = BillsUI({data: bills})
      const title = screen.getByText('Mes notes de frais')
      expect(title).toBeVisible()
    })
  })

  describe('When I am on the bills page', ()=>{
    test('icon-eye button should be visible',()=>{ 
      document.body.innerHTML = BillsUI({data: bills})
      const iconEye = screen.getAllByTestId('icon-eye')    
      expect(iconEye).toBeTruthy()
     })
  })

  describe('when i click on the icon eye', ()=>{
    test('A modal should open', () =>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html =  BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const bill = new Bills({document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const icons = screen.getAllByTestId('icon-eye')
      const icon1 = icons[0]

      const eventHandleIconEye = jest.fn((e) => bill.handleClickIconEye(e))
      icon1.addEventListener('click', eventHandleIconEye)

      userEvent.click(icon1)
      expect(eventHandleIconEye).toBeCalled()

      const modale = screen.getAllByText('Justificatif')
      expect(modale).toBeTruthy()

    })
  })
})



