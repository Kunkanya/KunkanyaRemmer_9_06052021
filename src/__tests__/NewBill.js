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
      screen.debug()
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
        expect(screen.getByTestId('errorMessageFile').innerHTML).toEqual('')
   
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

    describe('when I put the correct file type (jpeg, jpg, png)',() => {
      test('file name should appear', async ()=>{
        global.alert = jest.fn();
        const fileData = {
          file : 'image.jpeg',
          type : 'image/jpeg'
        }
        const errMessage ="Seuls les formats de fichiers (jpg, jpeg, png) sont autorisés"
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
  
        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')
        inputFile.addEventListener('change', handleChangeFile)
  
        fireEvent.change(inputFile, {target: {files :
                    [new File(["newFile"], fileData.file, { type: fileData.type })],
                  }})
        await expect(handleChangeFile).toHaveBeenCalled()
        await expect(screen.getByTestId('errorMessageFile').innerHTML).toEqual('')
        await expect(inputFile.files[0].name).toBe(fileData.file)              
      })  
    })
 
    describe('when I put the incorrect file type (ex: txt)',() => {
      test('the error message should appear', async ()=>{
        global.alert = jest.fn();
        const fileData = {
          file : 'text.txt',
          type : 'text/txt'
        }
        const errMessage ="Seuls les formats de fichiers (jpg, jpeg, png) sont autorisés"
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
  
        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')
        inputFile.addEventListener('change', handleChangeFile)
  
        fireEvent.change(inputFile, {target: {files :
                    [new File(["newFile"], fileData.file, { type: fileData.type })],
        }})  
        await expect(handleChangeFile).toHaveBeenCalledTimes(1)
        await expect(screen.getByTestId('errorMessageFile').innerText).toBe(errMessage)
      })  
    })
 
  })


})
