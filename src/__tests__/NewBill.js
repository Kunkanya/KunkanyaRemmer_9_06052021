/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/dom"
import userEvent from "@testing-library/user-event";
import {toHaveClass, toBeInTheDocument, toHaveTextContent} from "@testing-library/jest-dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";

import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js"

//jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should render newbill page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      //Kunkanya
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
        expect(screen.getByTestId('form-new-bill')).toBeTruthy()
        expect(screen.getByTestId('expense-type')).toBeTruthy()
        expect(screen.getByTestId('expense-name')).toBeTruthy()
        expect(screen.getByTestId('datepicker')).toBeTruthy()
        expect(screen.getByTestId('amount')).toBeTruthy()
        expect(screen.getByTestId('vat')).toBeTruthy()
        expect(screen.getByTestId('pct')).toBeTruthy()
        expect(screen.getByTestId('commentary')).toBeTruthy()
        expect(screen.getByTestId('file')).toBeTruthy()
    })
  

    test('Then mail icon in vertical layout should be highlighted', async()=>{
      Object.defineProperty(window, 'localStorage', { 
        value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toHaveClass('active-icon')
    })
  })

    describe("When I do not fill fields and I click envoyer button", () => {
      test('then it should say the date is required',()=>{
        const html =  NewBillUI({})
        document.body.innerHTML =  html
        
        const date =  screen.getByTestId('datepicker')        
        expect(date).toBeRequired()
      })
    })


    describe('When I am on NewBill Page and click button change file',()=>{
    test('the function handleChangeFile should have been called',async ()=>{
      //to mock alert function in window
      global.alert = jest.fn();
      const html =  NewBillUI({})
      document.body.innerHTML =  html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const store = null
      const newBill = new NewBill({document, onNavigate, store, localStorage: window.localStorage
      })

      const fileName = "1.jpg"
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const btnFile = screen.getByTestId('file')
      btnFile.addEventListener('change', handleChangeFile)
      fireEvent.change(btnFile,{targer : {value:[fileName]}})
      await expect(handleChangeFile).toHaveBeenCalledTimes(1)
    })
    test('file name should appear after click change file button', async()=>{
      global.alert = jest.fn();
      const html =  NewBillUI({})
      document.body.innerHTML =  html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const store = null
      const newBill = new NewBill({document, onNavigate, store, localStorage: window.localStorage
      })

      const fileName = "1.jpg"
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const btnFile = screen.getByTestId('file')
      
      btnFile.addEventListener('change', handleChangeFile)
      await fireEvent.change(btnFile,{targer : {value:[fileName]}})
       expect(screen.getByTestId('file').fileName.value).toBe(fileName)
    })
  })


})
