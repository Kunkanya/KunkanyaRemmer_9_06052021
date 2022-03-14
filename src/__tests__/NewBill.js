/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/dom"
import {toHaveClass, toBeInTheDocument, toHaveTextContent} from "@testing-library/jest-dom"
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import { bills } from "../fixtures/bills.js";


jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should render newbill page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      //Kunkanya
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
        expect(screen.getByTestId('form-new-bill')).toBeTruthy()
        expect(screen.getByPlaceholderText(/vol paris londres/i)).toBeInTheDocument()
        expect(screen.getByTestId('expense-type')).toBeTruthy()
        expect(screen.getByTestId('expense-name')).toBeTruthy()
        expect(screen.getByTestId('datepicker')).toBeTruthy()
        expect(screen.getByTestId('amount')).toBeTruthy()
        expect(screen.getByPlaceholderText(/348/)).toBeInTheDocument()
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
      test('then it should render NewBill page',()=>{
        const html =  NewBillUI({})
        document.body.innerHTML =  html

        const depenseInput = screen.getByTestId('expense-name')
        expect(depenseInput.getAttribute('placeholder')).toBe('Vol Paris Londres')
        expect(depenseInput.value).toBe('')

        const amountInput = screen.getByTestId('amount')
        expect(amountInput.value).toBe('')

        const dateInput =  screen.getByTestId('datepicker')        
        expect(dateInput.value).toBe('')

        const vatInput = screen.getByTestId('vat')
        expect(vatInput.value).toBe('')

        const pctInput = screen.getByTestId('pct')
        expect(pctInput.value).toBe('')
        
        const fileInput = screen.getByTestId('file')
        expect(fileInput.value).toBe('')

        const form = screen.getByTestId('form-new-bill')
        const handleSubmit = jest.fn((e)=> e.preventDefault())
        form.addEventListener('submit', handleSubmit)
        fireEvent.submit(form)
        expect(screen.getByTestId('form-new-bill')).toBeTruthy()
      })
    })


  describe('When I am on NewBill Page and click button change file',()=>{
    describe('when I put the correct file type (jpeg, jpg, png)',() => {
      test('file name should appear', async ()=>{
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

  describe("When I do fill fields in correct format and I click on submit envoyer button in Newbill page", () => {
    test("it should render Bill page with new bill", () => {
      const html = NewBillUI({});
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
          "user",
          JSON.stringify({
              email: "johnDoe@azerty.com",
          }),
      );
      const store = null;
      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });
  
      const bill = {
          "id": "47qAXb6fIm2zOKkLzMro",
          "vat": "80",
          "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          "status": "pending",
          "type": "Hôtel et logement",
          "commentary": "Test bill",
          "name": "encore",
          "fileName": "preview-facture-free-201801-pdf-1.jpg",
          "date": "2004-04-04",
          "amount": 1400,
          "email": "a@a",
          "pct": 20,
      };

      const btnSubmit = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBill.handleSubmit);  

      screen.getByTestId("expense-name").value = bill.name;
      screen.getByTestId("datepicker").value = bill.date;
      screen.getByTestId("expense-type").value = bill.type;
      screen.getByTestId("amount").value = bill.amount;
      screen.getByTestId("vat").value = bill.vat;
      screen.getByTestId("pct").value = bill.pct
      screen.getByTestId("commentary").value = "Hello"

      btnSubmit.addEventListener("submit", handleSubmit);
      fireEvent.submit(btnSubmit);
  
      expect(handleSubmit).toHaveBeenCalled();
      const billPage = screen.getByText(/mes notes de frais/i)
      expect(billPage).toBeTruthy()

      
    })
  })  
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to NewBill", () => {
    test("it should render NewBill elements", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByText("Envoyer une note de frais"))
      const contentType  = await screen.getByText("Type de dépense")
      expect(contentType).toBeTruthy()
      const contentHeader  = await screen.getByText("Envoyer une note de frais")
      expect(contentHeader).toBeTruthy()
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
    })
  })
  test("post bill to mock API", async () => {
    const html = NewBillUI({});
    document.body.innerHTML = html;
    const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
    };
    const store = mockStore;
    const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });
    //Kunkanya : create new bill for the test
    const newbillData = {
      "id": "123456789",
      "vat": "80",
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
      "status": "pending",
      "type": "Hôtel et logement",
      "commentary": "séminaire billed",
      "name": "encore",
      "fileName": "preview-facture-free-201801-pdf-1.jpg",
      "date": "2004-04-04",
      "amount": 400,
      "commentAdmin": "newBill post data",
      "email": "a@a",
      "pct": 20
  };
  const getSpy = jest.spyOn(mockStore, "bills")
  const bill = await mockStore.bills().update(newbillData)
  console.log("bill", bill)
  expect(getSpy).toHaveBeenCalledTimes(1)
  expect(bill.status).toBe('pending')
//  expect(bill.id).toBe('47qAXb6fIm2zOKkLzMro')

 // const post = await mockStore.bills().post(newbillData)
  //console.log(post)
 // expect(post.length).toEqual(5)
const tesz = await mockStore.bills.mockImplementationOnce(() => {
  return {
    create : () =>  {
      bills().list.push(newBillData)
      console.log(bills)
      return Promise.resolve (bills.list)
    }
  }})



})

describe("When an error occurs on API", () => {
  test("fetches bills from an API and fails with 404 message error", async () => {
    jest.spyOn(mockStore, "bills")
    mockStore.bills.mockImplementationOnce(() => {
        return {
          create : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      document.body.innerHTML = BillsUI({error : "Erreur 404"})
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    }) 

    test("fetches bills from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})
      document.body.innerHTML = BillsUI({error : "Erreur 500"})
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
