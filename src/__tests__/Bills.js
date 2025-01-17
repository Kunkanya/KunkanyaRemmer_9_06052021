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

import router from "../app/Router.js";
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
      router()
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
    test('[Mes notes de frais] should be on the page', ()=>{
      document.body.innerHTML = BillsUI({data: bills})
      const title = screen.getByText('Mes notes de frais')
      expect(title).toBeVisible()
    })
  })
  
  describe('When I am on Bill page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am on Bill page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      document.body.innerHTML = BillsUI({ error: 'some error message' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
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
    test('the event handleClickIconEye should has been called', () =>{
      //Kunkanya : .modal is bootstrap so we have to mock this function
      $.fn.modal = jest.fn(() => $());
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
      const icon1 = icons[1]
      
      
      const eventHandleIconEye = jest.fn(bill.handleClickIconEye(icon1))
      icon1.addEventListener('click', eventHandleIconEye)
      //Kunkanya: check if this event handleClickIconEye has been called
      userEvent.click(icon1)  
      expect(eventHandleIconEye).toHaveBeenCalled()
    })
  })


  describe('when i click on the new bill icon', ()=>{
    test('the new bill page should be open',()=>{
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

      const btnNewBill = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn((e) => bill.handleClickNewBill(e))
      btnNewBill.addEventListener('click', handleClickNewBill)
      userEvent.click(btnNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()

      const newBillForm = screen.getByText(/envoyer une note de frais/i)
      expect(newBillForm).toBeTruthy()
      const file = screen.getByTestId('file')
      expect(file).toBeTruthy()
    })
  })
})

//Kunkanya: test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bill page", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText(/Mes notes de frais/))
      const contentPending  = await screen.getByText(/En attente/)
      expect(contentPending).toBeTruthy()
      const contentRefused  = await screen.getByText(/accepté/i)
      expect(contentRefused).toBeTruthy()
      expect(screen.getByTestId("tbody")).toBeTruthy()
    })
  })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })

  })
})


